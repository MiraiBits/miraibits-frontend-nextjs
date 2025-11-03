"use client";
import { useMemo } from "react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../lib/types";

type Props = {
  initialProducts: Product[];
  initialQuery?: string;
};

export default function ProductsClient({
  initialProducts,
  initialQuery,
}: Props) {
  const activeQuery = (initialQuery ?? "").trim();
  const filtered = useMemo(() => {
    const q = activeQuery.toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [initialProducts, activeQuery]);

  // Responsive grid: 2 cols on phones, 3 on tablets, 4 on large screens
  const gridClass =
    "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        {activeQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing results for{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              &quot;{activeQuery}&quot;
            </span>
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-200 bg-white/60 p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
          <p className="font-medium">No products found</p>
          <p className="mt-2 text-sm">
            Try adjusting your search terms or browsing the latest arrivals.
          </p>
        </div>
      ) : (
        <div className={gridClass}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
