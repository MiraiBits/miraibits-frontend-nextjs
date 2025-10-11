import type { Product } from '../../../lib/types';

export default function StructuredData({ product }: { product: Product }) {
  const base = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: `${base}${product.image}`,
    url: `${base}/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'LKR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `${base}/products/${product.slug}`,
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}


