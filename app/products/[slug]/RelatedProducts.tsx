import { getProducts } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";
import type { Product } from "../../../lib/types";

type Props = {
  currentProductId: string;
  category?: string | null;
  tags?: string[] | null;
};

export default async function RelatedProducts({
  currentProductId,
  category,
  tags,
}: Props) {
  const relatedProducts: Product[] = [];
  const seenIds = new Set<string>([currentProductId]);

  if (category) {
    const byCategory = await getProducts({
      category,
      excludeId: currentProductId,
      take: 4,
    });
    for (const product of byCategory) {
      if (seenIds.has(product.id)) continue;
      relatedProducts.push(product);
      seenIds.add(product.id);
      if (relatedProducts.length >= 4) break;
    }
  }

  if (relatedProducts.length < 4 && tags?.length) {
    const byTags = await getProducts({
      tags,
      excludeId: currentProductId,
      take: 8,
    });
    for (const product of byTags) {
      if (seenIds.has(product.id)) continue;
      relatedProducts.push(product);
      seenIds.add(product.id);
      if (relatedProducts.length >= 4) break;
    }
  }

  if (relatedProducts.length < 4) {
    const fallback = await getProducts({
      excludeId: currentProductId,
      take: 8,
    });
    for (const product of fallback) {
      if (seenIds.has(product.id)) continue;
      relatedProducts.push(product);
      seenIds.add(product.id);
      if (relatedProducts.length >= 4) break;
    }
  }

  if (relatedProducts.length === 0) return null;

  const displayProducts = relatedProducts.slice(0, 4);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
