import { useState, useEffect } from 'react';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="mb-8 hover:opacity-60 transition-opacity"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Women's Section */}
          <div className="mb-10">
            <h2 className="text-2xl mb-4 tracking-wider font-normal">WOMEN</h2>
            <nav className="space-y-3">
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                ALL PRODUCTS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                NEW COLLECTION
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                SETS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                PACKS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                T-SHIRTS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                TOPS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                TANK TOP
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                LONG SLEEVE
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                LEGGINGS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                PANTS
              </Link>
              <Link
                to="/women"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                SWIMSUITS
              </Link>
            </nav>
          </div>

          {/* Men's Section */}
          <div>
            <h2 className="text-2xl mb-4 tracking-wider font-normal">MEN</h2>
            <nav className="space-y-3">
              <Link
                to="/men"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                ALL PRODUCTS
              </Link>
              <Link
                to="/men"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                PANTS
              </Link>
              <Link
                to="/men"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                SHORTS
              </Link>
              <Link
                to="/men"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                T-SHIRT
              </Link>
              <Link
                to="/men"
                onClick={onClose}
                className="block text-sm tracking-wider hover:opacity-60 transition-opacity"
              >
                PACKS
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

interface HeaderProps {
  cartCount: number;
}

export function Header({ cartCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#3a3d3a] text-white py-2.5 px-4 text-center">
        <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase">
          MOVE WITH POWER · ALPHA SPORTS FALL | WINTER IS HERE
        </p>
      </div>

      {/* Main Header */}
      <header
        className={`bg-white border-b border-gray-100 sticky top-0 z-30 transition-shadow duration-300 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="hover:opacity-60 transition-opacity"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              className="hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <div
              className="w-6 h-6 border-2 border-black group-hover:opacity-60 transition-opacity"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />
            <span className="text-[10px] tracking-[0.2em] mt-1 group-hover:opacity-60 transition-opacity">
              ALPHA SPORT
            </span>
          </Link>

          {/* Right: User + Cart */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="hover:opacity-60 transition-opacity"
              aria-label="Account"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              className="relative hover:opacity-60 transition-opacity"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Menu */}
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}