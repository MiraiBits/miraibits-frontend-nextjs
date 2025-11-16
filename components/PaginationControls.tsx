import Link from "next/link";
import type { UrlObject } from "url";

type PageMarker = number | "ellipsis-start" | "ellipsis-end";

export type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => UrlObject;
};

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

export default function PaginationControls({
  currentPage,
  totalPages,
  buildHref,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageMarkers = getVisiblePages(currentPage, totalPages);
  const baseButtonClasses =
    "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:px-3.5 sm:py-2 sm:text-sm";
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
      ? "bg-red-600 text-white hover:bg-red-600"
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
