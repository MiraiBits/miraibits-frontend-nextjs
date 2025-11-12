'use client';

import { useLiveProductStock } from './LiveProductStockProvider';

export default function StockAvailability() {
  const { stock, isRefreshing, error, didSync } = useLiveProductStock();
  const normalizedStock = Math.max(0, stock);
  const isInStock = normalizedStock > 0;
  const pillClasses = isInStock
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <div className="mt-4 space-y-1">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${pillClasses} ${
          isRefreshing ? 'animate-pulse' : ''
        }`}
      >
        {isInStock ? `In Stock (${normalizedStock} available)` : 'Out of Stock'}
      </span>
      {isRefreshing && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Checking live inventory...
        </p>
      )}
      {!didSync && !isRefreshing && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing last known stock level.
        </p>
      )}
      {error && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {error}
        </p>
      )}
    </div>
  );
}
