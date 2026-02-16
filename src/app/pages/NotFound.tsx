import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl md:text-8xl tracking-wider mb-4">404</h1>
      <p className="text-xl tracking-wider uppercase mb-8">Page Not Found</p>
      <Link
        to="/"
        className="px-8 py-3 bg-black text-white tracking-wider uppercase text-sm hover:bg-gray-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
