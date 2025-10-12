import SuccessClient from './SuccessClient';

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


