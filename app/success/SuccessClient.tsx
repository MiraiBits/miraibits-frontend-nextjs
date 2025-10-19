"use client";
import { useEffect, useState } from 'react';
import { useCart } from '../../lib/cart';
import Link from 'next/link';
import { downloadReceiptPdf } from '../../lib/pdf-client';
import type { Order } from '../../lib/types';

export default function SuccessClient({ orderId }: { orderId?: string | null }) {
  const { clearCart } = useCart();
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => { clearCart(); }, [clearCart]);

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

  return (
    <main className="container-px mx-auto py-16 text-center max-w-xl">
      <h1 className="text-2xl font-semibold">Thank you for your order</h1>
      <p className="mt-3 text-gray-700 dark:text-gray-300">We will review your payment proof and contact you shortly.</p>
      {orderId && (
        <div className="mt-6">
          <button
            className="btn btn-ghost"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
          >
            {isDownloading ? 'Generating PDF...' : 'Download receipt'}
          </button>
        </div>
      )}
      <Link href="/" className="btn btn-primary mt-6">Back to Home</Link>
    </main>
  );
}


