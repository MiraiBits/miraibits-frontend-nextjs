import nodemailer from 'nodemailer';
import type { Order } from './types';
import { getProductById } from './products';

export async function sendOrderEmail(order: Order) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
    console.warn('[email] SMTP env not fully configured; skipping email send.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const itemLines = order.items
    .map(it => {
      const p = getProductById(it.productId);
      const name = p ? p.name : it.productId;
      const lineTotal = it.price * it.quantity;
      return `- ${name} x ${it.quantity} = ¥${lineTotal.toLocaleString()}`;
    })
    .join('\n');

  const text = `New order ${order.id}\n\nCustomer:\nName: ${order.customer.name}\nEmail: ${order.customer.email}\nPhone: ${order.customer.phone ?? ''}\nAddress: ${order.customer.address ?? ''}\n\nItems:\n${itemLines}\n\nTotal: ¥${order.total.toLocaleString()}\nProof: ${order.proofFilename ?? 'N/A'}\nCreated: ${order.createdAt}`;

  await transporter.sendMail({
    from: `Miraibits Orders <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject: `Miraibits Order ${order.id}`,
    text,
  });
}


