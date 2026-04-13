import { TestimonialCard } from './TestimonialCard';

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    rating: 5,
    testimonial: 'The performance leggings are incredible. They provide perfect support during intense matches and look great too. Highly recommend for serious players!'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    rating: 5,
    testimonial: 'Vamos Tennis gear has transformed my game. The quality materials and design make me feel like a professional player every time I step on the court.'
  },
  {
    id: 3,
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    rating: 5,
    testimonial: 'From the first wear, I knew this was premium tennis apparel. Comfortable, durable, and stylish - exactly what I need for tournament play.'
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Trusted by Players
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from tennis players who trust VAMOS for their performance gear
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${testimonial.id * 0.2}s`, animationFillMode: 'forwards' }}
            >
              <TestimonialCard
                name={testimonial.name}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
                testimonial={testimonial.testimonial}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}