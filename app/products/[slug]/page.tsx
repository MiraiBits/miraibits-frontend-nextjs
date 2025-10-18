import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '../../../lib/products';
import AddToCartButton from './AddToCartButton';
import { formatCurrencyLKR } from '../../../lib/currency';
import StructuredData from './StructuredData';
import Image from 'next/image';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <AsyncProduct params={params} />
  );
}

async function AsyncProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();
  return (
    <main className="container-px mx-auto py-10">
      <StructuredData product={product} />
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50 relative">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{product.description}</p>
          <div className="mt-4 text-xl font-semibold">{formatCurrencyLKR(product.price)}</div>
          <div className="mt-6 flex gap-3">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const products = getProducts();
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const base = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const title = `${product.name} – Miraibits`;
  const description = product.shortDescription || product.description.slice(0, 160);
  const url = `${base}/products/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: `/products/${product.slug}/opengraph-image` }],
      type: 'website',
    },
  };
}


