import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../lib/cart';
import { Inter, Noto_Sans_JP } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400','500','700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Miraibits – Japanese Electronics Store',
  description: 'Minimal, modern Japanese-inspired electronics store for maker hardware.',
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://miraibits.example.com'),
  openGraph: {
    title: 'Miraibits – Japanese Electronics Store',
    description: 'Minimal, modern Japanese-inspired electronics store for maker hardware.',
    url: 'https://miraibits.example.com',
    siteName: 'Miraibits',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'Miraibits' },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full bg-white text-gray-900 ${inter.className} ${noto.className}`}>
      <body className="min-h-screen antialiased selection:bg-sakura-100 selection:text-gray-900 flex flex-col">
        <CartProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


