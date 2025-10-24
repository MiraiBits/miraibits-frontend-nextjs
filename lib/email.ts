import { Resend } from "resend";
import type { Order } from "./types";

export function renderOrderReceiptHtml(order: Order) {
  const {
    id,
    createdAt,
    customer: { name, email, phone, address },
    items,
    total,
    proofFilename,
  } = order;

  return `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${process.env.COMPANY_NAME || "Miraibits"} Receipt ${id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        body {
          margin: 0;
          background: #F9FAFB;
          color: #111827;
          font-family: 'Share Tech Mono', monospace;
        }
        .container {
          max-width: 640px;
          margin: 0 auto;
          padding: 24px;
        }
        .card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: saturate(180%) blur(10px);
          border: 1px solid #F3F4F6;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .card-inner { padding: 24px; }
        .muted { color: #6B7280; }
        .divider { height: 1px; background: #F3F4F6; margin: 16px 0; }
        .total { font-weight: 600; }
        .logo-dot {
          display: inline-block;
          height: 24px;
          width: 24px;
          border-radius: 9999px;
          background: #ffe4ec;
          border: 1px solid #fec7d8;
          margin-right: 8px;
          vertical-align: middle;
        }
        .brand { font-weight: 600; letter-spacing: 0.02em; }
        table { width: 100%; border-collapse: collapse; }
        th {
          color: #6B7280;
          font-weight: 500;
          text-align: left;
          padding: 0 0 6px 0;
          border-bottom: 1px solid #F3F4F6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="card-inner">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span class="logo-dot"></span>
              <span class="brand">${
                process.env.COMPANY_NAME || "Miraibits"
              }</span>
            </div>
            <h1 style="font-size:20px;margin:8px 0 0 0;">Receipt</h1>
            <p class="muted" style="margin:4px 0 0 0;">
              Order ${id} • ${new Date(createdAt).toLocaleString()}
            </p>
            <p class="muted" style="margin:4px 0 0 0;">
              ${process.env.COMPANY_ADDRESS || "Colombo, Sri Lanka"}
            </p>

            <div class="divider"></div>

            <h2 style="font-size:16px;margin:0 0 8px 0;">Billed To</h2>
            <p style="margin:0;">
              <strong>${name}</strong><br />
              ${email} ${phone ? `• ${phone}` : ""}<br />
              <span class="muted">${address || "N/A"}</span>
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
                ${items
                  .map(
                    (it) => `
                    <tr>
                      <td style="padding:8px 0; color:#111827;">${
                        it.productId
                      }</td>
                      <td style="padding:8px 0; color:#6B7280; text-align:center;">${
                        it.quantity
                      }</td>
                      <td style="padding:8px 0; color:#111827; text-align:right;">Rs. ${it.price.toLocaleString()}</td>
                      <td style="padding:8px 0; color:#111827; text-align:right;">Rs. ${(
                        it.price * it.quantity
                      ).toLocaleString()}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="divider"></div>

            <p class="total" style="margin:0;text-align:right;">
              Grand Total: Rs. ${total.toLocaleString()}
            </p>

            <div class="divider"></div>

            ${
              proofFilename
                ? `<p class="muted" style="font-size:12px;margin:0;">Proof of payment is attached.</p>`
                : ""
            }

            <p class="muted" style="font-size:12px;margin:4px 0 0 0;">
              Thank you for your order. This receipt is not a tax invoice.
            </p>
            <p class="muted" style="font-size:12px;margin:4px 0 0 0;">
              ${process.env.COMPANY_NAME || "Miraibits"} • ${
    process.env.COMPANY_ADDRESS || "Colombo, Sri Lanka"
  }
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
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

  const attachments: { filename: string; content: string }[] = [];

  // Attach proof if available (now from database)
  if (proofData && proofFilename) {
    attachments.push({
      filename: proofFilename,
      content: proofData, // Already base64 encoded
    });
  }

  // Note: PDF generation moved to client-side for better performance
  // Users can download their receipt from the success page or email link

  // Staff notification email with improved format
  const staffHtml = `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>New Order – ${id}</title>
      <style>
        body {
          margin: 0;
          background: #F9FAFB;
          color: #111827;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
        }
        .container {
          max-width: 640px;
          margin: 0 auto;
          padding: 24px;
        }
        .card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: saturate(180%) blur(10px);
          border: 1px solid #F3F4F6;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .card-inner { padding: 24px; }
        .muted { color: #6B7280; }
        .divider { height: 1px; background: #F3F4F6; margin: 16px 0; }
        .total { font-weight: 600; }
        .logo-dot {
          display: inline-block;
          height: 24px;
          width: 24px;
          border-radius: 9999px;
          background: #ffe4ec;
          border: 1px solid #fec7d8;
          margin-right: 8px;
          vertical-align: middle;
        }
        .brand { font-weight: 600; letter-spacing: 0.02em; }
        table { width: 100%; border-collapse: collapse; }
        th {
          color: #6B7280;
          font-weight: 500;
          text-align: left;
          padding: 0 0 6px 0;
          border-bottom: 1px solid #F3F4F6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="card-inner">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span class="logo-dot"></span>
              <span class="brand">${
                process.env.COMPANY_NAME || "Miraibits"
              }</span>
            </div>
            <h1 style="font-size:20px;margin:8px 0 0 0;">New Order Received</h1>
            <p class="muted" style="margin:4px 0 0 0;">
              Order ${id} • ${new Date(createdAt).toLocaleString()}
            </p>
            <p class="muted" style="margin:4px 0 0 0;">
              ${process.env.COMPANY_ADDRESS || "Colombo, Sri Lanka"}
            </p>

            <div class="divider"></div>

            <h2 style="font-size:16px;margin:0 0 8px 0;">Customer Details</h2>
            <p style="margin:0;">
              <strong>${name}</strong><br />
              ${email} ${phone ? `• ${phone}` : ""}<br />
              <span class="muted">${address || "N/A"}</span>
            </p>

            <div class="divider"></div>

            <h2 style="font-size:16px;margin:0 0 8px 0;">Items Ordered</h2>
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
                ${items
                  .map(
                    (it) => `
                    <tr>
                      <td style="padding:8px 0; color:#111827;">${
                        it.productId
                      }</td>
                      <td style="padding:8px 0; color:#6B7280; text-align:center;">${
                        it.quantity
                      }</td>
                      <td style="padding:8px 0; color:#111827; text-align:right;">Rs. ${it.price.toLocaleString()}</td>
                      <td style="padding:8px 0; color:#111827; text-align:right;">Rs. ${(
                        it.price * it.quantity
                      ).toLocaleString()}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="divider"></div>

            <p class="total" style="margin:0;text-align:right;">
              Grand Total: Rs. ${total.toLocaleString()}
            </p>

            <div class="divider"></div>

            ${
              proofFilename
                ? `<p class="muted" style="font-size:12px;margin:0;">Proof of payment is attached.</p>`
                : ""
            }

            <p class="muted" style="font-size:12px;margin:4px 0 0 0;">
              New order received from ${name}.
            </p>
            <p class="muted" style="font-size:12px;margin:4px 0 0 0;">
              ${process.env.COMPANY_NAME || "Miraibits"} • ${
    process.env.COMPANY_ADDRESS || "Colombo, Sri Lanka"
  }
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  // Log emails before sending
  console.log("Staff email to:", "miraibits.electronics@gmail.com");
  console.log("Customer email to:", email);
  console.log("Order object (partial):", {
    id,
    name,
    email,
    phone,
    address,
    total,
  });

  // Send staff notification email
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

  // Send customer email
  const customerHtml = `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #f9fafb; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <div style="background: #1e293b; color: white; padding: 20px 24px;">
            <h1 style="margin: 0; font-size: 20px;">${
              process.env.COMPANY_NAME || "Miraibits"
            }</h1>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85;">Thank you for your order!</p>
          </div>
          <div style="padding: 24px;">
            <p style="margin: 0 0 6px; font-size: 15px;">Dear <strong>${name}</strong>,</p>
            <p style="margin: 0 0 16px; font-size: 14px; color: #374151;">
              We have received your order and are processing it. Your order receipt is attached.
            </p>
            <p style="margin-top: 18px; font-size: 13px; color: #6b7280;">
              If you have any questions or concerns, please contact us at ${
                process.env.COMPANY_EMAIL || "miraibits.electronics@gmail.com"
              }.
            </p>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
              Thank you for shopping with ${
                process.env.COMPANY_NAME || "Miraibits"
              }!
            </p>
          </div>
        </div>
      </div>
    `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_EMAIL || "onboarding@resend.dev",
      to: `${email}`,
      subject: `Your order receipt – ${
        process.env.COMPANY_NAME || "Miraibits"
      }`,
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
