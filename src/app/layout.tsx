// /app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Ebis',
  description: 'AI-driven business analysis tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 履歴データのダミー（後で実際のデータソースと入れ替える）
  const historyItems = [
    { id: 1, name: '株式会社トヨタ自動車' },
    { id: 2, name: 'ソニーグループ株式会社' },
    { id: 3, name: '任天堂株式会社' },
    { id: 4, name: '三菱UFJフィナンシャル・グループ' },
    { id: 5, name: 'ソフトバンクグループ株式会社' },
    { id: 6, name: 'キヤノン株式会社' },
    { id: 7, name: '株式会社日立製作所' },
    { id: 8, name: 'パナソニック株式会社' },
    { id: 9, name: '東京海上ホールディングス株式会社' },
    { id: 10, name: 'セブン&アイ・ホールディングス' },
  ];

  return (
    <html lang="ja">
      <body className="bg-gray-900 text-white">
        <div className="flex h-screen">
          {/* サイドバー/ナビゲーション */}
          <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
            {/* ロゴ部分 */}
            <div className="p-4 border-b border-gray-700">
              <div className="text-2xl font-bold">Ebis</div>
            </div>

            {/* 上部メニュー - 高さの3/4を占める */}
            <nav className="h-3/4 p-4 flex flex-col">
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    企業分析
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="flex items-center p-2 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    分析履歴
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="flex items-center p-2 rounded hover:bg-gray-700">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    設定
                  </Link>
                </li>
              </ul>
              
              {/* 余白を作る */}
              <div className="flex-grow"></div>
              
              {/* ログインボタン - ナビゲーションの一番下に配置 */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Link href="/login" className="flex items-center p-2 rounded hover:bg-gray-700">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  ログイン
                </Link>
              </div>
            </nav>

            {/* 履歴セクション */}
            <div className="h-1/2 border-t border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 bg-gray-750">
                <h2 className="text-sm uppercase font-semibold text-gray-400">最近の分析履歴</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-gray-700">
                  {historyItems.map((item) => (
                    <li key={item.id}>
                      <Link 
                        href={`/analysis/${item.id}`} 
                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-sm text-gray-300 truncate">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 border-t border-gray-700">
                <Link 
                  href="/history" 
                  className="flex items-center justify-center text-xs text-gray-400 hover:text-gray-200 py-2"
                >
                  <span>すべての履歴を表示</span>
                  <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
