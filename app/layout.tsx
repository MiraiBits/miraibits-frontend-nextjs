import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from '../components/ThemeProvider';
import { CartProvider } from '../lib/cart';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from 'react';
import { buildKeywordVariants, getSiteUrl, siteMetadataDefaults } from '../lib/seo';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap' });

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Mirai.lk – Electronics Store',
    template: '%s | Mirai.lk',
  },
  description: siteMetadataDefaults.description,
  alternates: {
    canonical: baseUrl,
  },
  keywords: buildKeywordVariants(),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Mirai.lk – Electronics Store',
    description: siteMetadataDefaults.description,
    url: baseUrl,
    siteName: 'Mirai.lk',
    images: [
      { url: '/opengraph-image', width: 1200, height: 630, alt: 'Mirai.lk' },
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
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
