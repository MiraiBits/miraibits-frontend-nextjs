'use client';

import { useCart } from '../../../lib/cart';
import type { Product } from '../../../lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      className="btn btn-primary"
      onClick={() => addItem(product)}
    >
      Add to Cart
    </button>
  );
}
