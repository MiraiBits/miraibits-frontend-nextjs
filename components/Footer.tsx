import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white/70 backdrop-blur">
      <div className="container-px mx-auto py-10 grid gap-6 md:grid-cols-3 text-sm text-gray-600">
        <div>
          <h3 className="text-gray-900 font-semibold mb-2">Miraibits</h3>
          <p className="">Japanese-inspired electronics for makers.</p>
        </div>
        <div>
          <h4 className="text-gray-900 font-medium mb-2">Contact</h4>
          <p>Email: <a className="underline" href="mailto:orders@miraibits.jp">orders@miraibits.jp</a></p>
          <p>Phone: +81-3-1234-5678</p>
        </div>
        <div>
          <h4 className="text-gray-900 font-medium mb-2">Social</h4>
          <div className="flex gap-4">
            <Link className="underline" href="https://x.com/miraibits">X</Link>
            <Link className="underline" href="https://instagram.com/miraibits">Instagram</Link>
            <Link className="underline" href="https://github.com/miraibits">GitHub</Link>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-8">© {new Date().getFullYear()} Miraibits. All rights reserved.</div>
    </footer>
  );
}


