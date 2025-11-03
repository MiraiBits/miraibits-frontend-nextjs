import fallbackProductsData from '../data/products.json';
import type { Product } from './types';
import {
  PrismaClient as ProductPrismaClient,
  type Prisma,
  type Product as PrismaProductModel,
} from '../prisma-products/client';

// Create a singleton instance
let productPrismaClient: ProductPrismaClient | null = null;
let prismaInitializationFailed = false;

const prismaUnavailableCodes = new Set(['P5000', 'P5010', 'P6008', 'P1001', 'P1002']);

let cachedFallbackProducts: Product[] | null = null;

function loadFallbackProducts(): Product[] {
  if (!cachedFallbackProducts) {
    const rawProducts = fallbackProductsData as unknown as Product[];
    cachedFallbackProducts = rawProducts.map(product => ({
      ...product,
      specifications: product.specifications ?? undefined,
      tags: product.tags && product.tags.length > 0 ? product.tags : undefined,
      category: product.category ?? undefined,
    }));
  }
  return cachedFallbackProducts;
}

function getProductPrisma() {
  if (prismaInitializationFailed) {
    return null;
  }
  if (!productPrismaClient) {
    try {
      productPrismaClient = new ProductPrismaClient();
    } catch (error) {
      prismaInitializationFailed = true;
      console.warn('[products] Failed to initialize Prisma client, using fallback data.', error);
      return null;
    }
  }
  return productPrismaClient;
}

function isPrismaUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? (error as { code?: string }).code : undefined;
  if (code && prismaUnavailableCodes.has(code)) {
    return true;
  }
  const message =
    'message' in error ? (error as { message?: string }).message : undefined;
  if (typeof message === 'string') {
    if (
      Array.from(prismaUnavailableCodes).some(codeFragment =>
        message.includes(codeFragment)
      )
    ) {
      return true;
    }
    if (message.toLowerCase().includes('fetch failed')) {
      return true;
    }
  }
  return false;
}

function applyFilters(products: Product[], options: ProductQueryOptions): Product[] {
  const { category, tag, tags, excludeId, excludeSlug, take, orderBy } = options;

  let filtered = products;

  if (category) {
    filtered = filtered.filter(product => product.category === category);
  }

  const tagFilters = [tag, ...(tags ?? [])].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );

  if (tagFilters.length === 1) {
    const [singleTag] = tagFilters;
    filtered = filtered.filter(product => (product.tags ?? []).includes(singleTag));
  } else if (tagFilters.length > 1) {
    filtered = filtered.filter(product =>
      (product.tags ?? []).some(productTag => tagFilters.includes(productTag))
    );
  }

  if (excludeId) {
    filtered = filtered.filter(product => product.id !== excludeId);
  }

  if (excludeSlug) {
    filtered = filtered.filter(product => product.slug !== excludeSlug);
  }

  const sorted = filtered.slice();
  const sorter =
    Array.isArray(orderBy) && orderBy.length > 0 ? orderBy[0] : orderBy ?? { name: 'asc' };

  if (sorter && 'name' in sorter) {
    const direction = sorter.name === 'desc' ? 'desc' : 'asc';
    sorted.sort((a, b) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (typeof take === 'number' && Number.isFinite(take) && take > 0) {
    return sorted.slice(0, take);
  }

  return sorted;
}

function fallbackGetProducts(options: ProductQueryOptions = {}): Product[] {
  const products = loadFallbackProducts();
  return applyFilters(products, options);
}

function fallbackSearchProducts(query: string): ProductSearchResults {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { direct: [], related: [] };
  }

  const products = loadFallbackProducts();

  const direct = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(normalized);
    const slugMatch = product.slug.toLowerCase().includes(normalized);
    return nameMatch || slugMatch;
  });

  const directIds = new Set(direct.map(product => product.id));
  const categoriesFromDirect = Array.from(
    new Set(
      direct
        .map(product => product.category?.trim())
        .filter((value): value is string => Boolean(value))
    )
  );
  const tagsFromDirect = Array.from(
    new Set(direct.flatMap(product => product.tags ?? []))
  );

  const related = products.filter(product => {
    if (directIds.has(product.id)) return false;
    const fieldsToSearch = [
      product.shortDescription ?? '',
      product.description ?? '',
    ]
      .join(' ')
      .toLowerCase();

    const matchesText = fieldsToSearch.includes(normalized);
    const matchesCategory =
      categoriesFromDirect.length === 0
        ? false
        : categoriesFromDirect.includes(product.category ?? '');
    const matchesTags =
      tagsFromDirect.length === 0
        ? false
        : (product.tags ?? []).some(tag => tagsFromDirect.includes(tag));

    return matchesText || matchesCategory || matchesTags;
  });

  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name);

  return {
    direct: direct.sort(byName),
    related: related.sort(byName),
  };
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

  if (!prisma) {
    return fallbackGetProducts(options);
  }

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

  try {
    const products = await prisma.product.findMany({
      where,
      take,
      orderBy: orderBy ?? { name: 'asc' },
    });

    return products.map(transformProduct);
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma query failed, falling back to static products data.',
        error
      );
      return fallbackGetProducts(options);
    }
    throw error;
  }
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

  if (!prisma) {
    return fallbackSearchProducts(trimmed);
  }

  try {
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
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma search failed, falling back to static products data.',
        error
      );
      return fallbackSearchProducts(trimmed);
    }
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const prisma = getProductPrisma();

  if (!prisma) {
    return loadFallbackProducts().find(product => product.slug === slug) ?? null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    
    if (!product) return null;
    
    return transformProduct(product);
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma getProductBySlug failed, using fallback data.',
        error
      );
      return loadFallbackProducts().find(product => product.slug === slug) ?? null;
    }
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const prisma = getProductPrisma();

  if (!prisma) {
    return loadFallbackProducts().find(product => product.id === id) ?? null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) return null;
    
    return transformProduct(product);
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma getProductById failed, using fallback data.',
        error
      );
      return loadFallbackProducts().find(product => product.id === id) ?? null;
    }
    throw error;
  }
}
