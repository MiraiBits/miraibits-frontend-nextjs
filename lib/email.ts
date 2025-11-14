import { Resend } from "resend";
import type { Order } from "./types";

const LOGO_URL = new URL(
  "/mirailk.png",
  (() => {
    const envUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined);
    if (!envUrl) return "https://mirai.lk";
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  })()
).toString();

const professionalEmailStyles = `
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        background: #f6f7fb;
        color: #0f172a;
        font-family: 'Inter','Segoe UI','Roboto',sans-serif;
      }
      table {
        border-spacing: 0;
      }
      .email-wrapper {
        width: 100%;
        padding: 32px 12px;
        background: #f6f7fb;
      }
      .email-card {
        width: 100%;
        max-width: 680px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid rgba(15, 23, 42, 0.08);
        box-shadow: 0 20px 55px rgba(15, 23, 42, 0.12);
      }
      .email-header {
        background: linear-gradient(135deg, #0f172a, #1e293b);
        padding: 30px 32px;
        text-align: center;
      }
      .email-header img {
        height: 42px;
        width: auto;
        display: inline-block;
      }
      .email-body {
        padding: 32px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.24em;
        font-size: 11px;
        color: #94a3b8;
        margin: 0 0 8px;
      }
      .title {
        margin: 0;
        font-size: 24px;
        color: #0f172a;
      }
      .subtitle {
        margin: 6px 0 24px;
        font-size: 14px;
        color: #475569;
      }
      .info-grid {
        width: 100%;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        margin-bottom: 24px;
      }
      .info-grid td {
        width: 50%;
        padding: 18px 20px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
      }
      .info-grid tr:last-child td {
        border-bottom: none;
      }
      .label {
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #94a3b8;
        margin: 0 0 6px;
      }
      .value {
        font-size: 15px;
        margin: 0;
        font-weight: 600;
        color: #0f172a;
      }
      .muted {
        color: #64748b;
        font-size: 13px;
        margin: 2px 0 0;
      }
      .section-title {
        margin: 24px 0 12px;
        font-size: 12px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #94a3b8;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
      }
      .items-table th {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #94a3b8;
        text-align: left;
        padding-bottom: 12px;
        border-bottom: 1px solid #e2e8f0;
      }
      .items-table td {
        padding: 14px 0;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #0f172a;
      }
      .items-table td:nth-child(2),
      .items-table th:nth-child(2) {
        text-align: center;
      }
      .items-table td:nth-child(3),
      .items-table td:nth-child(4),
      .items-table th:nth-child(3),
      .items-table th:nth-child(4) {
        text-align: right;
      }
      .items-table tr:last-child td {
        border-bottom: none;
      }
      .items-empty {
        text-align: center;
        padding: 18px 0;
        color: #94a3b8;
        font-size: 13px;
      }
      .totals {
        width: 100%;
        margin-top: 16px;
      }
      .totals td {
        padding: 4px 0;
        font-size: 14px;
        color: #0f172a;
      }
      .totals td:last-child {
        text-align: right;
        font-weight: 600;
      }
      .totals .grand td:last-child {
        font-size: 16px;
      }
      .callout {
        margin-top: 24px;
        padding: 16px 20px;
        background: #f1f5f9;
        border-radius: 14px;
        font-size: 13px;
        color: #475569;
      }
      .footer-note {
        text-align: center;
        margin-top: 18px;
        font-size: 12px;
        color: #94a3b8;
      }
      @media (max-width: 600px) {
        .email-body {
          padding: 24px;
        }
        .info-grid td {
          display: block;
          width: 100%;
          border-bottom: 1px solid #e2e8f0;
        }
      }
    `;

