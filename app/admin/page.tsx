'use client';

// Admin Page - Simple interface to update order statuses for testing
// This helps simulate real-time order status updates

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  customerName: string;
  status: string;
  totalAmount: string;
  createdAt: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh orders list
        fetchOrders();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-black">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Admin - Order Management</h1>
          <p className="text-black mb-6">
            Use this page to update order statuses and test real-time updates.
          </p>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-black">
              No orders yet. Place an order from the main page first!
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                      <p className="text-black">Customer: {order.customerName}</p>
                      <p className="text-black">
                        Total: ${parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-sm text-black">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        disabled={updating === order.id || order.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          order.status === status
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : updating === order.id
                            ? 'bg-gray-300 text-black cursor-not-allowed'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Main App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

