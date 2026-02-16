import { ShoppingBag } from 'lucide-react';
import { Product } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Add Button */}
        <button
          onClick={() => onQuickAdd(product)}
          className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 transform duration-300"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm tracking-wider uppercase group-hover:opacity-60 transition-opacity">
          {product.name}
        </h3>
        <p className="text-sm font-normal">{product.price.toFixed(3)} DT</p>

        {/* Color Options */}
        <div className="flex gap-2 pt-1">
          {product.colors.map((color, index) => (
            <button
              key={index}
              className="w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              style={{ 
                backgroundColor: color,
                boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #e5e7eb' : 'none'
              }}
              title={`Color ${index + 1}`}
              aria-label={`Select color ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}