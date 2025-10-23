"use client";
import { useEffect, useMemo, useState } from "react";
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
  const [query, setQuery] = useState(initialQuery || "");

  // Keep local query in sync with URL/searchParams updates (e.g., via navbar search)
  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [initialProducts, query]);

  // Responsive grid: 1 col mobile, 2-3 on tablets, 4 on large screens
  const gridClass =
    "grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <main className="container-px mx-auto py-6 md:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="h-10 w-full max-w-xs sm:w-64 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-200"
          />
        </div>
      </div>

      <div className={gridClass}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
