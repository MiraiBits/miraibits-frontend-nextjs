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
  const showRelated = results.totalPages <= 1 && results.related.length > 0;
  const showEmptyState = query.length > 0 && !hasDirect && !showRelated;
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

      {showRelated && (
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

type PageMarker = number | "ellipsis-start" | "ellipsis-end";

function getVisiblePages(currentPage: number, totalPages: number): PageMarker[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: PageMarker[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis-start");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);
  return pages;
}

function PaginationControls({ query, currentPage, totalPages }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

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

  const pageMarkers = getVisiblePages(currentPage, totalPages);
  const baseButtonClasses =
    "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-3.5 sm:py-2 sm:text-sm";
  const arrowClasses =
    "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100";
  const disabledArrowClasses = "opacity-40 hover:text-gray-500 dark:hover:text-gray-400";

  const renderArrow = (direction: "prev" | "next") => {
    const isPrev = direction === "prev";
    const targetPage = isPrev ? currentPage - 1 : currentPage + 1;
    const disabled = isPrev ? currentPage <= 1 : currentPage >= totalPages;
    const label = isPrev ? "Go to previous page" : "Go to next page";
    const symbol = isPrev ? "←" : "→";

    if (disabled) {
      return (
        <span
          className={`${baseButtonClasses} ${arrowClasses} ${disabledArrowClasses}`}
          aria-disabled="true"
        >
          <span aria-hidden="true">{symbol}</span>
        </span>
      );
    }

    return (
      <Link
        href={buildHref(targetPage)}
        className={`${baseButtonClasses} ${arrowClasses}`}
        aria-label={label}
      >
        <span aria-hidden="true">{symbol}</span>
      </Link>
    );
  };

  const renderPageButton = (marker: PageMarker, index: number) => {
    if (typeof marker !== "number") {
      return (
        <span
          key={marker + index}
          className="px-1 text-xs text-gray-400 sm:px-2 sm:text-sm"
          aria-hidden="true"
        >
          &hellip;
        </span>
      );
    }

    const isActive = marker === currentPage;
    const classes = isActive
      ? "bg-blue-600 text-white hover:bg-blue-600"
      : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";

    return (
      <Link
        key={marker}
        href={buildHref(marker)}
        className={`${baseButtonClasses} ${classes}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={isActive ? `Page ${marker}, current page` : `Go to page ${marker}`}
      >
        {marker}
      </Link>
    );
  };

  return (
    <nav className="mt-8 flex justify-center" aria-label="Pagination">
      <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-1.5 py-1 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
        {renderArrow("prev")}
        {pageMarkers.map((marker, index) => renderPageButton(marker, index))}
        {renderArrow("next")}
      </div>
    </nav>
  );
}
