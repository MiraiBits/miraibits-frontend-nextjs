"use client";
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '../lib/cart';
import ThemeToggleButton from './ThemeToggleButton';
import { useEffect, useState } from 'react';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(() => searchParams.get('q') ?? '');

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = searchValue.trim();
    const url = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    setSearchValue(query);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    router.push(url as any);
  }

  function toggleSearch() {
    setIsSearchOpen(prev => {
      const next = !prev;
      if (next) {
        setIsMenuOpen(false);
      }
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-100 dark:border-gray-800 shadow-soft">
      <div className="container-px mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-3 md:gap-6 md:h-16 py-4 md:py-0">
          <Link href="/" className="flex items-center text-gray-900 dark:text-gray-100">
            <Image
              src="/mirailk.png"
              alt="Mirai.lk Logo"
              width={160}
              height={160}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <form
            onSubmit={onSearchSubmit}
            className="hidden w-full md:block md:flex-1"
            role="search"
          >
            <label htmlFor="navbar-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                id="navbar-search"
                name="q"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search products"
                className="h-11 w-full rounded-full border border-gray-200 bg-white/90 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-[#ef6a62] focus:outline-none focus:ring-2 focus:ring-[#ef6a62]/40 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:focus:border-[#e6443b] dark:focus:ring-[#e6443b]/40"
                autoComplete="off"
              />
            </div>
          </form>

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
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-2 h-5 min-w-5 px-1 rounded-full bg-[#e6443b] text-white text-[10px] flex items-center justify-center border-2 border-white dark:border-gray-900">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <ThemeToggleButton />
          </div>

          <div className="ml-auto flex items-center gap-3 md:hidden">
            <button
              onClick={toggleSearch}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Toggle search"
              aria-expanded={isSearchOpen}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="relative inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-2 h-5 min-w-5 px-1 rounded-full bg-[#e6443b] text-white text-[10px] flex items-center justify-center border-2 border-white dark:border-gray-900">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <ThemeToggleButton />
            <button
              onClick={() => {
                setIsMenuOpen(prev => !prev);
                setIsSearchOpen(false);
              }}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
      </div>
      </div>
      {isSearchOpen && (
        <div className="absolute left-0 top-full w-full border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden">
          <div className="container-px mx-auto max-w-6xl">
            <form onSubmit={onSearchSubmit} role="search" className="py-3">
              <label htmlFor="navbar-search-mobile" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  id="navbar-search-mobile"
                  name="q"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search products"
                  className="h-11 w-full rounded-full border border-gray-200 bg-white/90 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-[#ef6a62] focus:outline-none focus:ring-2 focus:ring-[#ef6a62]/40 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:focus:border-[#e6443b] dark:focus:ring-[#e6443b]/40"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden">
          <div className="container-px mx-auto max-w-6xl">
            <nav className="flex flex-col items-start gap-4 py-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    pathname === link.href
                      ? 'text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
