
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About – Miraibits',
  description: 'Learn about Miraibits – minimal, reliable electronics for makers in Colombo, Sri Lanka.',
};

export default function AboutPage() {
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">About Miraibits</h1>
  <p className="mt-4 text-gray-700 dark:text-gray-300">Miraibits curates maker components that are reliable, well-documented, and delightful to use.</p>
    </main>
  );
}


