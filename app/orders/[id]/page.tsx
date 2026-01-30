'use client';

// Order Detail Page - Shows full details of a specific order
// Can be accessed directly via URL or from order history

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrderStatus from '@/app/components/OrderStatus';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id ? parseInt(params.id as string) : null;

  if (!orderId || isNaN(orderId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Invalid Order ID</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black">🍕 Food Delivery App</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <OrderStatus orderId={orderId} />
      </main>
    </div>
  );
}

