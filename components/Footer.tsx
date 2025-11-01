import Link from 'next/link';

export default function Footer() {
  const EMAIL = process.env.COMPANY_EMAIL || 'hello@mirai.lk';
  const PHONE = process.env.COMPANY_PHONE || '+94 11 234 5678';
  const ADDRESS = process.env.COMPANY_ADDRESS || 'Colombo, Sri Lanka';
  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
  <div className="container-px mx-auto py-10 grid gap-6 md:grid-cols-3 text-sm text-gray-600 dark:text-gray-300">
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Mirai.lk</h3>
          <p className="text-gray-700 dark:text-gray-300">Electronics for makers.</p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">{ADDRESS}</p>
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 font-medium mb-2">Contact</h4>
          <p className="text-gray-700 dark:text-gray-300">Email: <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <p className="text-gray-700 dark:text-gray-300">Phone: {PHONE}</p>
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 font-medium mb-2">Social</h4>
          <div className="flex gap-4">
            <Link className="underline text-gray-700 dark:text-gray-300" href="https://x.com/mirai_lk">X</Link>
            <Link className="underline text-gray-700 dark:text-gray-300" href="https://instagram.com/mirai.lk">Instagram</Link>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pb-8">© {new Date().getFullYear()} Mirai.lk. All rights reserved.</div>
    </footer>
  );
}
