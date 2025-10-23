"use client";
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useSidebar } from '../lib/sidebar';
import ThemeToggleButton from './ThemeToggleButton';
import { useState } from 'react';

const navLinks: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = String(formData.get('q') || '').trim();
    const url = query ? `/?q=${encodeURIComponent(query)}` : '/';
    router.push(url as any);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-100 dark:border-gray-800 shadow-soft">
      <div className="container-px mx-auto h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Image 
            src="/logo.png" 
            alt="Miraibits Logo" 
            width={32} 
            height={32} 
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="font-semibold tracking-wide">Miraibits</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="relative inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 h-5 min-w-5 px-1 rounded-full bg-sakura-500 text-white text-[10px] flex items-center justify-center border-2 border-white dark:border-gray-900">
                {totalQuantity}
              </span>
            )}
          </Link>
          <ThemeToggleButton />
        </nav>
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 h-5 min-w-5 px-1 rounded-full bg-sakura-500 text-white text-[10px] flex items-center justify-center border-2 border-white dark:border-gray-900">
                {totalQuantity}
              </span>
            )}
          </Link>
          <ThemeToggleButton />
          <button onClick={toggleSidebar} className="md:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}


