// /app/layout.tsx
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export const metadata = {
  title: 'Ebis',
  description: 'AI-driven business analysis tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-900 text-white">
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
