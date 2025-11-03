"use client";

import Image from "next/image";
import Link from "next/link";

import { formatCurrencyLKR } from "../lib/currency";
import type { Product } from "../lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 py-4 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-800 dark:bg-gray-900 sm:px-5 sm:py-6 lg:px-6 lg:py-7"
      aria-label={`View product ${product.name}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
        <div className="relative aspect-[4/3] w-full">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              <span className="text-[0.65rem] font-medium uppercase tracking-wide sm:text-xs">
                No image
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 pt-4 sm:gap-4 sm:pt-5">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <h3 className="text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#e6443b] dark:text-gray-50 sm:text-base lg:text-lg">
            {product.name}
          </h3>
          <p className="text-[0.65rem] text-gray-600 line-clamp-2 dark:text-gray-300 sm:text-xs lg:text-sm">
            {product.shortDescription || product.description}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-50 sm:text-sm lg:text-base">
            {formatCurrencyLKR(product.price)}
          </span>
          <span className="inline-flex items-center text-[0.6rem] font-semibold uppercase tracking-wide text-[#e6443b] transition-transform duration-200 group-hover:translate-x-1 whitespace-nowrap sm:text-[0.7rem] md:text-xs dark:text-[#ff8f88]">
            View Product
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
              className="ml-1"
            >
              <polyline points="9 5 16 12 9 19" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
