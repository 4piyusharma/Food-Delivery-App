'use client';

// Menu Component - Displays all available food items
// Users can add items to their cart from here

import { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
}

interface MenuProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Fetch menu items from API
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMenuItems(data.data);
          // Initialize quantities to 1 for each item
          const initialQuantities: { [key: number]: number } = {};
          data.data.forEach((item: MenuItem) => {
            initialQuantities[item.id] = 1;
          });
          setQuantities(initialQuantities);
        } else {
          setError('Failed to load menu');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu');
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (itemId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-black">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover" 
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-black mb-2">{item.name}</h3>
            <p className="text-black mb-4">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                ${parseFloat(item.price).toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-3 py-1 text-black  bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center text-black">{quantities[item.id] || 1}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-3 py-1 text-black bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => onAddToCart(item, quantities[item.id] || 1)}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

