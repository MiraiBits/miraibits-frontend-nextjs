import type { MetadataRoute } from 'next';
import { getProducts } from '../lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const products = await getProducts();
  const productUrls = products.map(p => ({ url: `${base}/products/${p.slug}`, lastModified: new Date() }));

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...productUrls,
  ];
}


