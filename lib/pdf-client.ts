import jsPDF from 'jspdf';
import type { Order } from './types';
import { ShareTechMonoBase64 } from './fonts/ShareTechMono-font';
import { MiraiLogoBase64 } from './images/mirailk-logo';

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
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = Math.max(total - subtotal, 0);
  const grandTotal = subtotal + shippingFee;
  const orderDate = new Date(createdAt).toLocaleString();
  
  // Company Header
  const logoWidth = 45;
  const logoHeight = 15;
  const headerTop = 20;
  
  // Header text block on the left
  const headerLeftX = 15;
  pdf.setTextColor(83, 95, 121);
  pdf.setFontSize(18);
  pdf.text('Receipt', headerLeftX, headerTop + 4);
  pdf.setFontSize(11);
  pdf.setTextColor(103, 112, 133);
  pdf.text(`Order ${id}`, headerLeftX, headerTop + 14);
  pdf.text(orderDate, headerLeftX, headerTop + 21);
  
  // Logo on the right
  const logoX = 195 - logoWidth;
  pdf.addImage(MiraiLogoBase64, 'PNG', logoX, headerTop - 4, logoWidth, logoHeight, undefined, 'FAST');
  
  // Divider
  const dividerY = headerTop + logoHeight + 22;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(15, dividerY, 195, dividerY);
  
  let yPos = dividerY + 12;
  
  // Billed To
  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39); // Dark
  pdf.setFont('ShareTechMono');
  pdf.text('Billed To', 15, yPos);
  
  pdf.setFontSize(10);
  yPos += 7;
  pdf.text(name, 15, yPos);
  yPos += 5;
  pdf.text(`${email}${phone ? ' • ' + phone : ''}`, 15, yPos);
  yPos += 5;
  pdf.setTextColor(107, 114, 128);
  pdf.text(address || 'N/A', 15, yPos);
  
  // Divider
  yPos += 8;
  pdf.setTextColor(17, 24, 39);
  pdf.line(15, yPos, 195, yPos);
  yPos += 10;
  
  // Items Header
  pdf.setFontSize(12);
  pdf.text('Items', 15, yPos);
  
  // Table Header
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  yPos += 8;
  pdf.text('Slug', 15, yPos);
  pdf.text('Qty', 120, yPos, { align: 'center' });
  pdf.text('Price', 150, yPos, { align: 'right' });
  pdf.text('Total', 185, yPos, { align: 'right' });
  
  yPos += 2;
  pdf.setDrawColor(243, 244, 246);
  pdf.line(15, yPos, 195, yPos);
  yPos += 8;
  
  // Table Rows
  pdf.setTextColor(17, 24, 39);
  pdf.setFont('ShareTechMono');
  
  items.forEach((item) => {
    const label = item.slug || item.productId;
    pdf.text(label, 15, yPos);
    pdf.text(String(item.quantity), 120, yPos, { align: 'center' });
    pdf.text(`Rs. ${item.price.toLocaleString()}`, 150, yPos, { align: 'right' });
    pdf.text(`Rs. ${(item.price * item.quantity).toLocaleString()}`, 185, yPos, { align: 'right' });
    yPos += 7;
  });
  
  // Divider
  yPos += 3;
  pdf.line(15, yPos, 195, yPos);
  
  // Totals
  yPos += 8;
  pdf.setFont('ShareTechMono');
  pdf.setFontSize(10);
  pdf.text(`Subtotal: Rs. ${subtotal.toLocaleString()}`, 185, yPos, { align: 'right' });
  yPos += 6;
  pdf.text(`Shipping: Rs. ${shippingFee.toLocaleString()}`, 185, yPos, { align: 'right' });
  yPos += 8;
  pdf.setFontSize(11);
  pdf.text(`Grand Total: Rs. ${grandTotal.toLocaleString()}`, 185, yPos, { align: 'right' });
  
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
