import { Button } from '../components/ui/button';
import { BestSellers } from '../components/BestSellers';
import { TrustStrip } from '../components/TrustStrip';
import { TestimonialsSection } from '../components/TestimonialsSection';
import tennisPlayerImage from '../../assets/f-tennis-player-posing-indoor-tennis-court.jpg';

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
      <div className="relative h-[85vh] md:h-[90vh] lg:h-[95vh] bg-gray-900">
        <img
          src={tennisPlayerImage}
          alt="Professional tennis player posing on indoor tennis court"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-7xl hero-content">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight mb-4 md:mb-6 text-white drop-shadow-lg">
              Play Hard,<br className="hidden sm:block" />
              <span className="text-[#82C5F4]"> Rule the Court</span><br className="hidden md:block" />
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 lg:mb-12 text-white/90 drop-shadow-md font-light leading-relaxed max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              Dominate the court with confidence and conscience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Button
                variant="primary"
                size="lg"
                className="rounded-none relative overflow-hidden group"
                aria-label="Shop our high-performance tennis wear today"
              >
                <span className="relative z-10">Shop Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-none border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-12 md:h-16 backdrop-blur-sm bg-white/10 w-full sm:w-auto"
                aria-label="Learn more about our eco-friendly collection"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* USP Section - Trust Indicators */}
      <TrustStrip />

      {/* Product Grid Section */}
      <BestSellers />

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}