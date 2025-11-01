import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  categories,
  getCategoryBySlug,
  matchProductsToCategory,
} from "../../../lib/categories";
import { getProducts } from "../../../lib/products";
import CategoryProductsClient from "./CategoryProductsClient";

type CategoryPageParams = {
  slug: string;
};

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
}: {
  params: Promise<CategoryPageParams>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts();
  const filtered = matchProductsToCategory(products, category.slug);
  const Icon = category.icon;

  return (
    <main className="container-px mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
            <Icon className="h-8 w-8" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Category
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-50">
              {category.name}
            </h1>
          </div>
        </div>
      </header>

      <CategoryProductsClient
        products={filtered}
        categoryName={category.name}
      />
    </main>
  );
}
