// /app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Ebis',
  description: 'AI-driven business analysis tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-black border-r border-white flex flex-col p-4 space-y-4">
            <div className="text-2xl font-bold mb-6">Ebis</div>
            <button className="text-left hover:underline">企業分析</button>
            <button className="text-left hover:underline">分析履歴</button>
          </aside>

          {/* Main */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
