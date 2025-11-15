import type { MetadataRoute } from 'next';
import { getProducts } from '../lib/products';
import { categories } from '../lib/categories';
import { getSiteUrl } from '../lib/seo';

const STATIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/cart',
  '/checkout',
  '/cloud-devops-services',
  '/electronics-development',
  '/software-development',
  '/search',
  '/success',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastModified = new Date();

  const products = await getProducts();
  const productUrls = products.map(product => ({
    url: `${base}/products/${product.slug}`,
    lastModified,
  }));

  const categoryUrls = categories.map(category => ({
    url: `${base}/categories/${category.slug}`,
    lastModified,
  }));

  const staticUrls = STATIC_PATHS.map(path => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}

