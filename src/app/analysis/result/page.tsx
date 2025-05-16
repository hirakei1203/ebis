'use client';
import { useSearchParams } from 'next/navigation';

export default function AnalysisResult() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || '不明';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{companyName}の分析結果</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">企業概要</h2>
          <p className="text-gray-300">
            {companyName}の分析結果はこちらに表示されます。（現在準備中）
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">財務状況</h3>
              <p className="text-gray-400">良いか悪いか、トレンドは？</p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Positoning ()</h3>
              <p className="text-gray-400">データ準備中...</p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">将来性</h3>
              <p className="text-gray-400">投資すべき、なぜなら..?
              </p>
            </div>
            
            {/* <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">ビジネスモデル</h3>
              <p className="text-gray-400">データ準備中...</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
} 