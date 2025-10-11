'use client';

import { getProductBySlug } from '../../../lib/products';
import { useCart } from '../../../lib/cart';
import { notFound } from 'next/navigation';
import React from 'react';

function ProductDetail({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const { addItem } = useCart();
  if (!product) return notFound();
  return (
    <main className="container-px mx-auto py-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
          <div className="mt-4 text-xl font-semibold">¥{product.price.toLocaleString()}</div>
          <div className="mt-6 flex gap-3">
            <button className="btn btn-primary" onClick={() => addItem(product)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}


