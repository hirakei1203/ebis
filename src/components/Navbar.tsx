'use client';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            Ebis
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-gray-700 text-white' : ''
              }`}
            >
              企業分析
            </Link>

            {isAuthenticated && (
              <>
                <Link 
                  href="/history" 
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/history' ? 'bg-gray-700 text-white' : ''
                  }`}
                >
                  分析履歴
                </Link>
                <Link 
                  href="/settings" 
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/settings' ? 'bg-gray-700 text-white' : ''
                  }`}
                >
                  設定
                </Link>
              </>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-300">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ログイン
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    新規登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 