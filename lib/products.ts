import fallbackProductsData from '../data/products.json';
import type { Product } from './types';
import {
  PrismaClient as ProductPrismaClient,
  type Prisma,
  type Product as PrismaProductModel,
} from '../prisma/client';
import { generateTypos } from './typos';

// Create a singleton instance
let productPrismaClient: ProductPrismaClient | null = null;
let prismaInitializationFailed = false;

const prismaUnavailableCodes = new Set(['P5000', 'P5010', 'P6008', 'P1001', 'P1002', 'P1010']);

let cachedFallbackProducts: Product[] | null = null;

const DEFAULT_SEARCH_PAGE_SIZE = 24;
const MAX_SEARCH_PAGE_SIZE = 60;
const DEFAULT_RELATED_LIMIT = 12;

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
  const name = 'name' in error ? (error as { name?: string }).name : undefined;
  if (typeof name === 'string' && name.toLowerCase().includes('prismaclientinitializationerror')) {
    return true;
  }
  const message =
    'message' in error ? (error as { message?: string }).message : undefined;
  if (typeof message === 'string') {
    const normalized = message.toLowerCase();
    if (
      Array.from(prismaUnavailableCodes).some(codeFragment =>
        normalized.includes(codeFragment.toLowerCase())
      )
    ) {
      return true;
    }
    if (
      normalized.includes('fetch failed') ||
      normalized.includes("can't reach database server") ||
      normalized.includes('database server was reached but timed out') ||
      normalized.includes('prisma schema loaded from')
    ) {
      return true;
    }
  }
  return false;
}

function filterProductsList(products: Product[], options: ProductQueryOptions): Product[] {
  const { category, tag, tags, excludeId, excludeSlug } = options;

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

  return filtered;
}

function applyFilters(products: Product[], options: ProductQueryOptions): Product[] {
  const { take, orderBy, skip } = options;
  const filtered = filterProductsList(products, options);

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

  const normalizedSkip =
    typeof skip === 'number' && Number.isFinite(skip) && skip > 0
      ? Math.floor(skip)
      : 0;
  const paged = normalizedSkip > 0 ? sorted.slice(normalizedSkip) : sorted;

  if (typeof take === 'number' && Number.isFinite(take) && take > 0) {
    return paged.slice(0, take);
  }

  return paged;
}

function fallbackGetProducts(options: ProductQueryOptions = {}): Product[] {
  const products = loadFallbackProducts();
  return applyFilters(products, options);
}

function fallbackCountProducts(options: ProductQueryOptions = {}): number {
  const products = loadFallbackProducts();
  return filterProductsList(products, options).length;
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
  skip?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
};

function buildProductWhere(options: ProductQueryOptions): Prisma.ProductWhereInput {
  const { category, tag, tags, excludeId, excludeSlug } = options;

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

  return where;
}

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

  const where = buildProductWhere(options);
  const { take, orderBy, skip } = options;
  const normalizedSkip =
    typeof skip === 'number' && Number.isFinite(skip) && skip > 0
      ? Math.floor(skip)
      : undefined;

  try {
    const products = await prisma.product.findMany({
      where,
      take,
      skip: normalizedSkip,
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

export async function countProducts(options: ProductQueryOptions = {}): Promise<number> {
  const prisma = getProductPrisma();

  if (!prisma) {
    return fallbackCountProducts(options);
  }

  const where = buildProductWhere(options);

  try {
    return prisma.product.count({ where });
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma count query failed, falling back to static products data.',
        error
      );
      return fallbackCountProducts(options);
    }
    throw error;
  }
}

export type ProductSearchResults = {
  direct: Product[];
  related: Product[];
};

export type SearchProductsOptions = {
  page?: number;
  pageSize?: number;
  relatedLimit?: number;
};

export type PaginatedProductSearchResults = ProductSearchResults & {
  page: number;
  pageSize: number;
  directTotal: number;
  totalPages: number;
};

function clampPageSize(pageSize?: number): number {
  if (typeof pageSize !== 'number' || !Number.isFinite(pageSize)) {
    return DEFAULT_SEARCH_PAGE_SIZE;
  }
  const rounded = Math.floor(pageSize);
  return Math.min(Math.max(rounded, 1), MAX_SEARCH_PAGE_SIZE);
}

function resolvePagination(
  requestedPage: number,
  pageSize: number,
  totalItems: number
): { page: number; totalPages: number; skip: number } {
  const totalPages =
    totalItems <= 0 ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(requestedPage, 1), totalPages);
  const skip = (page - 1) * pageSize;
  return { page, totalPages, skip };
}

function buildFallbackPaginatedResult(
  fallbackResults: ProductSearchResults,
  requestedPage: number,
  pageSize: number,
  relatedLimit: number
): PaginatedProductSearchResults {
  const directTotal = fallbackResults.direct.length;
  const { page, totalPages, skip } = resolvePagination(
    requestedPage,
    pageSize,
    directTotal
  );
  const direct = fallbackResults.direct.slice(skip, skip + pageSize);
  const related =
    relatedLimit === 0
      ? []
      : fallbackResults.related.slice(0, relatedLimit);

  return {
    direct,
    related,
    page,
    pageSize,
    directTotal,
    totalPages,
  };
}

