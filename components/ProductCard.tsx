"use client";
import Link from 'next/link';
import type { Product } from '../lib/types';
import { useCart } from '../lib/cart';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <div className="card p-4 flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="mt-3 flex-1">
        <h3 className="text-gray-900 font-medium">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.shortDescription}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">¥{product.price.toLocaleString()}</span>
        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} className="btn btn-ghost">View Details</Link>
          <button onClick={() => addItem(product)} className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}


