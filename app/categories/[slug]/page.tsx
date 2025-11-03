import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategoryBySlug } from "../../../lib/categories";
import { getProducts } from "../../../lib/products";
import CategoryProductsClient from "./CategoryProductsClient";
import BackLink from "../../../components/BackLink";

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

  const products = await getProducts({
    category: category.filterValue ?? category.slug,
    orderBy: { name: "asc" },
  });
  return (
    <main className="container-px mx-auto max-w-6xl py-8 sm:py-12 lg:py-16">
      <BackLink href="/" ariaLabel="Go back to the home page" className="mb-4 sm:mb-6" />

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
            Category
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-50">
            {category.name}
          </h1>
        </div>
      </header>

      <CategoryProductsClient
        products={products}
        categoryName={category.name}
      />
    </main>
  );
}
