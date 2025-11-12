import { NextResponse } from 'next/server';
import { supabaseServerClient } from '../../../../../lib/supabaseServerClient';
import { getProductById } from '../../../../../lib/products';

export async function GET(
  _request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;

  if (!productId) {
    return NextResponse.json(
      { error: 'Product id is required.' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseServerClient
      .from('products')
      .select('stock')
      .eq('id', productId)
      .maybeSingle();

    if (error) {
      console.error('[stock] Supabase query failed', error);
      const fallbackProduct = await getProductById(productId);
      if (fallbackProduct) {
        return NextResponse.json(
          { stock: fallbackProduct.stock, source: 'fallback' },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch stock.' },
        { status: 503 }
      );
    }

    if (!data) {
      return NextResponse.json({ stock: null }, { status: 404 });
    }

    return NextResponse.json({ stock: data.stock }, { status: 200 });
  } catch (error) {
    console.error('[stock] Unexpected error', error);
    const fallbackProduct = await getProductById(productId);
    if (fallbackProduct) {
      return NextResponse.json(
        { stock: fallbackProduct.stock, source: 'fallback' },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch stock.' },
      { status: 503 }
    );
  }
}
