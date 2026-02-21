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
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-t-lg flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-2 sm:space-y-3">
          <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
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
          <p className="text-base sm:text-lg font-semibold text-gray-900 flex-shrink-0">
            {product.price.toFixed(3)} DT
          </p>

          {/* Add to Cart Button */}
          <div className="mt-auto pt-2">
            <Button
              variant="primary"
              className="w-full rounded-none relative overflow-hidden group text-sm sm:text-base"
              onClick={() => setQuickAddOpen(true)}
              aria-label={`Add ${product.name} to cart - Limited Stock`}
            >
              <span className="relative z-10">Add to Cart</span>
              <span className="text-xs opacity-80 ml-1 hidden sm:inline">• Limited Stock</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </Button>
          </div>
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