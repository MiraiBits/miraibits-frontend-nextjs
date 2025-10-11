import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '../../../lib/products';
import AddToCartButton from './AddToCartButton';

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
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
          <div className="mt-4 text-xl font-semibold">¥{product.price.toLocaleString()}</div>
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


