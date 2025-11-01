import { Cpu, Waves, Cog, Zap, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Product } from "./types";

export type CategorySlug =
  | "microcontrollers-boards"
  | "sensors-modules"
  | "passive-components"
  | "power-connectivity"
  | "tools-accessories";

export type Category = {
  name: string;
  slug: CategorySlug;
  icon: LucideIcon;
  headline: string;
};

export const categories: Category[] = [
  {
    name: "Microcontrollers & Boards",
    slug: "microcontrollers-boards",
    icon: Cpu,
    headline: "Brains for your builds",
  },
  {
    name: "Sensors & Modules",
    slug: "sensors-modules",
    icon: Waves,
    headline: "Connect to the world",
  },
  {
    name: "Passive Components",
    slug: "passive-components",
    icon: Cog,
    headline: "Tuning and stability essentials",
  },
  {
    name: "Power & Connectivity",
    slug: "power-connectivity",
    icon: Zap,
    headline: "Keep projects powered and linked",
  },
  {
    name: "Tools & Accessories",
    slug: "tools-accessories",
    icon: Wrench,
    headline: "Everything to build smarter",
  },
];

const categoryProductAssignments: Partial<Record<CategorySlug, string[]>> = {
  // Fill in product slugs as they become available.
};

export function matchProductsToCategory(
  products: Product[],
  slug: CategorySlug
): Product[] {
  const matches = categoryProductAssignments[slug];
  if (!matches || matches.length === 0) {
    return products;
  }

  const matchSet = new Set(matches);
  return products.filter((product) => matchSet.has(product.slug));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
