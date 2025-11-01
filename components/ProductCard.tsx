"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "../lib/cart";
import { formatCurrencyLKR } from "../lib/currency";
import type { Product } from "../lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const router = useRouter();

  const cartItem = items?.find((entry: any) => entry.productId === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const handleNavigate = () => router.push(`/products/${product.slug}`);

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View product ${product.name}`}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-transform transition-shadow duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6a62]/40 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 md:p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/70">
        <div className="relative aspect-[4/3] w-full">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              <span className="text-xs font-medium">No image</span>
            </div>
          )}
        </div>

        {quantityInCart > 0 && (
          <span className="absolute top-3 right-3 flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-gray-900 px-2 text-xs font-semibold text-white shadow-md dark:bg-gray-100 dark:text-gray-900">
            ×{quantityInCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 pt-4 sm:pt-5">
        <header className="flex flex-col gap-2">
          <h3 className="break-words text-base font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-[#e6443b] md:text-lg dark:text-gray-50">
            {product.name}
          </h3>
          <p className="break-words text-sm leading-relaxed text-gray-600 sm:text-[0.95rem] dark:text-gray-300">
            {product.shortDescription || product.description}
          </p>
        </header>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <span className="text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-50">
            {formatCurrencyLKR(product.price)}
          </span>

          <div className="flex w-full flex-col gap-2 xl:w-auto xl:flex-row xl:flex-wrap xl:justify-end">
            <Link
              href={`/products/${product.slug}`}
              className="btn btn-ghost min-h-[2.5rem] justify-center whitespace-nowrap px-3 text-xs tracking-wide sm:text-sm xl:min-w-[9rem] xl:px-4 xl:text-sm"
              onClick={(event) => event.stopPropagation()}
            >
              View Details
            </Link>

            <button
              type="button"
              className="btn btn-primary min-h-[2.5rem] justify-center whitespace-nowrap px-3 text-xs tracking-wide sm:text-sm xl:min-w-[9rem] xl:px-4 xl:text-sm"
              onClick={(event) => {
                event.stopPropagation();
                addItem(product);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
