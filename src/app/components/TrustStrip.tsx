import { Truck, RotateCcw, Shield, Award } from 'lucide-react';

const trustItems = [
  {
    icon: Truck,
    title: 'Free Shipping Over 150 DT',
    description: 'Fast, reliable delivery worldwide'
  },
  {
    icon: RotateCcw,
    title: '7-Day Returns',
    description: 'Easy returns and exchanges'
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: 'SSL encrypted transactions'
  },
  {
    icon: Award,
    title: 'Premium Performance Materials',
    description: 'Court-tested, athlete-approved'
  }
];

export function TrustStrip() {
  return (
    <section className="bg-white border-y border-gray-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#5ab1d1]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#5ab1d1]/20 transition-colors duration-300">
                  <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-[#5ab1d1]" strokeWidth={1.5} />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}