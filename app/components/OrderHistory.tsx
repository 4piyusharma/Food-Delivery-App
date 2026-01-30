'use client';

// Order History Component - Displays all past orders for a customer
// Allows users to view their order history and track order status

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  customerName: string;
  address: string;
  phoneNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: Array<{
    id: number;
    menuItem: {
      id: number;
      name: string;
      description: string;
      price: string;
    };
    quantity: number;
    price: string;
  }>;
}

interface OrderHistoryProps {
  phoneNumber?: string;
  onBack: () => void;
}

const statusColors: Record<string, string> = {
  'Order Received': 'bg-blue-500',
  'Preparing': 'bg-yellow-500',
  'Out for Delivery': 'bg-purple-500',
  'Delivered': 'bg-green-500',
};

export default function OrderHistory({ phoneNumber, onBack }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPhone, setSearchPhone] = useState(() => {
    if (phoneNumber) return phoneNumber;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastPhoneNumber') || '';
    }
    return '';
  });

  // Load order IDs from localStorage
  const loadOrderIdsFromStorage = (): number[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('orderIds');
    return stored ? JSON.parse(stored) : [];
  };

  useEffect(() => {
    // If phone number is provided, fetch orders by phone
    // Otherwise, try to fetch by last phone number, or fetch orders from localStorage
    if (phoneNumber) {
      fetchOrdersByPhone(phoneNumber);
    } else if (searchPhone) {
      fetchOrdersByPhone(searchPhone);
    } else {
      fetchOrdersByIds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

  const fetchOrdersByPhone = async (phone: string) => {
    if (!phone) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders?phoneNumber=${encodeURIComponent(phone)}`);
      const data = await response.json();

      if (data.success) {
        // Sort by most recent first
        const sortedOrders = data.data.sort((a: Order, b: Order) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setOrders(sortedOrders);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByIds = async () => {
    const orderIds = loadOrderIdsFromStorage();
    
    if (orderIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all orders in parallel
      const orderPromises = orderIds.map(id =>
        fetch(`/api/orders/${id}`).then(res => res.json())
      );

      const results = await Promise.all(orderPromises);
      const validOrders = results
        .filter(result => result.success)
        .map(result => result.data)
        .sort((a: Order, b: Order) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      setOrders(validOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchPhone.trim()) {
      fetchOrdersByPhone(searchPhone.trim());
    }
  };

  const handleViewOrder = (orderId: number) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/orders/${orderId}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-black">Loading order history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
        >
          ← Back to Menu
        </button>
        <h2 className="text-3xl font-bold text-black mb-4">Order History</h2>

        {/* Search by Phone Number */}
        {!phoneNumber && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label htmlFor="phoneSearch" className="block text-sm font-medium mb-2 text-black">
              Search orders by phone number:
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phoneSearch"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">No orders found</p>
          <p className="text-sm text-gray-500">
            {phoneNumber || searchPhone
              ? 'No orders found for this phone number.'
              : 'You haven\'t placed any orders yet. Start ordering to see your history here!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-black">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      statusColors[order.status] || 'bg-gray-500'
                    }`}
                  >
                    {order.status}
                  </div>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-black">Customer:</span> {order.customerName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-black">Phone:</span> {order.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-black">Address:</span> {order.address}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-black">Items:</h4>
                <div className="space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-black">
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      <span className="text-black">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleViewOrder(order.id)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                View Order Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

