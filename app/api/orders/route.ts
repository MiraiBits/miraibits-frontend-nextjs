import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '../../../lib/products';
import type { Order } from '../../../lib/types';
import { sendOrderEmail } from '../../../lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy load prisma only at runtime, not during build
const getPrisma = async () => {
  const { default: prisma } = await import("../../../lib/db");
  return prisma;
};

export async function POST(req: NextRequest) {
  try {
    console.log('Order API: Starting order creation...');
    const prisma = await getPrisma();
    console.log('Order API: Prisma client loaded');
    
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
    let total = 0;
    const items: Order['items'] = [];
    for (const it of cart) {
      const p = await getProductById(it.productId);
      if (!p) continue;
      items.push({ productId: p.id, productName: p.name, quantity: it.quantity, price: p.price });
      total += p.price * it.quantity;
    }

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

    // Create order in database
    console.log('Order API: Creating order in database...');
    const dbOrder = await prisma.order.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone || null,
        customerAddress: address || null,
        items: items as any,
        total,
        proofData,
        proofMimeType,
        proofFilename,
      },
    });
    console.log('Order API: Order created successfully', dbOrder.id);

    // Convert Prisma order to our Order type for email
    const order: Order = {
      id: dbOrder.id,
      createdAt: dbOrder.createdAt.toISOString(),
      customer: { 
        name: dbOrder.customerName, 
        email: dbOrder.customerEmail, 
        phone: dbOrder.customerPhone || undefined,
        address: dbOrder.customerAddress || undefined,
      },
      items,
      total: dbOrder.total,
      proofFilename: dbOrder.proofFilename || undefined,
      proofData: dbOrder.proofData || undefined,
      proofMimeType: dbOrder.proofMimeType || undefined,
    };

    // Fire and forget email
    sendOrderEmail(order).catch((err) => {
      console.error('Email send failed:', err);
    });

    // Return JSON so client can perform client-side navigation and clear cart
    console.log('Order API: Returning success response');
    return NextResponse.json({ orderId: dbOrder.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


