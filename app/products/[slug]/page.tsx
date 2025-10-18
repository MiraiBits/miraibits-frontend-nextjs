import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '../../../lib/products';
import AddToCartButton from './AddToCartButton';
import { formatCurrencyLKR } from '../../../lib/currency';
import StructuredData from './StructuredData';
import ImageGallery from './ImageGallery';
import RelatedProducts from './RelatedProducts';
import Link from 'next/link';
import ProductSpecifications from './ProductSpecifications';
import StockAvailability from './StockAvailability';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <AsyncProduct params={params} />
  );
}

async function AsyncProduct({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <main className="container-px mx-auto py-10">
      <StructuredData product={product} />
      <div className="mb-4">
        <Link href="/products" className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Back to products">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <ImageGallery images={product.images} name={product.name} />
        <div className="sticky top-24">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{product.shortDescription}</p>
          <StockAvailability stock={product.stock} />
          <div className="mt-4 text-2xl font-bold">{formatCurrencyLKR(product.price)}</div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{product.description}</p>
          </div>
          <ProductSpecifications product={product} />
          <div className="mt-6 flex gap-3">
            <AddToCartButton product={product} disabled={product.stock === 0} />
          </div>
        </div>
      </div>
      <RelatedProducts currentProductId={product.id} />
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


