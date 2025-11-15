import BackLink from '../../components/BackLink';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cloud & DevOps Services – Mirai.lk',
  description:
    'Scale your connected products with Mirai.lk DevOps support: CI/CD, IaC, observability, and infrastructure tuning.',
  path: '/cloud-devops-services',
  keywords: [
    'DevOps services Sri Lanka',
    'cloud infrastructure Mirai',
    'CI/CD consulting Colombo',
  ],
});

export default function CloudDevOpsServicesPage() {
  return (
    <main className="container-px mx-auto max-w-6xl py-10">
      <BackLink href="/about" ariaLabel="Back to About Mirai.lk" className="mb-6" />
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">Cloud/DevOps Services</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          We build and run cloud infrastructure that keeps your connected products online, secure, and ready to grow.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Our DevOps practice automates delivery, monitoring, and incident response so your team can focus on the roadmap.
        </p>
        <div className="mt-6 text-gray-700 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-gray-100">What we deliver</p>
          <ul className="mt-3 list-disc list-inside space-y-2">
            <li>Cloud architecture on AWS, Azure, or GCP tailored to your workloads</li>
            <li>CI/CD pipelines, infrastructure as code, and automated compliance</li>
            <li>Observability, alerting, and SRE support that keeps uptime predictable</li>
          </ul>
        </div>
        <p className="mt-6 text-gray-700 dark:text-gray-300">
          Ready to modernize your delivery pipeline?{' '}
          <a href="/contact" className="text-[#e6443b] underline underline-offset-4">
            Talk with our cloud team.
          </a>
        </p>
      </div>
    </main>
  );
}
