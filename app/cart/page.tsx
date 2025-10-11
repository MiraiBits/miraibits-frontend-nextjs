'use client';

import { useCart } from '../../lib/cart';
import { getProductById } from '../../lib/products';
import Link from 'next/link';

function CartInner() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
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
              <img src={p.image} alt={p.name} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">¥{p.price.toLocaleString()} each</div>
              </div>
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={e => updateQuantity(it.productId, Math.max(1, Number(e.target.value)))}
                className="w-20 border border-gray-200 rounded px-2 py-1"
              />
              <div className="w-32 text-right font-medium">¥{subtotal.toLocaleString()}</div>
              <button className="btn btn-ghost" onClick={() => removeItem(it.productId)}>Remove</button>
            </div>
          );
        })}
      </div>
      {items.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-semibold">Total: ¥{totalPrice.toLocaleString()}</div>
          <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
        </div>
      )}
    </main>
  );
}

export default function CartPage() { return <CartInner />; }


