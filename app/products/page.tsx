import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/products';

export default function ProductsPage() {
  const products = getProducts();
  return (
    <main className="container-px mx-auto py-10">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}


