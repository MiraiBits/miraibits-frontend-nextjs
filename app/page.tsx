import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/products';

export default function HomePage() {
  const products = getProducts();
  return (
    <main className="container-px mx-auto">
      <section className="py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Miraibits</h1>
          <p className="mt-3 text-gray-600">Japanese-inspired electronics for makers: clean, minimal, and reliable components.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}


