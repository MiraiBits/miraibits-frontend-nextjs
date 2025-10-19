import { NextResponse } from "next/server";
import type { Order } from "../../../../../lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Lazy load prisma only at runtime, not during build
const getPrisma = async () => {
  const { default: prisma } = await import("../../../../../lib/db");
  return prisma;
};

// This endpoint now returns order data as JSON
// PDF generation happens on the client side
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log('Receipt API: Fetching order', id);
    const prisma = await getPrisma();
    const dbOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!dbOrder) {
      console.error('Receipt API: Order not found', id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    console.log('Receipt API: Order found, returning data for client-side PDF generation');

    // Convert Prisma order to our Order type
    const order: Order = {
      id: dbOrder.id,
      createdAt: dbOrder.createdAt.toISOString(),
      customer: { 
        name: dbOrder.customerName, 
        email: dbOrder.customerEmail, 
        phone: dbOrder.customerPhone || undefined,
        address: dbOrder.customerAddress || undefined,
      },
      items: dbOrder.items as any,
      total: dbOrder.total,
      proofFilename: dbOrder.proofFilename || undefined,
    };

    // Return order data - client will generate PDF
    return NextResponse.json(order);
  } catch (error) {
    console.error('Receipt data fetch failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch receipt data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
