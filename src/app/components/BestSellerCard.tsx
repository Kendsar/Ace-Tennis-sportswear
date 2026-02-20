import { useState } from 'react';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../context/CartContext';
import { ProductQuickAdd } from './ProductQuickAdd';
import { Button } from './ui/button';

interface BestSellerCardProps {
  product: Product;
}

export function BestSellerCard({ product }: BestSellerCardProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Mock star rating - in real app this would come from product data
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 50) + 10;

  return (
    <>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium tracking-wide uppercase text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : i < rating
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {rating} ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-semibold text-gray-900">
            {product.price.toFixed(3)} DT
          </p>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setQuickAddOpen(true)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <ProductQuickAdd
        product={product}
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />
    </>
  );
}