import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from '../components/ThemeProvider';
import { CartProvider } from '../lib/cart';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap' });

const baseUrl = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: 'Miraibits – Electronics Store',
  description: 'Minimal, modern electronics store for maker hardware.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'Miraibits – Electronics Store',
    description: 'Minimal, modern electronics store for maker hardware.',
    url: baseUrl,
    siteName: 'Miraibits',
    images: [
      { url: '/opengraph-image', width: 1200, height: 630, alt: 'Miraibits' },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full ${inter.className} ${noto.className}`}>
      <body suppressHydrationWarning className="min-h-screen antialiased selection:bg-sakura-100 selection:text-gray-900 flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}


