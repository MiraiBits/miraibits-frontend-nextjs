"use client";
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../lib/types';
import { useCart } from '../lib/cart';
import { formatCurrencyLKR } from '../lib/currency';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <div className="card p-4 flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50 relative">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'contain' }} />
      </div>
      <div className="mt-3 flex-1">
        <h3 className="text-gray-900 font-medium">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.shortDescription}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">{formatCurrencyLKR(product.price)}</span>
        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} className="btn btn-ghost">View Details</Link>
          <button onClick={() => addItem(product)} className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}


