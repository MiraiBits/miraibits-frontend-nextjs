"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../lib/cart';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-100 shadow-soft">
      <div className="container-px mx-auto h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-full bg-sakura-100 border border-sakura-200" />
          <span className="font-semibold tracking-wide">Miraibits</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
              }
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="relative inline-flex items-center text-gray-600 hover:text-gray-900">
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 h-5 min-w-5 px-1 rounded-full bg-gray-900 text-white text-[10px] flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>
        <Link href="/cart" className="md:hidden relative inline-flex items-center text-gray-600 hover:text-gray-900">
          <ShoppingCart className="h-6 w-6" />
          {totalQuantity > 0 && (
            <span className="absolute -top-1 -right-2 h-5 min-w-5 px-1 rounded-full bg-gray-900 text-white text-[10px] flex items-center justify-center">
              {totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}


