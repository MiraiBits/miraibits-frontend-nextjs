import jsPDF from 'jspdf';
import type { Order } from './types';
import { ShareTechMonoBase64 } from './fonts/ShareTechMono-font';

// Constants for PDF layout
const doc = {
  padding: {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  width: 210, // A4 width in mm
  height: 297, // A4 height in mm
  font: 'ShareTechMono',
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Miraibits',
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Colombo, Sri Lanka',
};

// Helper function to add the custom font
function addCustomFont(pdf: jsPDF) {
  pdf.addFileToVFS('ShareTechMono-Regular.ttf', ShareTechMonoBase64);
  pdf.addFont('ShareTechMono-Regular.ttf', doc.font, 'normal');
  pdf.setFont(doc.font);
}

// Helper to draw the main header
function drawHeader(pdf: jsPDF) {
  pdf.setFillColor(243, 244, 246);
  pdf.rect(0, 0, doc.width, 35, 'F');
  
  pdf.setFontSize(22);
  pdf.setFont(doc.font, 'normal');
  pdf.setTextColor(17, 24, 39);
  pdf.text(doc.companyName, doc.padding.left, 22);
}

// Helper to draw the "Billed To" and "Order Details" section
function drawBilledToAndOrderInfo(pdf: jsPDF, order: Order) {
  const { id, createdAt, customer } = order;
  const billedToY = 50;

  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('BILLED TO', doc.padding.left, billedToY);

  pdf.setFontSize(11);
  pdf.setTextColor(17, 24, 39);
  pdf.text(customer.name, doc.padding.left, billedToY + 7);
  pdf.text(customer.email, doc.padding.left, billedToY + 12);
  if (customer.phone) pdf.text(customer.phone, doc.padding.left, billedToY + 17);
  if (customer.address) pdf.text(customer.address, doc.padding.left, billedToY + 22);

  const orderInfoX = doc.width - doc.padding.right;
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('RECEIPT NO.', orderInfoX, billedToY, { align: 'right' });
  pdf.text('DATE', orderInfoX, billedToY + 10, { align: 'right' });

  pdf.setFontSize(11);
  pdf.setTextColor(17, 24, 39);
  pdf.text(id, orderInfoX, billedToY + 5, { align: 'right' });
  pdf.text(new Date(createdAt).toLocaleDateString(), orderInfoX, billedToY + 15, { align: 'right' });
}


// Helper to draw the items table
function drawItemsTable(pdf: jsPDF, items: Order['items'], startY: number): number {
  let y = startY;

  // Table Header
  pdf.setFillColor(243, 244, 246);
  pdf.rect(doc.padding.left, y, doc.width - doc.padding.left * 2, 8, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  pdf.text('ITEM', doc.padding.left + 5, y + 5.5);
  pdf.text('QTY', doc.width / 2, y + 5.5, { align: 'center' });
  pdf.text('PRICE', doc.width - doc.padding.right - 45, y + 5.5, { align: 'right' });
  pdf.text('TOTAL', doc.width - doc.padding.right - 5, y + 5.5, { align: 'right' });
  y += 12;

  // Table Rows
  pdf.setFontSize(10);
  pdf.setTextColor(17, 24, 39);

  items.forEach(item => {
    const productName = item.productName || item.productId;
    const price = `Rs. ${item.price.toLocaleString()}`;
    const total = `Rs. ${(item.price * item.quantity).toLocaleString()}`;

    pdf.text(productName, doc.padding.left + 5, y);
    pdf.text(String(item.quantity), doc.width / 2, y, { align: 'center' });
    pdf.text(price, doc.width - doc.padding.right - 45, y, { align: 'right' });
    pdf.text(total, doc.width - doc.padding.right - 5, y, { align: 'right' });
    y += 8;
  });

  return y;
}


// Helper to draw the total and footer
function drawTotalAndFooter(pdf: jsPDF, total: number, startY: number): number {
  let y = startY + 5;
  
  // Grand Total
  const totalX = doc.width - doc.padding.right - 5;
  pdf.setFontSize(12);
  pdf.setFont(doc.font, 'normal');
  pdf.text('Grand Total', totalX - 40, y);
  pdf.text(`Rs. ${total.toLocaleString()}`, totalX, y, { align: 'right' });
  
  // Footer
  y = doc.height - doc.padding.bottom - 10;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(doc.padding.left, y, doc.width - doc.padding.right, y);
  
  y += 8;
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Thank you for your business!', doc.padding.left, y);
  
  const footerText = `${doc.companyName} | ${doc.companyAddress}`;
  pdf.text(footerText, doc.width - doc.padding.right, y, { align: 'right' });

  return y;
}


export function generateReceiptPdfClient(order: Order): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  addCustomFont(pdf);
  drawHeader(pdf);
  drawBilledToAndOrderInfo(pdf, order);

  let yPos = 95;
  yPos = drawItemsTable(pdf, order.items, yPos);
  
  drawTotalAndFooter(pdf, order.total, yPos);

  return pdf;
}


export function downloadReceiptPdf(order: Order, filename?: string) {
  const pdf = generateReceiptPdfClient(order);
  pdf.save(filename || `miraibits-receipt-${order.id}.pdf`);
}

export function getReceiptPdfBlob(order: Order): Blob {
  const pdf = generateReceiptPdfClient(order);
  return pdf.output('blob');
}

export function getReceiptPdfBase64(order: Order): string {
  const pdf = generateReceiptPdfClient(order);
  return pdf.output('datauristring').split(',')[1];
}
