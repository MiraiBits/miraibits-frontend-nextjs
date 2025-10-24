import { ImageResponse } from 'next/og';
import { getProductBySlug } from '../../../lib/products';
import { formatCurrencyLKR } from '../../../lib/currency';

export const contentType = 'image/png';
export const alt = 'Miraibits Product Image';
export const size = { width: 1200, height: 630 };

export default async function OgImage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) return new Response('Not found', { status: 404 });

  const productImage = `${process.env.SITE_URL}${product.images[0]}`;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-white">
        <div tw="flex w-full">
          <div tw="flex w-1/2 flex-col justify-between p-8">
            <h1 tw="text-6xl font-bold text-gray-900">{product.name}</h1>
            <div tw="text-4xl font-bold text-gray-800">{formatCurrencyLKR(product.price)}</div>
          </div>
          <div tw="relative flex w-1/2 items-center justify-center">
            <img src={productImage} alt={product.name} tw="h-auto w-full" />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
