"use client";

import { useCart } from '../../lib/cart';
import { formatCurrencyLKR } from '../../lib/currency';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function CheckoutInner() {
  const { items, totalPrice, clearCart, productsCache } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <section className="mt-6 card p-4">
        <h2 className="font-medium">Bank Transfer Details</h2>
        <ul className="mt-2 text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <li>Bank: Dialog Finance PLC</li>
          <li>Branch: Head Office</li>
          <li>Account Name: MANUPA NIMNETH WICKRAMASINGHE</li>
          <li>Account Number: 0010 2201 1227</li>
          <li>SWIFT: DFCCLKLX</li>
        </ul>
      </section>

      <form className="mt-6 grid gap-6" onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        // attach cart and total
        formData.set('cart', encodeURIComponent(JSON.stringify(items)));
        formData.set('total', String(totalPrice));

        try {
          const res = await fetch('/api/orders', { method: 'POST', body: formData });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Order submission failed:', errorData);
            alert(`Order failed: ${errorData.error || 'Please try again'}`);
            throw new Error(errorData.error || 'Order failed');
          }
          const data = await res.json();
          // clear client cart
          clearCart();
          // navigate to success page
          router.push(`/success?orderId=${data.orderId}`);
        } catch (err) {
          console.error('Order error:', err);
          setSubmitting(false);
          // Show error to user if not already shown
          if (err instanceof Error && !err.message.includes('Order failed')) {
            alert('An error occurred. Please check your connection and try again.');
          }
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
              const p = productsCache.get(it.productId);
              if (!p) return null;
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


