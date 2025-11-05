import { NextResponse } from "next/server";
import type { Order } from "../../../../../lib/types";
import { findOrderById } from "../../../../../lib/order-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// This endpoint now returns order data as JSON
// PDF generation happens on the client side
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log('Receipt API: Fetching order', id);
    const { order: storedOrder } = await findOrderById(id);

    if (!storedOrder) {
      console.error('Receipt API: Order not found', id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    console.log('Receipt API: Order found, returning data for client-side PDF generation');

    // Convert Prisma order to our Order type
    const order: Order = {
      id: storedOrder.id,
      createdAt: storedOrder.createdAt.toISOString(),
      customer: { 
        name: storedOrder.customerName, 
        email: storedOrder.customerEmail, 
        phone: storedOrder.customerPhone || undefined,
        address: storedOrder.customerAddress || undefined,
      },
      items: storedOrder.items,
      total: storedOrder.total,
      proofFilename: storedOrder.proofFilename || undefined,
    };

    // Return order data - client will generate PDF
    return NextResponse.json(order);
  } catch (error) {
    console.error('Receipt data fetch failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch receipt data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
