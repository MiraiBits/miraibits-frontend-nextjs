import { NextResponse } from "next/server";
import type { Order } from "../../../../../lib/types";
import { generateReceiptPdf } from "../../../../../lib/pdf";
import prisma from "../../../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const dbOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!dbOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const pdfBuffer = await generateReceiptPdf(order);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="miraibits-receipt-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Receipt generation failed:', error);
    return new Response(JSON.stringify({ error: "Failed to generate receipt" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
