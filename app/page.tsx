'use client';

// Main Page Component - Manages the overall application state
// Handles navigation between Menu, Cart, Checkout, and Order Status views

import { useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderStatus from './components/OrderStatus';

type View = 'menu' | 'checkout' | 'order-status';

interface CartItem {
  menuItem: {
    id: number;
    name: string;
    price: string;
  };
  quantity: number;
}

export default function Home() {
  const [view, setView] = useState<View>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Add item to cart
  const handleAddToCart = (item: any, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item already in cart
        return prevCart.map(cartItem =>
          cartItem.menuItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevCart, { menuItem: item, quantity }];
      }
    });
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(menuItemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (menuItemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== menuItemId));
  };

  // Handle checkout button click
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setView('checkout');
  };

  // Handle order placement
  const handleOrderPlaced = (newOrderId: number) => {
    setOrderId(newOrderId);
    setCart([]); // Clear cart
    setView('order-status');
  };

  // Handle cancel checkout
  const handleCancelCheckout = () => {
    setView('menu');
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setView('menu');
    setOrderId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black">🍕 Food Delivery App</h1>
            {view === 'menu' && (
              <button
                onClick={() => setView('menu')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 relative"
              >
                Cart ({cart.length})
              </button>
            )}
            {view === 'order-status' && (
              <button
                onClick={handleBackToMenu}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Menu
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl text-black font-bold mb-6">Menu</h2>
              <Menu onAddToCart={handleAddToCart} />
            </div>
            <div className="lg:col-span-1">
              <Cart
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {view === 'checkout' && (
          <div>
            <button
              onClick={handleCancelCheckout}
              className="mb-4 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
            >
              ← Back to Menu
            </button>
            <Checkout
              items={cart}
              onOrderPlaced={handleOrderPlaced}
              onCancel={handleCancelCheckout}
            />
          </div>
        )}

        {view === 'order-status' && orderId && (
          <OrderStatus orderId={orderId} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-black">
          <p>Food Delivery App - Order Management System</p>
        </div>
      </footer>
    </div>
  );
}
