'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AnalysisResult() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || '不明';
  const [activeTab, setActiveTab] = useState('finance'); // finance, positioning, future

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{companyName}の分析結果</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">企業概要</h2>
          <p className="text-gray-300">
            {companyName}の分析結果はこちらに表示されます。
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'finance'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              財務状況
            </button>
            <button
              onClick={() => setActiveTab('positioning')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'positioning'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              ポジショニング
            </button>
            <button
              onClick={() => setActiveTab('future')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'future'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              将来性
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Finance Tab */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">財務状況分析</h3>
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">収益性</h4>
                <p className="text-gray-300">良好なトレンドを示しています。直近3年間の売上高は年平均5.2%成長。</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">収益性グラフがここに表示されます</p>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">財務健全性</h4>
                <p className="text-gray-300">負債比率は業界平均を下回り、安定した財務基盤を持っています。</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">財務指標がここに表示されます</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Positioning Tab */}
          {activeTab === 'positioning' && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">市場ポジショニング</h3>
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">競合分析</h4>
                <p className="text-gray-300">業界内でのマーケットシェアは約15%で、上位3社に入っています。</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">競合比較チャートがここに表示されます</p>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">差別化要因</h4>
                <p className="text-gray-300">技術革新への積極的な投資と高い顧客満足度が強みとなっています。</p>
              </div>
            </div>
          )}
          
          {/* Future Potential Tab */}
          {activeTab === 'future' && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">将来性評価</h3>
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">成長予測</h4>
                <p className="text-gray-300">新規事業の展開により、今後5年間で年平均7%の成長が見込まれます。</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">将来予測グラフがここに表示されます</p>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">リスク評価</h4>
                <p className="text-gray-300">市場の変動に対する耐性は高く、持続可能なビジネスモデルを確立しています。</p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <h4 className="text-lg font-medium text-blue-400 mb-2">投資判断</h4>
                <p className="text-gray-200">
                  長期投資に適しています。安定した財務基盤と将来性を考慮すると、ポートフォリオに組み入れる価値があります。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 