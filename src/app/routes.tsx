import { createBrowserRouter } from 'react-router';
import { RootLayout } from './pages/RootLayout';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
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
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);