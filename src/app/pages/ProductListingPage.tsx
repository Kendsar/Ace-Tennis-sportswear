import { useState } from 'react';
import { Filter, Grid2X2, List } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickAdd } from '../components/ProductQuickAdd';
import { Product } from '../context/CartContext';
import { getProductsByCategory } from '../data/products';

interface ProductListingPageProps {
  category: 'men' | 'women';
  title: string;
}

export function ProductListingPage({ category, title }: ProductListingPageProps) {
  const [gridView, setGridView] = useState<'2col' | '1col'>('2col');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const products = getProductsByCategory(category);

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
    setQuickAddOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title */}
      <div className="px-4 md:px-8 pt-10 md:pt-12 pb-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-wider uppercase">
          {title}
        </h1>
      </div>

      {/* Filter & View Controls */}
      <div className="px-4 md:px-8 pb-6 flex items-center justify-between border-b border-gray-200">
        <button className="flex items-center gap-2 text-sm tracking-wider uppercase hover:opacity-60 transition-opacity">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => setGridView(gridView === '2col' ? '1col' : '2col')}
          className="hover:opacity-60 transition-opacity"
        >
          {gridView === '2col' ? (
            <Grid2X2 className="w-5 h-5" />
          ) : (
            <List className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Product Grid */}
      <div className="px-4 md:px-8 py-8 md:py-12">
        <div
          className={`grid gap-6 md:gap-8 ${
            gridView === '2col'
              ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div className="px-4 md:px-8 pb-12 text-center">
        <p className="text-sm tracking-wider uppercase text-gray-500">
          Showing {products.length} Products
        </p>
      </div>

      {/* Quick Add Modal */}
      <ProductQuickAdd
        product={selectedProduct}
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />
    </div>
  );
}