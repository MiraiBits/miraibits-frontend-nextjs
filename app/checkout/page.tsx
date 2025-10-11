'use client';

import { useCart } from '../../lib/cart';
import { getProductById } from '../../lib/products';

function CheckoutInner() {
  const { items, totalPrice } = useCart();
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <section className="mt-6 card p-4">
        <h2 className="font-medium">Bank Transfer Details</h2>
        <ul className="mt-2 text-gray-700 text-sm space-y-1">
          <li>Bank: Mizuho Bank</li>
          <li>Branch: Shibuya</li>
          <li>Account Name: Miraibits KK</li>
          <li>Account Number: 1234567</li>
          <li>SWIFT: MHCBJPJT</li>
        </ul>
      </section>

      <form className="mt-6 grid gap-6" action="/api/orders" method="post" encType="multipart/form-data">
        <section className="card p-4 grid gap-3">
          <h2 className="font-medium">Contact Details</h2>
          <input name="name" placeholder="Full Name" required className="border border-gray-200 rounded px-3 py-2" />
          <input type="email" name="email" placeholder="Email" required className="border border-gray-200 rounded px-3 py-2" />
          <input name="phone" placeholder="Phone (optional)" className="border border-gray-200 rounded px-3 py-2" />
          <textarea name="address" placeholder="Shipping Address (optional)" className="border border-gray-200 rounded px-3 py-2" />
        </section>

        <section className="card p-4">
          <h2 className="font-medium">Order Summary</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {items.map(it => {
              const p = getProductById(it.productId)!;
              return (
                <div key={it.productId} className="flex justify-between">
                  <span>{p.name} × {it.quantity}</span>
                  <span>¥{(p.price * it.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>¥{totalPrice.toLocaleString()}</span>
          </div>
          <input type="hidden" name="cart" value={encodeURIComponent(JSON.stringify(items))} />
          <input type="hidden" name="total" value={totalPrice} />
        </section>

        <section className="card p-4 grid gap-3">
          <h2 className="font-medium">Upload Proof of Payment</h2>
          <input type="file" name="proof" accept="image/*,application/pdf" required />
        </section>

        <button type="submit" className="btn btn-primary">Submit Order</button>
      </form>
    </main>
  );
}

export default function CheckoutPage() { return <CheckoutInner />; }


