import { getProducts } from "../lib/products";
import ShopByCategory from "../components/ShopByCategory";
import MostPopularProducts from "../components/MostPopularProducts";

export default async function HomePage() {
  const products = await getProducts();
  const productsWithPopularTag = products.filter((product) =>
    product.tags?.includes("popular")
  );
  const popularProducts = (productsWithPopularTag.length
    ? productsWithPopularTag
    : products
  ).slice(0, 8);
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
            </div>
          </div>
        </div>
      </section>
      <ShopByCategory />
      {popularProducts.length > 0 && (
        <MostPopularProducts products={popularProducts} />
      )}
      <section className="relative my-12 overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-white dark:border-red-900/40 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 -translate-x-1/3 translate-y-1/3 rounded-full bg-red-200/60 blur-3xl dark:bg-red-900/30" />
        <div className="relative px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-600 dark:text-red-400">
              Payment Options
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-50">
              Bank Transfer Checkout
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg dark:text-gray-300">
              Skip fees and pay straight to Mirai with a quick online transfer from any major Sri Lankan bank.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-5 text-left ring-1 ring-red-100 backdrop-blur dark:bg-gray-900/70 dark:ring-gray-800 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white sm:text-sm">
                  01
                </span>
                <div className="text-3xl" aria-hidden>
                  🧾
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Add to Cart
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pick your boards and modules, then head to checkout.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-5 text-left ring-1 ring-red-100 backdrop-blur dark:bg-gray-900/70 dark:ring-gray-800 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white sm:text-sm">
                  02
                </span>
                <div className="text-3xl" aria-hidden>
                  🏦
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Transfer the Total
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use Sampath Vishwa, ComBank Digital, BOC Smart, HNB Solo, or any bank app to send the amount listed.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-5 text-left ring-1 ring-red-100 backdrop-blur dark:bg-gray-900/70 dark:ring-gray-800 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white sm:text-sm">
                  03
                </span>
                <div className="text-3xl" aria-hidden>
                  📤
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Upload the Slip
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Drop your screenshot in the checkout form so we can confirm and ship.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-xs font-medium text-gray-900 dark:text-gray-100 sm:text-sm">
            🏁 Fee-free, fast, and secure&mdash;your order moves the moment we see the slip.
          </div>
        </div>
      </section>
    </main>
  );
}
