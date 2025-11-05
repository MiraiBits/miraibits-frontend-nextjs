import type { Metadata } from 'next';
import BackLink from '../../components/BackLink';

export const metadata: Metadata = {
  title: 'Software Development – Mirai Electronics',
  description: 'Learn about our software development services.',
};

export default function SoftwareDevelopmentPage() {
  return (
    <main className="container-px mx-auto max-w-6xl py-10">
      <BackLink href="/about" ariaLabel="Back to About Mirai.lk" className="mb-6" />
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">Software Development</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We craft the software layer that powers your product—from polished user interfaces to the embedded logic that ties every component together.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Our agile team ships production-ready code quickly, collaborating with your hardware roadmap so launches stay in sync.
        </p>
        <div className="mt-6 text-gray-700 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-gray-100">What we deliver</p>
          <ul className="mt-3 list-disc list-inside space-y-2">
            <li>Custom web and mobile apps tailored to your hardware capabilities</li>
            <li>APIs, integrations, and secure data pipelines that scale with your users</li>
            <li>Continuous delivery workflows that keep features shipping safely</li>
          </ul>
        </div>
        <p className="mt-6 text-gray-700 dark:text-gray-300">
          Have software to build alongside your device?{' '}
          <a href="/contact" className="text-[#e6443b] underline underline-offset-4">
            Tell us about it.
          </a>
        </p>
      </div>
    </main>
  );
}
