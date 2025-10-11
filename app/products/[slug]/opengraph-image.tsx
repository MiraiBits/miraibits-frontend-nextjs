import { ImageResponse } from 'next/og';
import { getProductBySlug } from '../../../lib/products';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  const brand = process.env.COMPANY_NAME || 'Miraibits';
  const name = p?.name || 'Product';
  const price = p ? `Rs. ${p.price.toLocaleString('en-LK')}` : '';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
          color: '#111827',
          padding: 64,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9999, background: '#ffe4ec', border: '2px solid #fec7d8' }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 1 }}>{brand}</div>
        </div>
        <div style={{ fontSize: 58, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 36, color: '#6B7280' }}>{price}</div>
      </div>
    ),
    { ...size }
  );
}


