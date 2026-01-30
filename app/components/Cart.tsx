'use client';

// Cart Component - Shows items in the cart and allows quantity updates

interface CartItem {
  menuItem: {
    id: number;
    name: string;
    price: string;
  };
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onRemoveItem: (menuItemId: number) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(item.menuItem.price) * item.quantity;
    }, 0);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl text-black font-bold mb-4">Your Cart</h2>
        <p className="text-black">Your cart is empty. Add some items from the menu!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Your Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.menuItem.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-black">{item.menuItem.name}</h3>
              <p className="text-black">
                ${parseFloat(item.menuItem.price).toFixed(2)} × {item.quantity} = $
                {(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                className="px-2 py-1 text-black bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center text-black">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                className="px-2 py-1 text-black bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
              <button
                onClick={() => onRemoveItem(item.menuItem.id)}
                className="ml-2 px-3 py-1 bg-red-600 text-black  rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-black">Total:</span>
          <span className="text-2xl font-bold text-green-600">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

