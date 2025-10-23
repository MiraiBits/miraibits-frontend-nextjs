import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { ThemeProvider } from '../components/ThemeProvider';
import { CartProvider } from '../lib/cart';
import { SidebarProvider } from '../lib/sidebar';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
            <SidebarProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
                <Footer />
              </div>
            </SidebarProvider>
          </CartProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}


