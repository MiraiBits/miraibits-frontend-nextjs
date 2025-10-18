"use client";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "../lib/types";
import { useCart } from "../lib/cart";
import { formatCurrencyLKR } from "../lib/currency";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const cartItem = items?.find((it: any) => it.productId === product.id);
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="card p-4 flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "contain" }}
        />
        {qty > 0 && (
          <span className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-semibold rounded-full h-6 min-w-[24px] px-2 flex items-center justify-center shadow-md">
            ×{qty}
          </span>
        )}
      </div>
      <div className="mt-3 flex-1">
        <h3 className="text-gray-900 dark:text-gray-100 font-medium">
          {product.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          {product.shortDescription}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrencyLKR(product.price)}
        </span>

        <div className="flex gap-2 items-center">
          <Link href={`/products/${product.slug}`} className="btn btn-ghost">
            View Details
          </Link>

          <button
            onClick={() => addItem(product)}
            className="btn btn-primary relative"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
