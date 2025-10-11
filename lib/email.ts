import nodemailer from 'nodemailer';
import type { Order } from './types';
import { getProductById } from './products';

function renderItemsTableRows(order: Order): string {
  return order.items
    .map(it => {
      const product = getProductById(it.productId);
      const name = product ? product.name : it.productId;
      const lineTotal = it.price * it.quantity;
      return `
        <tr>
          <td style="padding:8px 0; color:#111827;">${name}</td>
          <td style="padding:8px 0; color:#6B7280; text-align:center;">${it.quantity}</td>
          <td style="padding:8px 0; color:#111827; text-align:right;">Rs. ${it.price.toLocaleString('en-LK')}</td>
          <td style="padding:8px 0; color:#111827; text-align:right;">Rs. ${lineTotal.toLocaleString('en-LK')}</td>
        </tr>`;
    })
    .join('');
}

function styles() {
  return `
    body{margin:0;background:#F9FAFB;color:#111827;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}
    .container{max-width:640px;margin:0 auto;padding:24px}
    .card{background:rgba(255,255,255,0.92);backdrop-filter:saturate(180%) blur(10px);border:1px solid #F3F4F6;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.06);}
    .card-inner{padding:24px}
    .muted{color:#6B7280}
    .divider{height:1px;background:#F3F4F6;margin:16px 0}
    .total{font-weight:600}
    .logo-dot{display:inline-block;height:24px;width:24px;border-radius:9999px;background:#ffe4ec;border:1px solid #fec7d8;margin-right:8px;vertical-align:middle}
    .brand{font-weight:600;letter-spacing:0.02em}
    table{width:100%;border-collapse:collapse}
    th{color:#6B7280;font-weight:500;text-align:left;padding:0 0 6px 0;border-bottom:1px solid #F3F4F6}
  `;
}

export function renderOrderEmailHtml(order: Order): string {
  const rows = renderItemsTableRows(order);
  const COMPANY_LOCATION = process.env.COMPANY_ADDRESS || 'Colombo, Sri Lanka';
  const BRAND = process.env.COMPANY_NAME || 'Miraibits';
  return `<!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <style>${styles()}</style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="card-inner">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span class="logo-dot"></span>
              <span class="brand">${BRAND}</span>
            </div>
            <h1 style="font-size:20px;margin:8px 0 0 0;">New Order ${order.id}</h1>
            <p class="muted" style="margin:4px 0 0 0;">${COMPANY_LOCATION} • ${new Date(order.createdAt).toLocaleString()}</p>
            <div class="divider"></div>
            <h2 style="font-size:16px;margin:0 0 8px 0;">Customer</h2>
            <p style="margin:0;">
              <strong>${order.customer.name}</strong><br />
              ${order.customer.email}${order.customer.phone ? ' • ' + order.customer.phone : ''}<br />
              <span class="muted">${order.customer.address ?? ''}</span>
            </p>
            <div class="divider"></div>
            <h2 style="font-size:16px;margin:0 0 8px 0;">Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Price</th>
                  <th style="text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="divider"></div>
            <p class="total" style="margin:0;text-align:right;">Grand Total: Rs. ${order.total.toLocaleString('en-LK')}</p>
            <div style="margin-top:16px;">
              <p class="muted" style="margin:0;">Payment proof filename: ${order.proofFilename ?? 'N/A'}</p>
            </div>
            <div class="divider"></div>
            <p class="muted" style="font-size:12px;margin:0;">${BRAND} • ${COMPANY_LOCATION}</p>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

export function renderOrderReceiptHtml(order: Order): string {
  const rows = renderItemsTableRows(order);
  const COMPANY_LOCATION = process.env.COMPANY_ADDRESS || 'Colombo, Sri Lanka';
  const BRAND = process.env.COMPANY_NAME || 'Miraibits';
  return `<!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${BRAND} Receipt ${order.id}</title>
      <style>${styles()}</style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="card-inner">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span class="logo-dot"></span>
              <span class="brand">${BRAND}</span>
            </div>
            <h1 style="font-size:20px;margin:8px 0 0 0;">Receipt</h1>
            <p class="muted" style="margin:4px 0 0 0;">Order ${order.id} • ${new Date(order.createdAt).toLocaleString()}</p>
            <p class="muted" style="margin:4px 0 0 0;">${COMPANY_LOCATION}</p>
            <div class="divider"></div>
            <h2 style="font-size:16px;margin:0 0 8px 0;">Billed To</h2>
            <p style="margin:0;">
              <strong>${order.customer.name}</strong><br />
              ${order.customer.email}${order.customer.phone ? ' • ' + order.customer.phone : ''}<br />
              <span class="muted">${order.customer.address ?? ''}</span>
            </p>
            <div class="divider"></div>
            <h2 style="font-size:16px;margin:0 0 8px 0;">Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Price</th>
                  <th style="text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="divider"></div>
            <p class="total" style="margin:0;text-align:right;">Grand Total: Rs. ${order.total.toLocaleString('en-LK')}</p>
            <div class="divider"></div>
            <p class="muted" style="font-size:12px;margin:0;">Thank you for your order. This receipt is not a tax invoice.</p>
            <p class="muted" style="font-size:12px;margin:4px 0 0 0;">${BRAND} • ${COMPANY_LOCATION}</p>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

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
      return `- ${name} x ${it.quantity} = Rs. ${lineTotal.toLocaleString('en-LK')}`;
    })
    .join('\n');

  const text = `New order ${order.id}\n\nCustomer:\nName: ${order.customer.name}\nEmail: ${order.customer.email}\nPhone: ${order.customer.phone ?? ''}\nAddress: ${order.customer.address ?? ''}\n\nItems:\n${itemLines}\n\nTotal: Rs. ${order.total.toLocaleString('en-LK')}\nProof: ${order.proofFilename ?? 'N/A'}\nCreated: ${order.createdAt}`;

  await transporter.sendMail({
    from: `Miraibits Orders <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject: `Miraibits Order ${order.id}`,
    text,
    html: renderOrderEmailHtml(order),
    replyTo: order.customer.email,
  });
}


