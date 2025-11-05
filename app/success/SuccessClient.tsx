"use client";
import { useEffect, useState } from 'react';
import { useCart } from '../../lib/cart';
import Link from 'next/link';
import { downloadReceiptPdf } from '../../lib/pdf-client';
import type { Order } from '../../lib/types';

export default function SuccessClient({ orderId }: { orderId?: string | null }) {
  const { clearCart } = useCart();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const steps = [
    {
      title: 'Payment review',
      detail: 'Our finance team verifies the uploaded proof of payment.',
    },
    {
      title: 'Order confirmation',
      detail: 'We send a confirmation email with any additional instructions.',
    },
    {
      title: 'Dispatch preparation',
      detail: 'We prepare your items and schedule the handover to our courier.',
    },
  ];

  useEffect(() => { clearCart(); }, [clearCart]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsCardVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (copyStatus === 'copied') {
      const timeout = window.setTimeout(() => setCopyStatus('idle'), 2000);
      return () => window.clearTimeout(timeout);
    }
  }, [copyStatus]);

  const handleDownloadReceipt = async () => {
    if (!orderId) return;
    
    setIsDownloading(true);
    try {
      // Fetch order data from API
      const response = await fetch(`/api/orders/${orderId}/receipt`);
      if (!response.ok) throw new Error('Failed to fetch order data');
      
      const order: Order = await response.json();
      
      // Generate and download PDF on client side
      downloadReceiptPdf(order);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyOrderId = async () => {
    if (!orderId) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(orderId);
        setCopyStatus('copied');
      } else {
        throw new Error('Clipboard unavailable');
      }
    } catch (error) {
      console.error('Failed to copy order id:', error);
      alert('Could not copy the order ID. Please try again.');
    }
  };

  return (
    <main className="container-px mx-auto max-w-2xl py-16">
      <div className={`relative rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl transition-all duration-700 ease-out dark:border-gray-800 dark:bg-gray-900 ${isCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
          Checkout complete
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Your order is locked in
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Thanks for shopping with Mirai. We&apos;ll review your payment proof and keep you posted until dispatch.
        </p>

        {orderId && (
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-mono text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
            <span className="uppercase tracking-wide text-xs font-semibold text-emerald-800 dark:text-emerald-200">
              Order ID
            </span>
            <span>{orderId}</span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-transparent text-emerald-700 transition-colors hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-100"
              aria-live="polite"
            >
              <span
                className={`grid h-4 w-4 place-items-center transition-all duration-200 ease-out ${copyStatus === 'copied' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span
                className={`absolute inset-0 grid place-items-center transition-all duration-200 ease-out ${copyStatus === 'copied' ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                >
                  <path
                    d="m6 12 4 4 8-8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sr-only">
                {copyStatus === 'copied' ? 'Order ID copied' : 'Copy order ID'}
              </span>
            </button>
          </div>
        )}

        <ol className="mt-8 space-y-4 text-left text-sm text-gray-700 dark:text-gray-300">
          {steps.map((step, index) => (
            <li key={step.title} className="flex items-start gap-4 rounded-2xl bg-gray-50 p-5 shadow-sm transition-colors duration-300 hover:bg-white dark:bg-gray-900/60 dark:hover:bg-gray-900">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-black text-base font-semibold text-white shadow-sm dark:bg-black dark:text-white">
                {index + 1}
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{step.title}</p>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {orderId && (
            <button
              className="btn btn-primary bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:outline-emerald-500"
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating PDF…' : 'Download receipt'}
            </button>
          )}
          <Link href="/" className="btn btn-ghost text-emerald-600 hover:text-emerald-700 dark:text-emerald-200 dark:hover:text-emerald-100">
            Keep browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
