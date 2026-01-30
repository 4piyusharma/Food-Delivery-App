'use client';

// Checkout Component - Form for entering delivery details

import { useState } from 'react';

interface CartItem {
  menuItem: {
    id: number;
    name: string;
    price: string;
  };
  quantity: number;
}

interface CheckoutProps {
  items: CartItem[];
  onOrderPlaced: (orderId: number) => void;
  onCancel: () => void;
}

export default function Checkout({ items, onOrderPlaced, onCancel }: CheckoutProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(item.menuItem.price) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.customerName || !formData.address || !formData.phoneNumber) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.customerName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
      };

      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        // Save order to localStorage for order history
        if (typeof window !== 'undefined') {
          const existingOrders = JSON.parse(localStorage.getItem('orderIds') || '[]');
          if (!existingOrders.includes(data.data.id)) {
            existingOrders.push(data.data.id);
            localStorage.setItem('orderIds', JSON.stringify(existingOrders));
          }
          // Also save phone number for easy lookup
          if (formData.phoneNumber) {
            localStorage.setItem('lastPhoneNumber', formData.phoneNumber);
          }
        }
        onOrderPlaced(data.data.id);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-black">Order Summary</h3>
        {items.map((item) => (
          <div key={item.menuItem.id} className="flex justify-between text-sm mb-1">
            <span className='text-black'>{item.menuItem.name} × {item.quantity}</span>
            <span className='text-black'>${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
          <span className='text-black'>Total:</span>
          <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-black text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-4 text-black py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="text-black block text-sm font-medium mb-1">
            Delivery Address *
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-black">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