export async function searchProducts(
  query: string,
  options: SearchProductsOptions = {}
): Promise<PaginatedProductSearchResults> {
  const prisma = getProductPrisma();
  const trimmed = query.trim();
  const pageSize = clampPageSize(options.pageSize);
  const requestedPage =
    typeof options.page === 'number' && Number.isFinite(options.page) && options.page > 0
      ? Math.floor(options.page)
      : 1;
  const relatedLimit =
    typeof options.relatedLimit === 'number' && options.relatedLimit >= 0
      ? Math.floor(options.relatedLimit)
      : DEFAULT_RELATED_LIMIT;

  if (!trimmed) {
    return {
      direct: [],
      related: [],
      page: 1,
      pageSize,
      directTotal: 0,
      totalPages: 1,
    };
  }

  if (!prisma) {
    const fallbackResults = fallbackSearchProducts(trimmed);
    return buildFallbackPaginatedResult(
      fallbackResults,
      requestedPage,
      pageSize,
      relatedLimit
    );
  }

  try {
    const directWhere: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: trimmed, mode: 'insensitive' } },
        { slug: { contains: trimmed, mode: 'insensitive' } },
      ],
    };

    const directTotal = await prisma.product.count({ where: directWhere });
    const { page, totalPages, skip } = resolvePagination(
      requestedPage,
      pageSize,
      directTotal
    );

    const directMatches = await prisma.product.findMany({
      where: directWhere,
      orderBy: { name: 'asc' },
      skip,
      take: pageSize,
    });

    const directProducts = directMatches.map(transformProduct);

    const categoriesFromDirect = directProducts
      .map(product => product.category?.trim())
      .filter((category): category is string => Boolean(category));

    const tagsFromDirect = directProducts.flatMap(product => product.tags ?? []);

    const relatedConditions: Prisma.ProductWhereInput[] = [
      { shortDescription: { contains: trimmed, mode: 'insensitive' } },
      { description: { contains: trimmed, mode: 'insensitive' } },
    ];

    if (categoriesFromDirect.length > 0) {
      relatedConditions.push({
        category: { in: Array.from(new Set(categoriesFromDirect)) },
      });
    }

    if (tagsFromDirect.length > 0) {
      relatedConditions.push({
        tags: { hasSome: Array.from(new Set(tagsFromDirect)) },
      });
    }

    const relatedMatches =
      relatedConditions.length === 0 || relatedLimit === 0
        ? []
        : await prisma.product.findMany({
            where: {
              NOT: directWhere,
              OR: relatedConditions,
            },
            orderBy: { name: 'asc' },
            take: relatedLimit,
          });

    const relatedProducts = Array.isArray(relatedMatches)
      ? relatedMatches.map(transformProduct)
      : [];

    return {
      direct: directProducts,
      related: relatedProducts,
      page,
      pageSize,
      directTotal,
      totalPages,
    };
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma search failed, falling back to static products data.',
        error
      );
      const fallbackResults = fallbackSearchProducts(trimmed);
      return buildFallbackPaginatedResult(
        fallbackResults,
        requestedPage,
        pageSize,
        relatedLimit
      );
    }
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const prisma = getProductPrisma();

  // Helper to find product (either exact match or via typo lookup)
  const findProduct = async (
    fetcher: (s: string) => Promise<Product | null>
  ): Promise<Product | null> => {
    // 1. Try exact match
    const exact = await fetcher(slug);
    if (exact) return exact;

    // 2. If no exact match, check if this slug is a typo of a real product.
    // Since we can't easily reverse generateTypos without iterating everything,
    // we might need to iterate all products and check their typos.
    // This is expensive for a large DB, but okay for small scale or fallback data.
    // For Prisma, we can try to fetch all slugs (cached maybe?) or rely on a known mapping.

    // For now, let's do a scan approach which is acceptable for the scale implied here.
    // Ideally, we'd have a "typo_redirects" table or similar.

    // Optimization: Fetch all products (lightweight) and check locally.
    const allProducts = await getProducts(); // This might be cached or fast enough

    for (const p of allProducts) {
      const typos = generateTypos(p.slug);
      if (typos.includes(slug)) {
        return p;
      }
    }

    return null;
  };

  if (!prisma) {
    return findProduct(async (s) =>
      loadFallbackProducts().find(product => product.slug === s) ?? null
    );
  }

  try {
    return await findProduct(async (s) => {
      const product = await prisma.product.findUnique({ where: { slug: s } });
      return product ? transformProduct(product) : null;
    });
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.warn(
        '[products] Prisma getProductBySlug failed, using fallback data.',
        error
      );
      return findProduct(async (s) =>
        loadFallbackProducts().find(product => product.slug === s) ?? null
      );
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
