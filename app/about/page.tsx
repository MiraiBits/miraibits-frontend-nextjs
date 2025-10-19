
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About – Mirai Electronics',
  description: 'Learn about Mirai Electronics – a dynamic Sri Lankan electronics startup.',
};

export default function AboutPage() {
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">About Mirai Electronics</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        At Mirai Electronics, quality, speed, and reliability are the cornerstones of our business.
      </p>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        As a dynamic Sri Lankan electronics startup, we are powered by a dedicated team of elite electronic and software engineers from the highest-tier technology companies in the country. Our collective expertise allows us to deliver cutting-edge solutions with precision and efficiency.
      </p>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        We are equipped to handle all your electronics and software requirements, offering a comprehensive suite of services to bring your ideas to life:
      </p>
      <ul className="mt-4 list-disc list-inside text-gray-700 dark:text-gray-300">
        <li>Bill of Materials (BOM) Creation and Management</li>
        <li>Electronics Design, including complex Multi-Layer PCBs</li>
        <li>High-Quality PCB Manufacturing</li>
        <li>Embedded Firmware Development</li>
        <li>Custom Software Development</li>
        <li>End-to-End Product Research and Development</li>
        <li>Scalable Cloud Solutions</li>
        <li>Efficient DevOps Solutions</li>
      </ul>
      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/electronics-development" className="btn btn-primary text-center">
          Electronics Development
        </Link>
        <Link href="/software-development" className="btn btn-primary text-center">
          Software Development
        </Link>
        <Link href="/cloud-devops-services" className="btn btn-primary text-center">
          Cloud/DevOps Services
        </Link>
      </div>
    </main>
  );
}
