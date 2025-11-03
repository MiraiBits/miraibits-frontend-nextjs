import { NextResponse } from 'next/server';
import { getProducts, getProductById } from '../../../lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;
  const tags = searchParams.getAll('tags').filter(Boolean);
  const takeParam = searchParams.get('take');
  let take: number | undefined;
  if (takeParam) {
    const parsed = Number.parseInt(takeParam, 10);
    if (!Number.isNaN(parsed)) {
      take = parsed;
    }
  }

  try {
    if (id) {
      const product = await getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    } else {
      const products = await getProducts({
        category,
        tag,
        tags: tags.length ? tags : undefined,
        take,
      });
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
