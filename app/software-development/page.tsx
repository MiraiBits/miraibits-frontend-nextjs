
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Development – Mirai Electronics',
  description: 'Learn about our software development services.',
};

export default function SoftwareDevelopmentPage() {
  return (
    <main className="container-px mx-auto py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold">Software Development</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </main>
  );
}
