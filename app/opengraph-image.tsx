import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const brand = process.env.COMPANY_NAME || 'Mirai.lk';
  const location = process.env.COMPANY_ADDRESS || 'Colombo, Sri Lanka';
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
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9999, background: '#ffe4ec', border: '2px solid #fec7d8' }} />
            <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: 1 }}>{brand}</div>
          </div>
          <div style={{ fontSize: 28, color: '#6B7280' }}>{location}</div>
        </div>
        <div style={{ alignSelf: 'flex-end', fontSize: 18, color: '#6B7280' }}>electronics for makers</div>
      </div>
    ),
    { ...size }
  );
}

