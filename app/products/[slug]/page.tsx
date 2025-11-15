import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../lib/products";
import AddToCartButton from "./AddToCartButton";
import { formatCurrencyLKR } from "../../../lib/currency";
import StructuredData from "./StructuredData";
import ImageGallery from "./ImageGallery";
import RelatedProducts from "./RelatedProducts";
import ProductSpecifications from "./ProductSpecifications";
import StockAvailability from "./StockAvailability";
import BackLink from "../../../components/BackLink";
import { LiveProductStockProvider } from "./LiveProductStockProvider";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <AsyncProduct params={params} />;
}

async function AsyncProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <LiveProductStockProvider productId={product.id} initialStock={product.stock}>
      <main className="container-px mx-auto max-w-6xl py-10">
        <StructuredData product={product} />
        <BackLink href="/products" ariaLabel="Back to products" className="mb-4" />
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <ImageGallery images={product.images} name={product.name} />
            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>
          </div>
          <div className="sticky top-24">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              {product.shortDescription}
            </p>
            <StockAvailability />
            <div className="mt-4 text-2xl font-bold">
              {formatCurrencyLKR(product.price)}
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
            </div>
            <ProductSpecifications product={product} />
            {product.datasheet && product.datasheet.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Datasheet</h2>
                <ul className="mt-2 space-y-2">
                  {product.datasheet.map((link: string, index: number) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 3h7m0 0v7m0-7L10 14m4 7H5a2 2 0 01-2-2V5a2 2 0 012-2h7"
                          />
                        </svg>
                        View Datasheet{" "}
                        {product.datasheet!.length > 1 ? index + 1 : ""}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
          tags={product.tags}
        />
      </main>
    </LiveProductStockProvider>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const base =
    process.env.SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const title = `${product.name} – Mirai.lk`;
  const description =
    product.shortDescription || product.description.slice(0, 160);
  const url = `${base}/products/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: `/products/${product.slug}/opengraph-image` }],
      type: "website",
    },
  };
}
