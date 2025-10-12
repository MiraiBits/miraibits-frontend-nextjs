import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import type { Order } from '../../../../../lib/types';
import { renderOrderReceiptHtml } from '../../../../../lib/email';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: any) {
  const id = params?.id as string;
  const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

  let orders: Order[] = [];
  try {
    const content = await readFile(ORDERS_FILE, 'utf8');
    orders = JSON.parse(content) as Order[];
  } catch {}

  const order = orders.find(o => o.id === id);
  if (!order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = renderOrderReceiptHtml(order);
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="miraibits-receipt-${id}.html"`,
    },
  });
}


