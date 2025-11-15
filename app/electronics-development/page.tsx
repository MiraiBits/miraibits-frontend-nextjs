import BackLink from '../../components/BackLink';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Electronics Development Services – Mirai.lk',
  description:
    'Mirai.lk designs, prototypes, and validates custom electronics for connected products in Sri Lanka.',
  path: '/electronics-development',
  keywords: [
    'electronics design services Sri Lanka',
    'hardware prototyping Colombo',
    'embedded engineering Mirai',
  ],
});

export default function ElectronicsDevelopmentPage() {
  return (
    <main className="container-px mx-auto max-w-6xl py-10">
      <BackLink href="/about" ariaLabel="Back to About Mirai.lk" className="mb-6" />
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">Electronics Development</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          From first sketch to pilot run, our hardware engineers design and build dependable electronics that are ready for manufacture.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We pair fast iterations with rigorous validation so your boards, firmware, and enclosures ship on schedule and within budget.
        </p>
        <div className="mt-6 text-gray-700 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-gray-100">What we deliver</p>
          <ul className="mt-3 list-disc list-inside space-y-2">
            <li>Component selection, schematic capture, and multi-layer PCB layout</li>
            <li>Prototype assembly, hardware bring-up, and embedded firmware</li>
            <li>Compliance guidance and production handoff for reliable scaling</li>
          </ul>
        </div>
        <p className="mt-6 text-gray-700 dark:text-gray-300">
          Need hardware that just works?{' '}
          <a href="/contact" className="text-[#e6443b] underline underline-offset-4">
            Let’s plan your next build.
          </a>
        </p>
      </div>
    </main>
  );
}
