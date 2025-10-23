
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact – Miraibits',
  description: 'Get in touch with Miraibits in Colombo, Sri Lanka for orders and support.',
};

export default function ContactPage() {
  const EMAIL = process.env.COMPANY_EMAIL || 'miraibits.electronics@gmail.com';
  const PHONE = process.env.COMPANY_PHONE || '+94 11 234 5678';
  const ADDRESS = process.env.COMPANY_ADDRESS || 'Colombo, Sri Lanka';
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">Contact</h1>
  <div className="mt-4 text-gray-700 dark:text-gray-300 space-y-2">
        <p>Email: {EMAIL}</p>
        <p>Phone: {PHONE}</p>
        <p>Address: {ADDRESS}</p>
      </div>
    </main>
  );
}


