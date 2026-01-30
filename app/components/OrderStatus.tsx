'use client';

// Order Status Component - Displays order status with real-time updates
// Polls the API every few seconds to check for status updates

import { useState, useEffect } from 'react';

interface OrderStatusProps {
  orderId: number;
}

const statusSteps = [
  { status: 'Order Received', label: 'Order Received', color: 'bg-blue-500' },
  { status: 'Preparing', label: 'Preparing', color: 'bg-yellow-500' },
  { status: 'Out for Delivery', label: 'Out for Delivery', color: 'bg-purple-500' },
  { status: 'Delivered', label: 'Delivered', color: 'bg-green-500' },
];

export default function OrderStatus({ orderId }: OrderStatusProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch order status
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch order status');
        }
      } catch (err) {
        console.error('Error fetching order status:', err);
        setError('Failed to fetch order status');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrderStatus();

    // Poll for updates every 3 seconds (simulating real-time updates)
    const interval = setInterval(fetchOrderStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-black">Loading order status...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-red-600">{error || 'Order not found'}</div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black">Order #{order.id} Status</h2>

      {/* Status Timeline */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div key={step.status} className="flex flex-col items-center flex-1 relative text-black">
                {/* Connecting line */}
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute h-1 w-full ${
                      isCompleted ? step.color : 'bg-gray-300'
                    }`}
                    style={{
                      left: '60%',
                      top: '24px',
                      width: '80%',
                      zIndex: 0,
                    }}
                  />
                )}
                {/* Status circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${
                    isCompleted ? step.color : 'bg-gray-300'
                  } text-white font-bold`}
                >
                  {index + 1}
                </div>
                {/* Status label */}
                <div className={`mt-2 text-sm text-center ${isCurrent ? 'font-bold' : ''}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-black">Customer Information</h3>
          <p className="text-black">Name: {order.customerName}</p>
          <p className="text-black">Phone: {order.phoneNumber}</p>
          <p className="text-black">Address: {order.address}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-black">Order Items</h3>
          {order.items && order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-1">
              <span className='text-black'>{item.menuItem.name} × {item.quantity}</span>
              <span className='text-black'>${parseFloat(item.price) * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between font-bold text-lg">
            <span className='text-black'>Total:</span>
            <span className="text-green-600">${parseFloat(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Order status updates automatically every 3 seconds.
          In a real app, this would use WebSockets for instant updates.
        </p>
      </div>
    </div>
  );
}

