'use client';

import { useState } from 'react';
import { useCart } from '../../../lib/cart';
import type { Product } from '../../../lib/types';

export default function AddToCartButton({ product, disabled }: { product: Product, disabled?: boolean }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = () => {
    addItem(product);
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAdding}
      className={`w-full btn btn-primary focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 ${
        isAdding
          ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
          : ''
      } disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isAdding ? 'Added!' : (disabled ? 'Out of Stock' : 'Add to Cart')}
    </button>
  );
}
