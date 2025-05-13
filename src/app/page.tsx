// /app/page.tsx
'use client';
import { useState } from 'react';
import BackgroundParticles from '@/components/ui/BackgroundParticles';

export default function Home() {
  const [companyName, setCompanyName] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 検索処理（後で実装）
    console.log('検索:', companyName);
  };

  return (
    <>
      <BackgroundParticles />
      
      <div className="relative max-w-3xl mx-auto z-10">
        <h1 className="text-3xl font-bold mb-8">企業分析</h1>
        
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                企業名
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/80 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: トヨタ自動車"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              AI分析を開始
            </button>
          </form>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 text-gray-300 text-sm space-y-2">
          <p>企業名を入力して検索すると、AIがその企業の:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>財務状況</li>
            <li>業界ポジション</li>
            <li>将来性</li>
            <li>ビジネスモデル</li>
          </ul>
          <p>などを総合的に分析します。</p>
        </div>
      </div>
    </>
  );
}
