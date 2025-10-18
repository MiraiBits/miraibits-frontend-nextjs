import { getProducts } from '../../../lib/products';
import ProductCard from '../../../components/ProductCard';
import type { Product } from '../../../lib/types';

export default function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  const products = getProducts().filter(p => p.id !== currentProductId).slice(0, 4);

  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
