import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '../../../lib/products';
import type { Order } from '../../../lib/types';
import { sendOrderEmail } from '../../../lib/email';
import { createOrder } from '../../../lib/order-store';
import { calculateShippingFeeForItems } from '../../../lib/pricing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('Order API: Starting order creation...');
    const formData = await req.formData();
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const phone = String(formData.get('phone') || '');
    const address = String(formData.get('address') || '');
    const cartEncoded = String(formData.get('cart') || '');
    const totalRaw = Number(formData.get('total') || 0);
    const proof = formData.get('proof') as File | null;

    console.log('Order API: Form data received', { name, email, hasProof: !!proof, cartLength: cartEncoded.length });

    if (!name || !email || !cartEncoded || !proof) {
      console.error('Order API: Missing required fields', { name: !!name, email: !!email, cartEncoded: !!cartEncoded, proof: !!proof });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cart = JSON.parse(decodeURIComponent(cartEncoded)) as Array<{ productId: string; quantity: number }>;

    // Calculate and validate total based on server-side prices
    let subtotal = 0;
    const items: Order['items'] = [];
    for (const it of cart) {
      const p = await getProductById(it.productId);
      if (!p) continue;
      items.push({
        productId: p.id,
        slug: p.slug || p.id,
        quantity: it.quantity,
        price: p.price,
      });
      subtotal += p.price * it.quantity;
    }

    const shippingFee = calculateShippingFeeForItems(items);
    const total = subtotal + shippingFee;

    // Store proof as base64 in database (Vercel-compatible)
    let proofData: string | null = null;
    let proofMimeType: string | null = null;
    let proofFilename: string | null = null;
    
    if (proof) {
      const arrayBuffer = await proof.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      proofData = buffer.toString('base64');
      proofMimeType = proof.type;
      proofFilename = (proof as any).name || 'proof';
    }

    // Create order using Prisma if available, otherwise fallback storage
    console.log('Order API: Creating order record...');
    const { order: storedOrder, source } = await createOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone || null,
      customerAddress: address || null,
      items,
      total,
      proofData,
      proofMimeType,
      proofFilename,
    });
    console.log('Order API: Order stored via', source, storedOrder.id);

    // Convert Prisma order to our Order type for email
    const order: Order = {
      id: storedOrder.id,
      createdAt: storedOrder.createdAt.toISOString(),
      customer: { 
        name: storedOrder.customerName, 
        email: storedOrder.customerEmail, 
        phone: storedOrder.customerPhone || undefined,
        address: storedOrder.customerAddress || undefined,
      },
      items,
      total: storedOrder.total,
      proofFilename: storedOrder.proofFilename || undefined,
      proofData: storedOrder.proofData || undefined,
      proofMimeType: storedOrder.proofMimeType || undefined,
    };

    // Fire and forget email
    sendOrderEmail(order).catch((err) => {
      console.error('Email send failed:', err);
    });

    // Return JSON so client can perform client-side navigation and clear cart
    console.log('Order API: Returning success response');
    return NextResponse.json({ orderId: storedOrder.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
