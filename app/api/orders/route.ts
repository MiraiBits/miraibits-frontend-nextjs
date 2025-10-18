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
  // UPLOAD_DIR is no longer needed
  // await mkdir(UPLOAD_DIR, { recursive: true });
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

  if (!name || !email || !cartEncoded) {
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

  const order: Order = {
    id,
    createdAt,
    customer: { name, email, phone, address },
    items,
    total,
  };

  // Fire and forget email
  sendOrderEmail(order).catch(() => {});

  // Return JSON so client can perform client-side navigation and clear cart
  return NextResponse.json({ orderId: id }, { status: 201 });
}


