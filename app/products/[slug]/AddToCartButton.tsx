'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useCart } from '../../../lib/cart';
import type { Product } from '../../../lib/types';

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

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(Math.max(1, value), maxQuantity));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex w-full sm:w-auto items-stretch rounded-lg border border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={isOutOfStock || quantity <= 1}
          className="w-10 shrink-0 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          disabled={isOutOfStock}
          className="w-full sm:w-20 text-center text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white py-2"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={isOutOfStock || quantity >= maxQuantity}
          className="w-10 shrink-0 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
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
