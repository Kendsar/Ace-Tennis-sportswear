import { Link } from 'react-router';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[85vh] md:h-[90vh] bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1566226677912-c333af37181f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
          alt="Tennis Campaign"
          className="w-full h-full object-cover"
        />

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl">
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.9] mb-2 text-white">
              SALES
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.9] mb-2 text-white">
              SALES
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.9] mb-8 text-white">
              SALES
            </h1>
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white">
              IN STORE AND ONLINE
            </p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Women's Category */}
          <Link to="/women" className="group">
            <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1684225358843-54b1132537b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wider uppercase text-center group-hover:opacity-60 transition-opacity">
              WOMEN
            </h2>
          </Link>

          {/* Men's Category */}
          <Link to="/men" className="group">
            <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1663712730198-f8b201d20f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h2 className="text-3xl md:text-4xl tracking-wider uppercase text-center group-hover:opacity-60 transition-opacity">
              MEN
            </h2>
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
    </div>
  );
}