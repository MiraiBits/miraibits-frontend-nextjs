import CheckoutClient from './CheckoutClient';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Checkout – Mirai.lk',
  description:
    'Complete your Mirai.lk bank transfer checkout and upload payment proof to confirm your electronics order.',
  path: '/checkout',
  keywords: [
    'Mirai checkout',
    'bank transfer electronics order',
    'Mirai.lk payment upload',
  ],
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
