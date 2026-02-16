import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { useCart } from '../context/CartContext';

export function RootLayout() {
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Header cartCount={cartCount} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}