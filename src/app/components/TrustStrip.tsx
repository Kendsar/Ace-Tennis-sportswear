import { Truck, RotateCcw, Shield, Award } from 'lucide-react';

const trustItems = [
  {
    icon: Truck,
    title: 'Free Shipping Over $75',
    description: 'Fast, reliable delivery worldwide'
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
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
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 mb-4 group-hover:shadow-md transition-shadow duration-200">
                  <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-gray-700" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
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