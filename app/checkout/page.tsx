"use client";

import { useCart } from '../../lib/cart';
import { getProductById } from '../../lib/products';
import { formatCurrencyLKR } from '../../lib/currency';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function CheckoutInner() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <section className="mt-6 card p-4">
        <h2 className="font-medium">Bank Transfer Details</h2>
        <ul className="mt-2 text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <li>Bank: Mizuho Bank</li>
          <li>Branch: Shibuya</li>
          <li>Account Name: Miraibits KK</li>
          <li>Account Number: 1234567</li>
          <li>SWIFT: MHCBJPJT</li>
        </ul>
      </section>

      <form className="mt-6 grid gap-6" onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const proofFile = formData.get('proof') as File;
        const proofDataURL = proofFile.size > 0 ? await fileToDataURL(proofFile) : undefined;
        // attach cart and total
        formData.set('cart', encodeURIComponent(JSON.stringify(items)));
        formData.set('total', String(totalPrice));

        try {
          // Exclude proof file from server submission
          const serverFormData = new FormData();
          for (const [key, value] of formData.entries()) {
            if (key !== 'proof') {
              serverFormData.append(key, value);
            }
          }

          const res = await fetch('/api/orders', { method: 'POST', body: serverFormData });
          if (!res.ok) throw new Error('Order failed');
          const data = await res.json();

          // Generate and download client-side receipt
          const receiptHtml = `
            <html>
              <head><title>Order Receipt ${data.orderId}</title></head>
              <body>
                <h1>Order Receipt</h1>
                <p>Order ID: ${data.orderId}</p>
                <h2>Contact Details</h2>
                <p>Name: ${formData.get('name')}</p>
                <p>Email: ${formData.get('email')}</p>
                <p>Phone: ${formData.get('phone')}</p>
                <p>Address: ${formData.get('address')}</p>
                <h2>Order Summary</h2>
                <ul>
                  ${items.map(it => {
                    const p = getProductById(it.productId)!;
                    return `<li>${p.name} × ${it.quantity} - ${formatCurrencyLKR(p.price * it.quantity)}</li>`;
                  }).join('')}
                </ul>
                <h3>Total: ${formatCurrencyLKR(totalPrice)}</h3>
                ${proofDataURL ? `
                  <h2>Proof of Payment</h2>
                  ${proofFile.type.startsWith('image/') ? `<img src="${proofDataURL}" alt="Proof of Payment" style="max-width: 100%;">` : `<a href="${proofDataURL}" download="${proofFile.name}">Download Proof</a>`}
                ` : ''}
              </body>
            </html>
          `;
          const blob = new Blob([receiptHtml], { type: 'text/html' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `receipt-${data.orderId}.html`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);

          // clear client cart
          clearCart();
          // navigate to success page
          router.push(`/success?orderId=${data.orderId}`);
        } catch (err) {
          console.error(err);
          setSubmitting(false);
        }
      }} encType="multipart/form-data">
        <section className="card p-4 grid gap-3">
          <h2 className="font-medium">Contact Details</h2>
          <input name="name" placeholder="Full Name" required className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          <input type="email" name="email" placeholder="Email" required className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          <input name="phone" placeholder="Phone (optional)" className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          <textarea name="address" placeholder="Shipping Address (optional)" className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </section>

        <section className="card p-4">
          <h2 className="font-medium">Order Summary</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {items.map(it => {
              const p = getProductById(it.productId)!;
              return (
                <div key={it.productId} className="flex justify-between">
                  <span>{p.name} × {it.quantity}</span>
                  <span>{formatCurrencyLKR(p.price * it.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrencyLKR(totalPrice)}</span>
          </div>
          <input type="hidden" name="cart" value={encodeURIComponent(JSON.stringify(items))} />
          <input type="hidden" name="total" value={totalPrice} />
        </section>

        <section className="card p-4 grid gap-3">
          <h2 className="font-medium">Upload Proof of Payment</h2>
          <input type="file" name="proof" accept="image/*,application/pdf" required className="text-gray-900 dark:text-gray-100" />
        </section>

        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Order'}</button>
      </form>
    </main>
  );
}

export default function CheckoutPage() { return <CheckoutInner />; }


