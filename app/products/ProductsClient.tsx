"use client";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import Image from "next/image";
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
  const AVAILABLE_COLS = [2, 3, 4] as const;
  const DEFAULT_COLS = 3 as const;
  const [cols, setCols] = useState<number>(DEFAULT_COLS);

  // Hydration-safe restore from localStorage after mount
  useEffect(() => {
    try {
      const savedCols = Number(
        localStorage.getItem("products_cols") || String(DEFAULT_COLS)
      );
      if (AVAILABLE_COLS.includes(savedCols as any)) setCols(savedCols);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("products_cols", String(cols));
    } catch {}
  }, [cols]);

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

  function ColumnsIcon({
    columns,
    active,
  }: {
    columns: 2 | 3 | 4;
    active: boolean;
  }) {
    // Use classNames instead of inline styles to avoid SSR/CSR style serialization differences
    const baseCell = "block w-1.5 h-1.5 rounded-sm"; // 6px
    const cellClass = active
      ? `${baseCell} bg-gray-900`
      : `${baseCell} bg-gray-400`;
    const gridCols =
      columns === 2
        ? "grid-cols-2"
        : columns === 3
        ? "grid-cols-3"
        : "grid-cols-4";
    const wrapperClass = `grid ${gridCols} gap-0.5 p-1 rounded-md border ${
      active ? "bg-gray-100 border-gray-200" : "bg-transparent border-gray-200"
    }`;
    const totalCells = columns * 2;
    return (
      <span aria-hidden className={wrapperClass} suppressHydrationWarning>
        {Array.from({ length: totalCells }).map((_, i) => (
          <span key={i} className={cellClass} />
        ))}
      </span>
    );
  }

  // compute responsive Tailwind grid classes based on user-selected cols
  const gridClass = (() => {
    if (cols === 4)
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6";
    if (cols === 3)
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6";
    return "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"; // cols === 2
  })();

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
          {
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Size</span>
              {[2, 3, 4].map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`${option} column grid`}
                  className="btn btn-ghost h-10 px-2"
                  onClick={() => setCols(option)}
                >
                  <ColumnsIcon
                    columns={option as 2 | 3 | 4}
                    active={cols === option}
                  />
                </button>
              ))}
            </div>
          }
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
