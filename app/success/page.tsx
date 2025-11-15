import SuccessClient from './SuccessClient';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Order Success – Mirai.lk',
  description:
    'Thanks for shopping at Mirai.lk. Track what happens after your payment proof is reviewed.',
  path: '/success',
  keywords: [
    'Mirai order success',
    'Mirai.lk receipt download',
    'electronics order confirmation Sri Lanka',
  ],
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const raw = sp['orderId'];
  const orderId = Array.isArray(raw) ? raw[0] : raw;
  return <SuccessClient orderId={orderId} />;
}

