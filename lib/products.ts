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
    category: product.category ?? undefined,
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

export type ProductSearchResults = {
  direct: Product[];
  related: Product[];
};

export async function searchProducts(query: string): Promise<ProductSearchResults> {
  const prisma = getProductPrisma();
  const trimmed = query.trim();

  if (!trimmed) {
    return { direct: [], related: [] };
  }

  const directMatches = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: trimmed, mode: 'insensitive' } },
        { slug: { contains: trimmed, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
  });

  const directProducts = directMatches.map(transformProduct);
  const directIds = new Set(directProducts.map(product => product.id));

  const categoriesFromDirect = directProducts
    .map(product => product.category?.trim())
    .filter((category): category is string => Boolean(category));

  const tagsFromDirect = directProducts.flatMap(product => product.tags ?? []);

  const relatedConditions: Prisma.ProductWhereInput[] = [
    { shortDescription: { contains: trimmed, mode: 'insensitive' } },
    { description: { contains: trimmed, mode: 'insensitive' } },
  ];

  if (categoriesFromDirect.length > 0) {
    relatedConditions.push({ category: { in: Array.from(new Set(categoriesFromDirect)) } });
  }

  if (tagsFromDirect.length > 0) {
    relatedConditions.push({ tags: { hasSome: Array.from(new Set(tagsFromDirect)) } });
  }

  const relatedMatches =
    relatedConditions.length === 0
      ? []
      : await prisma.product.findMany({
          where: {
            id: directIds.size > 0 ? { notIn: Array.from(directIds) } : undefined,
            OR: relatedConditions,
          },
          orderBy: { name: 'asc' },
        });

  const relatedProducts = Array.isArray(relatedMatches)
    ? relatedMatches.map(transformProduct).filter(product => !directIds.has(product.id))
    : [];

  return {
    direct: directProducts,
    related: relatedProducts,
  };
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
