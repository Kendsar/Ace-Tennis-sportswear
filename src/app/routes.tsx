import { createBrowserRouter } from 'react-router';
import { RootLayout } from './pages/RootLayout';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrdersPage } from './pages/OrdersPage';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'women',
        element: <ProductListingPage category="women" title="WOMEN" />,
      },
      {
        path: 'men',
        element: <ProductListingPage category="men" title="MEN SHORTS" />,
      },
      {
        path: 'orders',
        Component: OrdersPage,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignUpPage,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
]);