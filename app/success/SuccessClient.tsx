"use client";
import { useEffect } from 'react';
import { useCart } from '../../lib/cart';
import Link from 'next/link';

export default function SuccessClient({ orderId }: { orderId?: string | null }) {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, [clearCart]);
  return (
    <main className="container-px mx-auto py-16 text-center max-w-xl">
      <h1 className="text-2xl font-semibold">Thank you for your order</h1>
      <p className="mt-3 text-gray-600">We will review your payment proof and contact you shortly.</p>
      {orderId && (
        <div className="mt-6">
          <a
            className="btn btn-ghost"
            href={`/api/orders/${orderId}/receipt`}
            download
          >
            Download receipt
          </a>
        </div>
      )}
      <Link href="/" className="btn btn-primary mt-6">Back to Home</Link>
    </main>
  );
}


