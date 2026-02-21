import { useState, useEffect } from 'react';
import { Menu, Search, User, ShoppingBag, X, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CartDrawer } from './CartDrawer';
import { toast } from 'sonner';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const [expandedSections, setExpandedSections] = useState({
    women: false,
    men: false,
  });

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

  const toggleSection = (section: 'women' | 'men') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          <div className="mb-10" style={{ marginBottom: '0' }}>
            <button
              onClick={() => toggleSection('women')}
              className="flex items-center justify-between w-full text-left mb-4 hover:opacity-60 transition-opacity"
            >
              <h2 className="text-2xl tracking-wider font-normal">WOMEN</h2>
              {expandedSections.women ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <nav
              className={`space-y-3 overflow-hidden transition-all duration-300 ${
                expandedSections.women ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
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
            <button
              onClick={() => toggleSection('men')}
              className="flex items-center justify-between w-full text-left mb-4 hover:opacity-60 transition-opacity"
            >
              <h2 className="text-2xl tracking-wider font-normal">MEN</h2>
              {expandedSections.men ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <nav
              className={`space-y-3 overflow-hidden transition-all duration-300 ${
                expandedSections.men ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
    setIsCartOpen(false);
  }, [location]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#5ab1d1] text-white py-2.5 px-4 text-center">
        <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase">
          Smash Hard · ACE Tennis Sportswear FW Collection
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
            <span className="text-[10px] tracking-[0.2em] mt-1 group-hover:opacity-60 transition-opacity">
              ACE SPORT
            </span>
          </Link>

          {/* Right: User + Cart */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hover:opacity-60 transition-opacity"
                aria-label="Account"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 shadow-lg rounded-md w-48 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100" style={{overflowWrap: 'anywhere'}}>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {user.email}
                        </p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 uppercase tracking-wide"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 uppercase tracking-wide"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 uppercase tracking-wide flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 uppercase tracking-wide"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 uppercase tracking-wide"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
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
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}