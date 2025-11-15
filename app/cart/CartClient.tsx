'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../lib/cart';
import { formatCurrencyLKR } from '../../lib/currency';
import { calculateShippingFee } from '../../lib/pricing';
import QuantityInput from '../../components/QuantityInput';

function CartInner() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart, productsCache } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = calculateShippingFee(itemCount);
  const orderTotal = totalPrice + shippingFee;

  return (
    <main className="container-px mx-auto max-w-6xl pt-10 pb-32 lg:pb-10">
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
          <button
            className="btn btn-outline self-end sm:self-auto sm:ml-auto"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
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
              <div key={item.productId} className="card p-3 sm:p-4">
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-gray-50 sm:h-20 sm:w-20">
                    {product.images && product.images.length > 0 ? (
                      <Image src={product.images[0]} alt={product.name} fill sizes="80px" style={{ objectFit: 'contain' }} />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold leading-tight sm:text-base">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                          {formatCurrencyLKR(product.price)} each
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                        <label htmlFor={`qty-${item.productId}`} className="text-gray-500 dark:text-gray-400">
                          Qty
                        </label>
                        <QuantityInput
                          value={item.quantity}
                          onChange={value => updateQuantity(item.productId, value)}
                          min={1}
                          max={product.stock > 0 ? product.stock : undefined}
                          className="w-24 rounded sm:w-28"
                          inputClassName="w-full px-1.5 sm:px-2"
                          ariaLabel={`${product.name} quantity`}
                          inputId={`qty-${item.productId}`}
                        />
                      </div>
                      <div className="text-right sm:text-left">
                        <span className="block text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                          Subtotal
                        </span>
                        <span className="text-base font-semibold sm:text-lg">{formatCurrencyLKR(subtotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card sticky top-24 h-fit self-start p-6 hidden lg:block">
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

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
        <div className="container-px mx-auto flex max-w-6xl items-center justify-between gap-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatCurrencyLKR(orderTotal)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatCurrencyLKR(totalPrice)} + {formatCurrencyLKR(shippingFee)} shipping
            </p>
          </div>
          <Link
            href="/checkout"
            className={`btn btn-primary w-36 text-center text-sm ${items.length === 0 ? 'pointer-events-none opacity-60' : ''}`}
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CartClient() {
  return <CartInner />;
}
