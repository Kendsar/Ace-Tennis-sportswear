import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { BestSellers } from '../components/BestSellers';
import { ArrowRight } from 'lucide-react';
import { TrustStrip } from '../components/TrustStrip';
import { TestimonialsSection } from '../components/TestimonialsSection';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-content {
          animation: fadeIn 1s ease-out 0.3s both;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out both;
        }
      `}</style>
      {/* Hero Section */}
      <div className="relative h-[85vh] md:h-[90vh] bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1566226677912-c333af37181f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
          alt="Tennis Campaign"
          className="w-full h-full object-cover"
        />

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl hero-content">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-4 text-black">
              Up to 40% Off Tennis Essentials
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-black/80">
              Performance gear designed to dominate the court.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                aria-label="Shop the current sale"
              >
                Shop Sale
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-black text-black hover:bg-black hover:text-white"
                aria-label="Explore our full collection"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Women's Category */}
          <Link to="/women" className="group block">
            <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <img
                src="https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl tracking-wider uppercase text-gray-900 group-hover:text-gray-600 transition-colors">
                WOMEN
              </h2>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-500 transition-colors">
                Shop performance wear
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
                <span className="text-xs md:text-sm font-medium">Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>

          {/* Men's Category */}
          <Link to="/men" className="group block">
            <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <img
                src="https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl tracking-wider uppercase text-gray-900 group-hover:text-gray-600 transition-colors">
                MEN
              </h2>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-500 transition-colors">
                Shop performance wear
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
                <span className="text-xs md:text-sm font-medium">Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Brand Statement */}
      <div className="bg-gray-50 py-20 md:py-32 px-6 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl tracking-wider uppercase mb-6">
          ACE TENNIS
        </h2>
        <p className="text-sm md:text-base tracking-[0.2em] uppercase max-w-2xl mx-auto text-gray-600">
          Performance meets style on and off the court
        </p>
      </div>

      {/* Trust Strip */}
      <TrustStrip />
    </div>
  );
}