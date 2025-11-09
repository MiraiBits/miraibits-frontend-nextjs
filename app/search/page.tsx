import Link from "next/link";

import ProductCard from "../../components/ProductCard";
import { searchProducts, type PaginatedProductSearchResults } from "../../lib/products";

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

const RESULTS_PER_PAGE = 24;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawQuery = normalizeQueryValue(resolvedSearchParams.q);
  const query = rawQuery.trim();
  const rawPage = normalizeQueryValue(resolvedSearchParams.page);
  const parsedPage = Number.parseInt(rawPage, 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const emptyResults: PaginatedProductSearchResults = {
    direct: [],
    related: [],
    page: 1,
    pageSize: RESULTS_PER_PAGE,
    directTotal: 0,
    totalPages: 1,
  };
  const results = query
    ? await searchProducts(query, { page: requestedPage, pageSize: RESULTS_PER_PAGE })
    : emptyResults;
  const hasDirect = results.direct.length > 0;
  const hasRelated = results.related.length > 0;
  const showEmptyState = query.length > 0 && !hasDirect && !hasRelated;
  const firstResultIndex =
    results.directTotal === 0 ? 0 : (results.page - 1) * results.pageSize + 1;
  const lastResultIndex =
    results.directTotal === 0 ? 0 : firstResultIndex + results.direct.length - 1;

  const gridClasses =
    "mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4";

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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Matching products
            </h2>
            {results.directTotal > 0 && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Showing {firstResultIndex}&ndash;{lastResultIndex} of {results.directTotal} products
              </p>
            )}
          </div>
          <div className={gridClasses}>
            {results.direct.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PaginationControls
            query={query}
            currentPage={results.page}
            totalPages={results.totalPages}
          />
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

type PaginationControlsProps = {
  query: string;
  currentPage: number;
  totalPages: number;
};

function PaginationControls({ query, currentPage, totalPages }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const baseButtonClasses =
    "inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
  const activeClasses =
    "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800";
  const disabledClasses =
    "cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600";

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const search = params.toString();
    return `/search${search ? `?${search}` : ""}`;
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-3">
        {prevDisabled ? (
          <span className={`${baseButtonClasses} ${disabledClasses}`} aria-disabled="true">
            Previous
          </span>
        ) : (
          <Link
            href={buildHref(currentPage - 1)}
            className={`${baseButtonClasses} ${activeClasses}`}
            aria-label="Go to previous page"
          >
            Previous
          </Link>
        )}
        {nextDisabled ? (
          <span className={`${baseButtonClasses} ${disabledClasses}`} aria-disabled="true">
            Next
          </span>
        ) : (
          <Link
            href={buildHref(currentPage + 1)}
            className={`${baseButtonClasses} ${activeClasses}`}
            aria-label="Go to next page"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
