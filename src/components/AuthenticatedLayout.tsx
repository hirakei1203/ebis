'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register'
];

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();

  // Check if the current page doesn't require authentication
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Don't show layout for login or register pages
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading && !isPublicPath) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login page if user is not authenticated on a protected page
  if (!isAuthenticated && !isPublicPath) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
          <p className="text-gray-400 mb-6">Please log in to access this page.</p>
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 