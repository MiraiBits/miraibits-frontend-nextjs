"use client";
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { Home, Info, Mail } from 'lucide-react';
import { useSidebar } from '../lib/sidebar';

const sidebarLinks: Array<{ href: Route; label: string; icon: React.ReactNode }> = [
  { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { href: '/about', label: 'About', icon: <Info className="h-5 w-5" /> },
  { href: '/contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useSidebar();

  return (
    <aside className={`transition-width duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} md:w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 p-4 overflow-hidden`}>
      <nav className="flex flex-col gap-4">
        {sidebarLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              pathname === link.href
                ? 'bg-sakura-100 text-gray-900 dark:bg-sakura-500/20 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
