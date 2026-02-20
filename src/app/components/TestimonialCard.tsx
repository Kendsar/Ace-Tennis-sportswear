import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  avatar: string;
  rating: number;
  testimonial: string;
}

export function TestimonialCard({ name, avatar, rating, testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Star Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-[#22c55e] text-[#22c55e]'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 italic">
        "{testimonial}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">Tennis Player</p>
        </div>
      </div>
    </div>
  );
}