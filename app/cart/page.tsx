'use client';

import { useCart } from '../../lib/cart';
import { formatCurrencyLKR } from '../../lib/currency';
import Image from 'next/image';
import Link from 'next/link';

function CartInner() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart, productsCache } = useCart();
  return (
    <main className="container-px mx-auto py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/products" className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-ray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Back to products">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </Link>
          <h1 className="text-2xl font-semibold">Your Cart</h1>
        </div>
        {items.length > 0 && (
          <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
        )}
      </div>
      <div className="mt-6 grid gap-4">
        {items.length === 0 && <p className="text-gray-700 dark:text-gray-300">Your cart is empty.</p>}
        {items.map(it => {
          const p = productsCache.get(it.productId);
          if (!p) return null;
          const subtotal = p.price * it.quantity;
          return (
            <div key={it.productId} className="card p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Product Info (Image, Name, Price) */}
              <div className="flex items-center gap-4 w-full md:flex-1">
                <div className="h-16 w-16 rounded bg-gray-50 relative overflow-hidden flex-shrink-0">
                  {p.images && p.images.length > 0 ? (
                    <Image src={p.images[0]} alt={p.name} fill sizes="64px" style={{ objectFit: 'contain' }} />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{formatCurrencyLKR(p.price)} each</div>
                </div>
              </div>

              {/* Actions (Quantity, Subtotal, Remove) */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={e => updateQuantity(it.productId, Math.max(1, Number(e.target.value)))}
                  className="w-20 border border-gray-200 rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700"
                />
                <div className="w-auto md:w-32 text-right font-medium">{formatCurrencyLKR(subtotal)}</div>
                <button className="btn btn-ghost" onClick={() => removeItem(it.productId)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>
      {items.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-semibold">Total: {formatCurrencyLKR(totalPrice)}</div>
          <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
        </div>
      )}
    </main>
  );
}

export default function CartPage() { return <CartInner />; }


