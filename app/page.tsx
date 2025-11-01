import { getProducts } from "../lib/products";
import ProductsClient from "./products/ProductsClient";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const qRaw = params["q"];
  const q = Array.isArray(qRaw) ? qRaw[0] : qRaw;
  const products = await getProducts();
  return (
    <main className="container-px mx-auto max-w-6xl">
      <section className="relative overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="pointer-events-none absolute -inset-x-32 -top-28 h-[300px] rounded-full bg-gradient-to-b from-white via-white/95 to-white/10 blur-[120px] z-0 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900/20" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">mirai.lk</span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl dark:text-gray-50">
                Power Up Your Next Creation
              </h1>
              <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-300">
                Explore a world of components, boards, and sensors to build anything you imagine.
              </p>
              <div className="mt-6">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Discover More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="products" className="py-8 md:py-12 lg:py-16">
        <h2 className="sr-only">Mirai.lk Products</h2>
        <div>
          <ProductsClient initialProducts={products} initialQuery={q} />
        </div>
      </section>
    </main>
  );
}