function getCompanyInfo() {
  return {
    name: process.env.COMPANY_NAME || "Mirai.lk",
    address: process.env.COMPANY_ADDRESS || "Colombo, Sri Lanka",
    email: process.env.COMPANY_EMAIL || "miraibits.electronics@gmail.com",
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAddress(value?: string | null): string {
  if (!value || !value.trim()) return "Not provided";
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  try {
    return escapeHtml(
      date.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch {
    return escapeHtml(date.toLocaleString());
  }
}

function formatCurrency(value: number): string {
  try {
    return `Rs. ${value.toLocaleString("en-LK")}`;
  } catch {
    return `Rs. ${value.toLocaleString()}`;
  }
}

function buildItemsTable(items: Order["items"]): string {
  if (!items.length) {
    return `
      <table class="items-table" role="presentation" cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td class="items-empty" colspan="4">No line items recorded.</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const rows = items
    .map(
      (item) => `
          <tr>
            <td>${escapeHtml(item.slug || item.productId)}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency(item.price * item.quantity)}</td>
          </tr>
        `
    )
    .join("");

  return `
      <table class="items-table" role="presentation" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th>Slug</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
}

function buildTotalsTable(
  subtotal: number,
  shippingFee: number,
  grandTotal: number
): string {
  return `
      <table class="totals" role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td>Subtotal</td>
          <td>${formatCurrency(subtotal)}</td>
        </tr>
        <tr>
          <td>Shipping</td>
          <td>${formatCurrency(shippingFee)}</td>
        </tr>
        <tr class="grand">
          <td>Grand Total</td>
          <td>${formatCurrency(grandTotal)}</td>
        </tr>
      </table>
    `;
}

function buildEmailDocument(
  title: string,
  bodyContent: string,
  footerContent?: string
): string {
  const { name, address } = getCompanyInfo();
  const safeTitle = escapeHtml(title);
  const defaultFooter = `${escapeHtml(name)} • ${escapeHtml(address)}`;
  const footer = footerContent ?? defaultFooter;

  return `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${safeTitle}</title>
      <style>${professionalEmailStyles}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <table role="presentation" class="email-card" cellpadding="0" cellspacing="0">
          <tr>
            <td class="email-header">
              <img src="${LOGO_URL}" alt="Company logo" />
            </td>
          </tr>
          <tr>
            <td class="email-body">
              ${bodyContent}
            </td>
          </tr>
        </table>
        <p class="footer-note">${footer}</p>
      </div>
    </body>
  </html>
  `;
}

export function renderOrderReceiptHtml(order: Order) {
  const {
    id,
    createdAt,
    customer: { name, email, phone, address },
    items,
    total,
  } = order;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = Math.max(total - subtotal, 0);
  const { email: companyEmailRaw, name: companyNameRaw } = getCompanyInfo();

  const safeOrderId = escapeHtml(id);
  const issuedDate = formatOrderDate(createdAt);
  const customerName = escapeHtml(name);
  const customerEmail = escapeHtml(email);
  const customerPhone = phone ? escapeHtml(phone) : "";
  const customerAddress = formatAddress(address);
  const companyEmail = escapeHtml(companyEmailRaw);
  const companyName = escapeHtml(companyNameRaw);

  const itemsTable = buildItemsTable(items);
  const totalsTable = buildTotalsTable(subtotal, shippingFee, total);

  const bodyContent = `
        <p class="eyebrow">Receipt</p>
        <h1 class="title">Official receipt</h1>
        <p class="subtitle">Thank you for choosing ${companyName}.</p>
        <table class="info-grid" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p class="label">Order</p>
              <p class="value">#${safeOrderId}</p>
              <p class="muted">${issuedDate}</p>
            </td>
            <td>
              <p class="label">Grand Total</p>
              <p class="value">${formatCurrency(total)}</p>
              <p class="muted">Shipping ${shippingFee > 0 ? formatCurrency(shippingFee) : "Included"}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="label">Customer</p>
              <p class="value">${customerName}</p>
              <p class="muted">${customerEmail}${customerPhone ? ` • ${customerPhone}` : ""}</p>
            </td>
            <td>
              <p class="label">Delivery Address</p>
              <p class="value">${customerAddress}</p>
            </td>
          </tr>
        </table>
        <div class="section-title">Billed Items</div>
        ${itemsTable}
        ${totalsTable}
        <div class="callout">
          Keep this receipt for your records. If you notice anything incorrect please contact us at ${companyEmail}.
        </div>
      `;

  return buildEmailDocument(`${companyNameRaw} Receipt ${id}`, bodyContent);
}

export async function sendOrderEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const {
    id,
    createdAt,
    customer: { name, email, phone, address },
    items,
    total,
    proofFilename,
    proofData,
  } = order;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = Math.max(total - subtotal, 0);

  const attachments: { filename: string; content: string }[] = [];

  if (proofData && proofFilename) {
    attachments.push({
      filename: proofFilename,
      content: proofData,
    });
  }

  const companyInfo = getCompanyInfo();
  const companyName = escapeHtml(companyInfo.name);
  const companyEmail = escapeHtml(companyInfo.email);
  const companyAddress = escapeHtml(companyInfo.address);

  const safeOrderId = escapeHtml(id);
  const placedDate = formatOrderDate(createdAt);
  const customerName = escapeHtml(name);
  const customerEmail = escapeHtml(email);
  const customerPhone = phone ? escapeHtml(phone) : "";
  const customerAddress = formatAddress(address);
  const proofLabel = proofFilename ? escapeHtml(proofFilename) : "Not attached";
  const proofNote = proofFilename
    ? `Proof of payment (${proofLabel}) is attached for review.`
    : "No proof of payment was provided with this order. Please follow up with the customer.";

  const itemsTable = buildItemsTable(items);
  const totalsTable = buildTotalsTable(subtotal, shippingFee, total);

  const staffBody = `
        <p class="eyebrow">New Order</p>
        <h1 class="title">New order received</h1>
        <p class="subtitle">Customer ${customerName} submitted an order.</p>
        <table class="info-grid" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p class="label">Order</p>
              <p class="value">#${safeOrderId}</p>
              <p class="muted">${placedDate}</p>
            </td>
            <td>
              <p class="label">Grand Total</p>
              <p class="value">${formatCurrency(total)}</p>
              <p class="muted">Subtotal ${formatCurrency(subtotal)}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="label">Customer</p>
              <p class="value">${customerName}</p>
              <p class="muted">${customerEmail}${customerPhone ? ` • ${customerPhone}` : ""}</p>
            </td>
            <td>
              <p class="label">Shipping Address</p>
              <p class="value">${customerAddress}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="label">Proof</p>
              <p class="value">${proofLabel}</p>
              <p class="muted">${proofFilename ? "Review attachment" : "Request proof if needed"}</p>
            </td>
          </tr>
        </table>
        <div class="section-title">Line Items</div>
        ${itemsTable}
        ${totalsTable}
        <div class="callout">
          ${proofNote}
        </div>
      `;

  const staffFooter = `${companyName} • Internal notification`;
  const staffHtml = buildEmailDocument(`New Order – ${id}`, staffBody, staffFooter);

  const customerBody = `
        <p class="eyebrow">Order confirmed</p>
        <h1 class="title">Thank you for your purchase</h1>
        <p class="subtitle">We've logged your payment reference. Keep this summary for your records.</p>
        <div class="callout">
          We'll double-check your proof of payment and reach out from ${companyEmail} once your order ships.
        </div>
        <table class="info-grid" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p class="label">Order</p>
              <p class="value">#${safeOrderId}</p>
              <p class="muted">${placedDate}</p>
            </td>
            <td>
              <p class="label">Total</p>
              <p class="value">${formatCurrency(total)}</p>
              <p class="muted">${shippingFee > 0 ? `Shipping ${formatCurrency(shippingFee)}` : "Shipping included"}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="label">Delivery Address</p>
              <p class="value">${customerAddress}</p>
            </td>
          </tr>
        </table>
        <div class="section-title">Order Summary</div>
        ${itemsTable}
        ${totalsTable}
        <p class="muted">
          Need help? Reply to this email or contact ${companyEmail}.
        </p>
      `;

  const customerFooter = `You received this email because you placed an order with ${companyName}.`;
  const customerHtml = buildEmailDocument(
    `Your order receipt – ${companyInfo.name}`,
    customerBody,
    customerFooter
  );

  console.log(
    "Staff email to:",
    process.env.COMPANY_EMAIL || "miraibits.electronics@gmail.com"
  );
  console.log("Customer email to:", email);
  console.log("Order object (partial):", {
    id,
    name,
    email,
    phone,
    address,
    total,
  });

  try {
    await resend.emails.send({
      from: process.env.RESEND_EMAIL || "onboarding@resend.dev",
      to: process.env.COMPANY_EMAIL || "miraibits.electronics@gmail.com",
      subject: `New Order Received – ${name}`,
      html: staffHtml,
      attachments,
    });
    console.log(`Staff notification sent for Order ID: ${id}`);
  } catch (error) {
    console.error(
      `Failed to send staff notification email for Order ID: ${id}:`,
      error
    );
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_EMAIL || "onboarding@resend.dev",
      to: `${email}`,
      subject: `Your order receipt – ${companyInfo.name}`,
      html: customerHtml,
      attachments,
    });
    console.log(`Customer receipt sent for Order ID: ${id}`);
  } catch (error) {
    console.error(
      `Failed to send customer receipt email for Order ID: ${id}:`,
      error
    );
  }
}
