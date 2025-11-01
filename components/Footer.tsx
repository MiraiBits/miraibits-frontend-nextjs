import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const PHONE = process.env.COMPANY_PHONE || '+94 11 234 5678';
  const ADDRESS = process.env.COMPANY_ADDRESS || 'Colombo, Sri Lanka';
  return (
    <footer className="mt-16 border-t border-red-100 bg-gradient-to-br from-white via-white to-red-50/60 text-gray-600 backdrop-blur-sm dark:border-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="container-px mx-auto max-w-6xl py-12">
        <div className="grid gap-10 text-sm md:grid-cols-[1.2fr,1fr,1fr]">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mirai.lk</h3>
            <p className="text-gray-600 dark:text-gray-300">Hardware for makers, students, and pros building Sri Lanka&apos;s next big ideas.</p>
            <p className="text-gray-500 dark:text-gray-400">{ADDRESS}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-500">
              Reach Us
            </h4>
            <p className="text-gray-700 dark:text-gray-200">Call: {PHONE}</p>
            <p className="text-gray-500 dark:text-gray-400">Weekdays 9.00AM - 5.30PM</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-500">
              Follow
            </h4>
            <div className="flex gap-3">
              <Link
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-600 transition hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                href="https://x.com/mirai_lk"
                aria-label="Mirai on X"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-600 transition hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                href="https://instagram.com/mirai.lk"
                aria-label="Mirai on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-red-100 pt-6 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          © {new Date().getFullYear()} Mirai.lk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
