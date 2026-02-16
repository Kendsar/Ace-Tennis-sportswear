import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { Sheet, SheetContent } from './ui/sheet';
import { toast } from 'sonner';

interface ProductQuickAddProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickAdd({ product, open, onOpenChange }: ProductQuickAddProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Initialize state when product changes
  useEffect(() => {
    if (product && open) {
      setSelectedColor(product.colors[0]);
      setSelectedSize('');
      setQuantity(1);
    }
  }, [product, open]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart(product, selectedColor, selectedSize, quantity);
    toast.success('Added to cart', {
      description: `${product.name} - ${selectedSize}`,
      duration: 2000,
    });
    onOpenChange(false);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart(product, selectedColor, selectedSize, quantity);
    toast.success('Proceeding to checkout');
    onOpenChange(false);
    // In a real app, this would navigate to checkout
  };

  const getColorName = (colorHex: string) => {
    const colorNames: { [key: string]: string } = {
      '#1a1a1a': 'BLACK',
      '#ffffff': 'WHITE',
      '#4a5568': 'GRAY',
      '#2d3748': 'NAVY BLUE',
      '#e5e7eb': 'LIGHT GRAY',
    };
    return colorNames[colorHex] || 'COLOR';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-auto max-h-[90vh] bg-white rounded-t-2xl p-0 border-0"
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Product Header */}
          <div className="flex gap-4 p-6 border-b border-gray-100">
            <div className="w-20 h-28 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-sm tracking-wider uppercase mb-2">
                {product.name}
              </h2>
              <p className="text-sm font-normal">{product.price.toFixed(3)} DT</p>
            </div>
          </div>

          {/* Color Selection */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm tracking-wide text-gray-500">
                Couleur
              </label>
              <span className="text-sm tracking-wider uppercase">
                {getColorName(selectedColor)}
              </span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-11 h-11 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-black scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: color,
                    boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #e5e7eb' : 'none'
                  }}
                  aria-label={`Select ${getColorName(color)}`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="px-6 py-5 border-b border-gray-100">
            <label className="text-sm tracking-wide text-gray-500 mb-3 block">
              Taille
            </label>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm tracking-wider uppercase rounded-sm border transition-all ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-normal w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 rounded-full text-sm tracking-wider uppercase hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full bg-gray-100 text-black py-4 rounded-full text-sm tracking-wider uppercase hover:bg-gray-200 transition-colors"
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}