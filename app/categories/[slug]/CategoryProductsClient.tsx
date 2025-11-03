"use client";

import ProductCard from "../../../components/ProductCard";
import type { Product } from "../../../lib/types";

type Props = {
  products: Product[];
  categoryName: string;
};

export default function CategoryProductsClient({
  products,
  categoryName,
}: Props) {
  if (!products.length) {
    return (
      <div className="mt-12 rounded-2xl border border-dashed border-gray-200 bg-white/70 p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
        <p className="text-lg font-semibold">
          No products in {categoryName} yet
        </p>
        <p className="mt-2 text-sm">
          Check back soon—we&apos;re curating the best gear for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
