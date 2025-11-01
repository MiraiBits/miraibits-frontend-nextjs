import jsPDF from 'jspdf';
import type { Order } from './types';
import { ShareTechMonoBase64 } from './fonts/ShareTechMono-font';

export function generateReceiptPdfClient(order: Order): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add Share Tech Mono font
  pdf.addFileToVFS('ShareTechMono-Regular.ttf', ShareTechMonoBase64);
  pdf.addFont('ShareTechMono-Regular.ttf', 'ShareTechMono', 'normal');
  pdf.setFont('ShareTechMono');
  
  const {
    id,
    createdAt,
    customer: { name, email, phone, address },
    items,
    total,
  } = order;
  
  // Company Header
  pdf.setFillColor(255, 228, 225); // Brand accent halo
  pdf.circle(15, 15, 4, 'F');
  pdf.setFontSize(16);
  pdf.setFont('ShareTechMono');
  pdf.text(process.env.NEXT_PUBLIC_COMPANY_NAME || 'Mirai.lk', 25, 17);
  
  // Title
  pdf.setFontSize(20);
  pdf.text('Receipt', 15, 35);
  
  // Order info
  pdf.setFontSize(10);
  pdf.setFont('ShareTechMono', 'normal');
  pdf.setTextColor(107, 114, 128); // Gray
  pdf.text(`Order ${id} • ${new Date(createdAt).toLocaleString()}`, 15, 42);
  pdf.text(process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Colombo, Sri Lanka', 15, 47);
  
  // Divider
  pdf.setDrawColor(243, 244, 246);
  pdf.line(15, 52, 195, 52);
  
  // Billed To
  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39); // Dark
  pdf.setFont('ShareTechMono');
  pdf.text('Billed To', 15, 62);
  
  pdf.setFont('ShareTechMono');
  pdf.setFontSize(10);
  pdf.text(name, 15, 69);
  pdf.text(`${email}${phone ? ' • ' + phone : ''}`, 15, 74);
  pdf.setTextColor(107, 114, 128);
  pdf.text(address || 'N/A', 15, 79);
  
  // Divider
  pdf.setTextColor(17, 24, 39);
  pdf.line(15, 84, 195, 84);
  
  // Items Header
  pdf.setFontSize(12);
  pdf.setFont('ShareTechMono');
  pdf.text('Items', 15, 94);
  
  // Table Header
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.setFont('ShareTechMono');
  pdf.text('Product', 15, 102);
  pdf.text('Qty', 120, 102, { align: 'center' });
  pdf.text('Price', 150, 102, { align: 'right' });
  pdf.text('Total', 185, 102, { align: 'right' });
  
  pdf.setDrawColor(243, 244, 246);
  pdf.line(15, 104, 195, 104);
  
  // Table Rows
  pdf.setTextColor(17, 24, 39);
  pdf.setFont('ShareTechMono');
  let yPos = 112;
  
  items.forEach((item) => {
    pdf.text(item.productId, 15, yPos);
    pdf.text(String(item.quantity), 120, yPos, { align: 'center' });
    pdf.text(`Rs. ${item.price.toLocaleString()}`, 150, yPos, { align: 'right' });
    pdf.text(`Rs. ${(item.price * item.quantity).toLocaleString()}`, 185, yPos, { align: 'right' });
    yPos += 7;
  });
  
  // Divider
  yPos += 3;
  pdf.line(15, yPos, 195, yPos);
  
  // Total
  yPos += 8;
  pdf.setFont('ShareTechMono');
  pdf.setFontSize(11);
  pdf.text(`Grand Total: Rs. ${total.toLocaleString()}`, 185, yPos, { align: 'right' });
  
  // Footer
  yPos += 10;
  pdf.line(15, yPos, 195, yPos);
  
  yPos += 7;
  pdf.setFontSize(8);
  pdf.setFont('ShareTechMono');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Thank you for your order. This receipt is not a tax invoice.', 15, yPos);
  
  yPos += 5;
  pdf.text(
    `${process.env.NEXT_PUBLIC_COMPANY_NAME || 'Mirai.lk'} • ${process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Colombo, Sri Lanka'}`,
    15,
    yPos
  );
  
  return pdf;
}

export function downloadReceiptPdf(order: Order, filename?: string) {
  const pdf = generateReceiptPdfClient(order);
  pdf.save(filename || `mirai-lk-receipt-${order.id}.pdf`);
}

export function getReceiptPdfBlob(order: Order): Blob {
  const pdf = generateReceiptPdfClient(order);
  return pdf.output('blob');
}

export function getReceiptPdfBase64(order: Order): string {
  const pdf = generateReceiptPdfClient(order);
  return pdf.output('datauristring').split(',')[1]; // Remove data:application/pdf;base64, prefix
}
