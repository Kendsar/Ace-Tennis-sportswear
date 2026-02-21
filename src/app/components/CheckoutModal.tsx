import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI, OrderItem } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { X, ShoppingBag } from 'lucide-react';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  if (!open) return null;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Prepare order items
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create order
      const response = await ordersAPI.create(
        orderItems,
        cartTotal,
        shippingAddress
      );

      toast.success('Order placed successfully!');
      clearCart(); // Clear cart after successful order
      onOpenChange(false);
      
      // Navigate to orders page
      navigate('/orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Checkout
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:opacity-60 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wide mb-4 font-bold">
              Order Summary
            </h3>
            <div className="space-y-4 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 text-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold uppercase tracking-tight">{item.name}</p>
                    <p className="text-gray-600">
                      Color: <span
                        className="inline-block w-3 h-3 border border-gray-300 align-middle"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </p>
                    <p className="text-gray-600">Size: {item.selectedSize}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div>
                    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} DT</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg uppercase tracking-wide font-bold">Total</span>
                <span className="text-2xl font-bold">{cartTotal.toFixed(2)} DT</span>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <h3 className="text-sm uppercase tracking-wide mb-4 font-bold">
              Shipping Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs uppercase">Full Name *</Label>
                <Input
                  id="fullName"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs uppercase">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street" className="text-xs uppercase">Street Address *</Label>
              <Input
                id="street"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs uppercase">City *</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-xs uppercase">State *</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-xs uppercase">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-xs uppercase">Country *</Label>
              <Input
                id="country"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full uppercase tracking-wide"
              >
                {loading ? 'Processing...' : `Place Order - ${cartTotal.toFixed(2)} DT`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}