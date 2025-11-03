import { Cpu, Waves, Cog, Zap, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  /**
   * Value stored in Prisma `Product.category` column for this category.
   * Falls back to slug when not set.
   */
  filterValue?: string;
};

export const categories: Category[] = [
  {
    name: "Microcontrollers & Boards",
    slug: "microcontrollers-boards",
    icon: Cpu,
    headline: "Brains for your builds",
    filterValue: "microcontroller",
  },
  {
    name: "Sensors & Modules",
    slug: "sensors-modules",
    icon: Waves,
    headline: "Connect to the world",
    filterValue: "sensor",
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
    filterValue: "power",
  },
  {
    name: "Tools & Accessories",
    slug: "tools-accessories",
    icon: Wrench,
    headline: "Everything to build smarter",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
