'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../lib/cart';
import { formatCurrencyLKR } from '../../lib/currency';

function CartInner() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart, productsCache } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = itemCount > 0 ? 400 : 0;
  const orderTotal = totalPrice + shippingFee;

  return (
    <main className="container-px mx-auto max-w-6xl py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Back to products"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Your Cart</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {itemCount} item{itemCount === 1 ? '' : 's'} in your cart
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <button className="btn btn-outline w-full sm:w-auto" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">

          {items.length === 0 && (
            <div className="card flex flex-col gap-4 p-6 text-center text-gray-600 dark:text-gray-300">
              <p>Your cart is empty. Continue shopping to add items.</p>
              <Link href="/products" className="btn btn-primary mx-auto">
                Browse Products
              </Link>
            </div>
          )}

          {items.map(item => {
            const product = productsCache.get(item.productId);
            if (!product) return null;
            const subtotal = product.price * item.quantity;

            return (
              <div key={item.productId} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex w-full flex-1 items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded bg-gray-50">
                    {product.images && product.images.length > 0 ? (
                      <Image src={product.images[0]} alt={product.name} fill sizes="80px" style={{ objectFit: 'contain' }} />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formatCurrencyLKR(product.price)} each</div>
                    <div className="mt-3 flex items-center gap-2">
                      <label htmlFor={`qty-${item.productId}`} className="text-sm text-gray-500 dark:text-gray-400">
                        Qty
                      </label>
                      <input
                        id={`qty-${item.productId}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQuantity(item.productId, Math.max(1, Number(e.target.value)))}
                        className="w-24 rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-end gap-2 sm:w-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-lg font-semibold">{formatCurrencyLKR(subtotal)}</span>
                  <button className="btn btn-ghost text-sm" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card sticky top-24 h-fit self-start p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrencyLKR(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrencyLKR(shippingFee)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrencyLKR(orderTotal)}</span>
            </div>
            <Link
              href="/checkout"
              className={`btn btn-primary mt-6 w-full text-center text-base ${items.length === 0 ? 'pointer-events-none opacity-60' : ''}`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function CartPage() {
  return <CartInner />;
}
