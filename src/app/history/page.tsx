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
  // Dummy data (to be replaced with actual data source later)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: 1, name: 'Toyota Motor Corporation', date: '2023-10-21', industry: 'Automotive' },
    { id: 2, name: 'Sony Group Corporation', date: '2023-10-20', industry: 'Electronics' },
    { id: 3, name: 'Nintendo Co., Ltd.', date: '2023-10-19', industry: 'Gaming' },
    { id: 4, name: 'Mitsubishi UFJ Financial Group', date: '2023-10-18', industry: 'Finance' },
    { id: 5, name: 'SoftBank Group Corp.', date: '2023-10-17', industry: 'Telecommunications' },
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