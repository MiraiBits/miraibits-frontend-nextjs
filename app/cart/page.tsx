import CartClient from './CartClient';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shopping Cart – Mirai.lk',
  description:
    'Review the electronics, development boards, and sensors in your Mirai.lk cart before checkout.',
  path: '/cart',
  keywords: [
    'Mirai cart',
    'electronics cart Sri Lanka',
    'maker order summary',
  ],
});

export default function CartPage() {
  return <CartClient />;
}
