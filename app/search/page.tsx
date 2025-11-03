import ProductCard from "../../components/ProductCard";
import { searchProducts } from "../../lib/products";

type SearchPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function normalizeQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = normalizeQueryValue(searchParams?.q);
  const query = rawQuery.trim();
  const results = query ? await searchProducts(query) : { direct: [], related: [] };
  const hasDirect = results.direct.length > 0;
  const hasRelated = results.related.length > 0;
  const showEmptyState = query.length > 0 && !hasDirect && !hasRelated;

  const gridClasses =
    "mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <main className="container-px mx-auto max-w-6xl py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
          Search Results
        </h1>
        {query && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing results for{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              &quot;{query}&quot;
            </span>
          </p>
        )}
      </header>

      {!query && (
        <div className="mt-10 rounded-xl border border-dashed border-gray-200 bg-white/70 p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Ready to find something?
          </h2>
          <p className="mt-2 text-sm">
            Use the search box in the navigation bar to look up boards, sensors,
            and components.
          </p>
        </div>
      )}

      {hasDirect && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Matching products
          </h2>
          <div className={gridClasses}>
            {results.direct.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {hasRelated && (
        <section className="mt-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Related or similar products
            </h2>
            {!hasDirect && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No exact name matches, but these are a close fit.
              </p>
            )}
          </div>
          <div className={gridClasses}>
            {results.related.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {showEmptyState && (
        <div className="mt-12 rounded-xl border border-dashed border-gray-200 bg-white/70 p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            No products matched your search
          </h2>
          <p className="mt-2 text-sm">
            Try a different keyword or browse by category to keep exploring.
          </p>
        </div>
      )}
    </main>
  );
}

