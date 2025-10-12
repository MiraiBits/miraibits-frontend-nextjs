'use client';

import { useCart } from '../../lib/cart';
import { getProductById } from '../../lib/products';
import { formatCurrencyLKR } from '../../lib/currency';
import Image from 'next/image';
import Link from 'next/link';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CartPDF from '../../components/CartPDF';
import { useEffect, useState } from 'react';

function CartInner() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="container-px mx-auto py-10">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      <div className="mt-6 grid gap-4">
        {items.length === 0 && <p className="text-gray-600">Your cart is empty.</p>}
        {items.map(it => {
          const p = getProductById(it.productId)!;
          const subtotal = p.price * it.quantity;
          return (
            <div key={it.productId} className="card p-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded bg-gray-50 relative overflow-hidden">
                <Image src={p.image} alt={p.name} fill sizes="64px" style={{ objectFit: 'contain' }} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{formatCurrencyLKR(p.price)} each</div>
              </div>
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={e => updateQuantity(it.productId, Math.max(1, Number(e.target.value)))}
                className="w-20 border border-gray-200 rounded px-2 py-1"
              />
              <div className="w-32 text-right font-medium">{formatCurrencyLKR(subtotal)}</div>
              <button className="btn btn-ghost" onClick={() => removeItem(it.productId)}>Remove</button>
            </div>
          );
        })}
      </div>
      {items.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-semibold">Total: {formatCurrencyLKR(totalPrice)}</div>
          <div className="flex items-center gap-4">
            {isClient && (
              <PDFDownloadLink
                document={<CartPDF items={items} totalPrice={totalPrice} />}
                fileName="cart.pdf"
                className="btn btn-secondary"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink>
            )}
            <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CartPage() { return <CartInner />; }


