import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getProductById } from '../../../lib/products';
import type { Order } from '../../../lib/types';
import { sendOrderEmail } from '../../../lib/email';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

async function ensureDirs() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  await ensureDirs();
  const formData = await req.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const address = String(formData.get('address') || '');
  const cartEncoded = String(formData.get('cart') || '');
  const totalRaw = Number(formData.get('total') || 0);
  const proof = formData.get('proof') as File | null;

  if (!name || !email || !cartEncoded || !proof) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const cart = JSON.parse(decodeURIComponent(cartEncoded)) as Array<{ productId: string; quantity: number }>;

  // Calculate and validate total based on server-side prices
  let total = 0;
  const items: Order['items'] = [];
  for (const it of cart) {
    const p = getProductById(it.productId);
    if (!p) continue;
    items.push({ productId: p.id, quantity: it.quantity, price: p.price });
    total += p.price * it.quantity;
  }

  if (total !== totalRaw) {
    // Not fatal; overwrite with server total
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  let proofFilename: string | undefined;
  if (proof) {
    const arrayBuffer = await proof.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname((proof as any).name || '') || '.bin';
    proofFilename = `${id}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, proofFilename), buffer);
  }

  const order: Order = {
    id,
    createdAt,
    customer: { name, email, phone, address },
    items,
    total,
    proofFilename,
  };

  // Persist to JSON file
  let orders: Order[] = [];
  try {
    const existing = await readFile(ORDERS_FILE, 'utf8');
    orders = JSON.parse(existing);
  } catch {}
  orders.push(order);
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

  // Fire and forget email
  sendOrderEmail(order).catch(() => {});

  // Return JSON so client can perform client-side navigation and clear cart
  return NextResponse.json({ orderId: id }, { status: 201 });
}


