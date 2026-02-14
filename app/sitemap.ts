import type { MetadataRoute } from 'next';
import { getProducts } from '../lib/products';
import { generateTypos } from '../lib/typos';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const products = await getProducts();

  const productUrls = products.flatMap(p => {
    const original = { url: `${base}/products/${p.slug}`, lastModified: new Date() };
    const typos = generateTypos(p.slug).map(typoSlug => ({
      url: `${base}/products/${typoSlug}`,
      lastModified: new Date()
    }));
    return [original, ...typos];
  });

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...productUrls,
  ];
}


