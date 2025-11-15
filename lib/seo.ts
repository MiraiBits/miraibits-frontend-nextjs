import type { Metadata } from "next";
import type { Product } from "./types";

const SITE_NAME = "Mirai.lk Electronics Store";
const DEFAULT_DESCRIPTION =
  "Shop Mirai.lk for development boards, sensors, and electronics components delivered across Sri Lanka.";
const DEFAULT_OG_IMAGE = "/opengraph-image";

const BASE_KEYWORDS = [
  "Mirai Electronics",
  "Mirai.lk electronics store",
  "Sri Lanka maker store",
  "buy development boards Sri Lanka",
  "Colombo electronics shop",
  "embedded hardware Sri Lanka",
];

type SeoOpenGraphOverrides = NonNullable<Metadata["openGraph"]>;

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  openGraph?: Partial<SeoOpenGraphOverrides>;
};

const TYPO_VARIANTS: Array<{ token: string; replacements: string[] }> = [
  { token: "mirai", replacements: ["mriai", "miria", "mirae", "miri"] },
  { token: "mirai.lk", replacements: ["mirai lk", "mirailk", "mirai-lk"] },
  { token: "electronics", replacements: ["electonics", "electroncs", "eletronics"] },
  { token: "electronic", replacements: ["eletronic", "electronc"] },
  { token: "hardware", replacements: ["hardare", "hadware"] },
  { token: "software", replacements: ["sofware", "softare"] },
  { token: "development", replacements: ["developement", "develoment"] },
  { token: "microcontroller", replacements: ["microcontroler", "microcontoller", "microcontrller"] },
  { token: "microcontrollers", replacements: ["microcontrolers", "microcontollers"] },
  { token: "sensor", replacements: ["senor", "sensro"] },
  { token: "sensors", replacements: ["senors", "sensros"] },
  { token: "devops", replacements: ["dev ops", "devop", "dev-ops"] },
  { token: "cloud", replacements: ["clud", "claud"] },
  { token: "arduino", replacements: ["ardunio", "arudino", "aurdino"] },
  { token: "raspberry", replacements: ["rasberry", "raspbery"] },
  { token: "stm32", replacements: ["stm-32", "stm 32"] },
  { token: "esp32", replacements: ["esp-32", "esp 32"] },
  { token: "ultrasonic", replacements: ["ultrasonc", "ultra sonic"] },
  { token: "sri lanka", replacements: ["srilanka", "sri-lanka"] },
  { token: "colombo", replacements: ["colomboo", "colombo sri lanka"] },
  { token: "maker", replacements: ["makre", "maeker"] },
  { token: "robotics", replacements: ["robotcs", "robotiks"] },
  { token: "prototype", replacements: ["prototpye", "prototipe"] },
];

function normalizePath(path: string): string {
  if (!path) return "/";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function buildCanonicalUrl(path: string): string {
  const baseUrl = getSiteUrl();
  const normalized = normalizePath(path);
  return new URL(normalized, baseUrl).toString();
}

function escapeRegex(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addKeywordVariant(set: Set<string>, keyword: string) {
  const trimmed = keyword.trim();
  if (!trimmed) return;
  set.add(trimmed);
  const lowercase = trimmed.toLowerCase();
  set.add(lowercase);
  const collapsed = trimmed.replace(/\s+/g, " ").trim();
  if (collapsed) {
    set.add(collapsed);
    if (collapsed !== lowercase) {
      set.add(collapsed.toLowerCase());
    }
  }
  const hyphenated = collapsed.replace(/\s+/g, "-");
  if (hyphenated && hyphenated !== collapsed) {
    set.add(hyphenated);
  }
  applyTypoVariants(trimmed, set);
  if (trimmed !== lowercase) {
    applyTypoVariants(lowercase, set);
  }
}

function applyTypoVariants(keyword: string, set: Set<string>) {
  const normalized = keyword.toLowerCase();
  for (const { token, replacements } of TYPO_VARIANTS) {
    if (!normalized.includes(token)) continue;
    const regex = new RegExp(escapeRegex(token), "gi");
    for (const replacement of replacements) {
      set.add(replacement);
      const replaced = keyword.replace(regex, replacement);
      set.add(replaced);
      set.add(replaced.toLowerCase());
    }
  }
}

export function buildKeywordVariants(keywords: string[] = []): string[] {
  const set = new Set<string>();
  [...BASE_KEYWORDS, ...keywords].forEach(keyword => {
    if (keyword) {
      addKeywordVariant(set, keyword);
    }
  });
  return Array.from(set);
}

export function buildPageMetadata(options: BuildMetadataOptions): Metadata {
  const { title, description, path, keywords = [], openGraph } = options;
  const canonicalUrl = buildCanonicalUrl(path);
  const keywordVariants = buildKeywordVariants(keywords);

  const ogImages =
    openGraph?.images && openGraph.images.length > 0
      ? openGraph.images
      : [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }];

  const ogTitle = openGraph?.title || title;
  const ogDescription = openGraph?.description || description;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: keywordVariants,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: ogImages,
      type: openGraph?.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImages.map(resolveTwitterImage),
    },
  };
}

function resolveTwitterImage(
  image: NonNullable<SeoOpenGraphOverrides["images"]>[number],
): string {
  if (typeof image === "string") return image;
  if (image instanceof URL) return image.toString();
  if ("url" in image && image.url) return image.url;
  if ("src" in image && typeof image.src === "string") return image.src;
  return DEFAULT_OG_IMAGE;
}

export function buildProductMetadata(product: Product): Metadata {
  const description = product.shortDescription || product.description.slice(0, 160);
  const keywords = [
    product.name,
    `${product.name} Sri Lanka`,
    `${product.name} price`,
    `${product.name} price Sri Lanka`,
    product.category ? `${product.category} hardware` : "",
    ...(product.tags ?? []),
  ];

  return buildPageMetadata({
    title: `${product.name} – Buy Online in Sri Lanka | Mirai.lk`,
    description,
    path: `/products/${product.slug}`,
    keywords,
    openGraph: {
      type: "product",
      images:
        product.images && product.images.length > 0
          ? product.images.map(url => ({ url }))
          : undefined,
    },
  });
}

export const siteMetadataDefaults = {
  siteName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
};
