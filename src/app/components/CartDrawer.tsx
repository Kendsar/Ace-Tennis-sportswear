import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutModal } from './CheckoutModal';
import { Button } from './ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  function handleCheckout() {
    setCheckoutOpen(true);
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg uppercase tracking-wider font-bold">
            Cart ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-60 transition-opacity"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 uppercase tracking-wide text-sm">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="border-b border-gray-100 pb-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold uppercase tracking-tight text-sm mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        Color:{' '}
                        <span
                          className="inline-block w-3 h-3 border border-gray-300 align-middle"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-sm font-bold">{item.price.toFixed(2)} DT</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="p-2 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.selectedColor, item.selectedSize)
                      }
                      className="text-red-600 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="uppercase tracking-wide text-sm">Subtotal</span>
              <span className="text-xl font-bold">{cartTotal.toFixed(2)} DT</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full uppercase tracking-wide"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) {
            onClose(); // Close cart drawer after checkout
          }
        }}
      />
    </>
  );
}
