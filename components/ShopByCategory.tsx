"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { categories } from "../lib/categories";

export default function ShopByCategory() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth <
          container.scrollWidth - 1
      );
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    const nextPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: nextPosition,
      behavior: "smooth",
    });
  };

  const scrollStyle: CSSProperties = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className="py-10 sm:py-12 lg:py-16"
    >
      <header className="flex flex-col items-center text-center">
        <h2
          id="shop-by-category-heading"
          className="text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl"
        >
          Shop by Category
        </h2>
      </header>

      <div className="relative mt-8 w-full">
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => handleScroll("left")}
          className={`hidden sm:flex absolute left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:scale-105 hover:border-[#ffc7c2] hover:text-[#e6443b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-[#ff8f88] dark:hover:text-[#ff8f88] ${
            canScrollLeft ? "" : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="category-scroll grid grid-flow-col auto-cols-[minmax(70%,260px)] gap-4 overflow-x-auto pb-6 pl-2 pr-6 snap-x snap-mandatory sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 sm:overflow-visible sm:pb-0 sm:pl-0 sm:pr-0 sm:snap-none"
          style={scrollStyle}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group relative flex h-full w-full min-h-[200px] flex-shrink-0 snap-center flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-white px-5 py-6 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:border-transparent hover:bg-gradient-to-br hover:from-white hover:to-[#fff4f2] hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:from-gray-900 dark:hover:to-gray-800 sm:min-h-[240px] sm:flex-shrink sm:items-center sm:gap-6 sm:px-6 sm:py-8 sm:text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-700 ring-1 ring-gray-200 transition duration-300 group-hover:scale-105 group-hover:text-[#e6443b] group-hover:ring-[#ffc7c2] dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:group-hover:text-[#ff8f88] dark:group-hover:ring-[#ffb6ae] sm:h-16 sm:w-16">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                </span>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-900 sm:text-base dark:text-gray-50">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-300">
                    {category.headline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => handleScroll("left")}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#ffc7c2] hover:text-[#e6443b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-[#ff8f88] dark:hover:text-[#ff8f88] ${
              canScrollLeft ? "" : "pointer-events-none opacity-40"
            }`}
            disabled={!canScrollLeft}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => handleScroll("right")}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#ffc7c2] hover:text-[#e6443b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-[#ff8f88] dark:hover:text-[#ff8f88] ${
              canScrollRight ? "" : "pointer-events-none opacity-40"
            }`}
            disabled={!canScrollRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => handleScroll("right")}
          className={`hidden sm:flex absolute right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:scale-105 hover:border-[#ffc7c2] hover:text-[#e6443b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-[#ff8f88] dark:hover:text-[#ff8f88] ${
            canScrollRight ? "" : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
