'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

// 認証が不要なページのパス
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register'
];

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();

  // 認証が不要なページかどうかをチェック
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // ログインページまたは登録ページの場合は、レイアウトを表示しない
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // ローディング中
  if (isLoading && !isPublicPath) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 認証が必要なページで未認証の場合はログインページにリダイレクト
  if (!isAuthenticated && !isPublicPath) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">ログインが必要です</h1>
          <p className="text-gray-400 mb-6">このページにアクセスするにはログインしてください。</p>
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            ログインページへ
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