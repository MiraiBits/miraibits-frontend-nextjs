import Link from 'next/link';
import BackLink from '../../components/BackLink';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Mirai.lk Electronics',
  description:
    'Learn how Mirai.lk powers Sri Lankan makers with reliable components, sourcing support, and hardware services.',
  path: '/about',
  keywords: ['Mirai Electronics company profile', 'Sri Lankan electronics startup', 'Mirai.lk story'],
});

export default function AboutPage() {
  return (
    <main className="container-px mx-auto max-w-6xl py-10">
      <BackLink href="/" ariaLabel="Go back to the home page" className="mb-6" />
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">About Mirai.lk</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Mirai.lk supplies the electronic components, development boards, and lab gear that Sri Lanka’s builders depend on. Reliable delivery of the right parts—fast—is the core service we’re known for.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We track global inventory, suggest drop-in alternatives, and assemble ready-to-use kits so your projects stay on schedule without component shortages slowing you down.
        </p>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Additional services</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <Link
            href="/electronics-development"
            className="card flex flex-col gap-3 p-6 transition hover:border-[#e6443b] hover:bg-white dark:hover:border-[#e6443b] dark:hover:bg-gray-800"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Electronics Development</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              PCB design, rapid prototyping, and firmware to turn device ideas into dependable products.
            </p>
          </Link>
          <Link
            href="/software-development"
            className="card flex flex-col gap-3 p-6 transition hover:border-[#e6443b] hover:bg-white dark:hover:border-[#e6443b] dark:hover:bg-gray-800"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Software Development</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Web and mobile applications engineered alongside your hardware roadmap for a unified experience.
            </p>
          </Link>
          <Link
            href="/cloud-devops-services"
            className="card flex flex-col gap-3 p-6 transition hover:border-[#e6443b] hover:bg-white dark:hover:border-[#e6443b] dark:hover:bg-gray-800"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cloud & DevOps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Scalable infrastructure, automated deployments, and observability to keep every release stable.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
