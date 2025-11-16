import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategoryBySlug } from "../../../lib/categories";
import { countProducts, getProducts } from "../../../lib/products";
import CategoryProductsClient from "./CategoryProductsClient";
import BackLink from "../../../components/BackLink";
import PaginationControls from "../../../components/PaginationControls";

type CategoryPageParams = {
  slug: string;
};

type CategoryPageSearchParams = Record<
  string,
  string | string[] | undefined
>;

const CATEGORY_RESULTS_PER_PAGE = 24;

function normalizeQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category",
    };
  }

  return {
    title: `${category.name} | mirai.lk`,
    description: `Discover ${category.name} products available from mirai.lk for your next build.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<CategoryPageParams>;
  searchParams?: Promise<CategoryPageSearchParams>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawPage = normalizeQueryValue(resolvedSearchParams.page);
  const parsedPage = Number.parseInt(rawPage, 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const filterValue = category.filterValue ?? category.slug;
  const totalProducts = await countProducts({
    category: filterValue,
  });
  const totalPages =
    totalProducts <= 0
      ? 1
      : Math.max(1, Math.ceil(totalProducts / CATEGORY_RESULTS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(requestedPage, 1),
    totalPages
  );
  const skip =
    totalProducts === 0 ? 0 : (currentPage - 1) * CATEGORY_RESULTS_PER_PAGE;
  const products = await getProducts({
    category: filterValue,
    orderBy: { name: "asc" },
    take: CATEGORY_RESULTS_PER_PAGE,
    skip,
  });
  const firstResultIndex =
    totalProducts === 0 ? 0 : skip + 1;
  const lastResultIndex =
    totalProducts === 0 ? 0 : firstResultIndex + products.length - 1;
  return (
    <main className="container-px mx-auto max-w-6xl py-8 sm:py-12 lg:py-16">
      <BackLink
        href="/"
        ariaLabel="Go back to the home page"
        className="mb-4 sm:mb-6"
      />

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
            Category
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-50">
            {category.name}
          </h1>
        </div>
        {totalProducts > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing {firstResultIndex}&ndash;{lastResultIndex} of{" "}
            {totalProducts} products
          </p>
        )}
      </header>

      <CategoryProductsClient
        products={products}
        categoryName={category.name}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(page) => ({
          pathname: `/categories/${category.slug}`,
          query: page > 1 ? { page: String(page) } : {},
        })}
      />
    </main>
  );
}
