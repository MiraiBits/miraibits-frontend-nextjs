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
    <main className="container-px mx-auto">
      <section className="py-2 md:py-12">
        <h1 className="sr-only">Miraibits Products</h1>
        <div>
          <ProductsClient initialProducts={products} initialQuery={q} />
        </div>
      </section>
    </main>
  );
}
