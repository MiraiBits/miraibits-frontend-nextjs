import { NextResponse } from "next/server";
import type { Order } from "../../../../../lib/types";
import { generateReceiptPdf } from "../../../../../lib/pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Lazy load prisma only at runtime, not during build
const getPrisma = async () => {
  const { default: prisma } = await import("../../../../../lib/db");
  return prisma;
};

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
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log('Receipt API: Order found, generating PDF...');

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
    console.log('Receipt API: PDF generated, size:', pdfBuffer.length);

    // Convert Uint8Array to Buffer for proper Response handling
    const buffer = Buffer.from(pdfBuffer);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="miraibits-receipt-${id}.pdf"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error('Receipt generation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate receipt';
    return new Response(JSON.stringify({ error: errorMessage, stack: error instanceof Error ? error.stack : undefined }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
