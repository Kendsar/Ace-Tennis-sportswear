import { BestSellerCard } from './BestSellerCard';
import { products } from '../data/products';

// Select 6 best sellers - mix of men and women, higher priced items
const bestSellers = [
  products.find(p => p.id === 'w6')!, // COURT COLLECTION SET - 120 DT
  products.find(p => p.id === 'm6')!, // PRO PACK COMBO - 99 DT
  products.find(p => p.id === 'w1')!, // ACE TENNIS DRESS - 89 DT
  products.find(p => p.id === 'm4')!, // ACE TENNIS PANTS - 79 DT
  products.find(p => p.id === 'w5')!, // TENNIS SKIRT PRO - 75 DT
  products.find(p => p.id === 'm3')!, // PERFORMANCE POLO - 69 DT
];

export function BestSellers() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Best Sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular tennis essentials, loved by players worldwide
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}