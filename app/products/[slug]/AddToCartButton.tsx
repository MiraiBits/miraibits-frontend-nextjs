'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../../lib/cart';
import type { Product } from '../../../lib/types';
import QuantityInput from '../../../components/QuantityInput';

type Props = {
  product: Product;
  disabled?: boolean;
};

export default function AddToCartButton({ product, disabled }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const maxQuantity = product.stock > 0 ? product.stock : 1;
  const isOutOfStock = disabled || product.stock === 0;

  useEffect(() => {
    setQuantity((prev) => {
      if (isOutOfStock) return 1;
      return Math.min(Math.max(1, prev), maxQuantity);
    });
  }, [isOutOfStock, maxQuantity]);

  const handleClick = () => {
    if (isOutOfStock || isAdding) return;
    addItem(product, quantity);
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <QuantityInput
        value={quantity}
        onChange={setQuantity}
        min={1}
        max={maxQuantity}
        disabled={isOutOfStock}
        className="w-full sm:w-auto"
        inputClassName="w-full sm:w-16"
        ariaLabel="Quantity"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isOutOfStock || isAdding}
        className={`btn btn-primary w-full sm:flex-1 sm:min-w-[220px] focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 ${
          isAdding
            ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
            : ''
        } disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isAdding ? 'Added!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
