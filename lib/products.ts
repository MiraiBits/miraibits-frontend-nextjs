import type { Product } from './types';
import {
  PrismaClient as ProductPrismaClient,
  type Prisma,
  type Product as PrismaProductModel,
} from '../prisma-products/client';

// Create a singleton instance
let productPrismaClient: ProductPrismaClient | null = null;

function getProductPrisma() {
  if (!productPrismaClient) {
    productPrismaClient = new ProductPrismaClient();
  }
  return productPrismaClient;
}

export type ProductQueryOptions = {
  category?: string;
  /**
   * Match any of the provided tags.
   */
  tags?: string[];
  /**
   * Convenience for filtering by a single tag.
   */
  tag?: string;
  excludeId?: string;
  excludeSlug?: string;
  take?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
};

function transformProduct(product: PrismaProductModel): Product {
  return {
    ...product,
    specifications: product.specifications as { [key: string]: string } | undefined,
    tags: product.tags && product.tags.length > 0 ? product.tags : undefined,
  };
}

export async function getProducts(options: ProductQueryOptions = {}): Promise<Product[]> {
  const prisma = getProductPrisma();
  const { category, tag, tags, excludeId, excludeSlug, take, orderBy } = options;

  const where: Prisma.ProductWhereInput = {};

  if (category) {
    where.category = category;
  }

  const tagFilters = [tag, ...(tags ?? [])].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );

  if (tagFilters.length === 1) {
    where.tags = { has: tagFilters[0] };
  } else if (tagFilters.length > 1) {
    where.tags = { hasSome: Array.from(new Set(tagFilters)) };
  }

  if (excludeId) {
    where.id = { not: excludeId };
  }

  if (excludeSlug) {
    where.slug = { not: excludeSlug };
  }

  const products = await prisma.product.findMany({
    where,
    take,
    orderBy: orderBy ?? { name: 'asc' },
  });

  return products.map(transformProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const prisma = getProductPrisma();
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  
  if (!product) return null;
  
  return transformProduct(product);
}

export async function getProductById(id: string): Promise<Product | null> {
  const prisma = getProductPrisma();
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (!product) return null;
  
  return transformProduct(product);
}
