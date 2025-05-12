'use client';
import { useState } from 'react';
import Link from 'next/link';

interface HistoryItem {
  id: number;
  name: string;
  date: string;
  industry: string;
}

export default function History() {
  // ダミーデータ（後で実際のデータソースと入れ替える）
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: 1, name: '株式会社トヨタ自動車', date: '2023-10-21', industry: '自動車' },
    { id: 2, name: 'ソニーグループ株式会社', date: '2023-10-20', industry: '電機' },
    { id: 3, name: '任天堂株式会社', date: '2023-10-19', industry: 'ゲーム' },
    { id: 4, name: '三菱UFJフィナンシャル・グループ', date: '2023-10-18', industry: '金融' },
    { id: 5, name: 'ソフトバンクグループ株式会社', date: '2023-10-17', industry: '通信' },
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">分析履歴</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-xl font-semibold">過去の企業分析</h2>
          <p className="text-sm text-gray-300">{historyItems.length}件の結果</p>
        </div>
        
        <div className="divide-y divide-gray-700">
          {historyItems.map((item) => (
            <Link 
              href={`/analysis/${item.id}`} 
              key={item.id}
              className="block p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-gray-400 text-sm">業界: {item.industry}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-300 text-sm block">{item.date}</span>
                  <span className="text-blue-400 text-sm block mt-1">詳細を見る &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {historyItems.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <p>分析履歴がありません。</p>
            <p className="mt-2">
              <Link href="/" className="text-blue-400 hover:underline">
                企業分析ページ
              </Link>
              から分析を開始してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 