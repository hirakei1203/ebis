import React from 'react';
import { Company } from '@/types/company';
import { InvestmentAnalyzer } from '@/utils/InvestmentAnalyzer';

interface InvestmentAnalysisProps {
  company: Company;
}

export const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = ({ company }) => {
  const analyzer = new InvestmentAnalyzer(company);
  const analysis = analyzer.getDetailedAnalysis();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case '強く推奨':
        return 'bg-green-500';
      case '推奨':
        return 'bg-blue-500';
      case '中立':
        return 'bg-yellow-500';
      case '注意':
        return 'bg-orange-500';
      case '非推奨':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">投資分析結果</h2>
      
      {/* 総合スコア */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">総合スコア</h3>
          <span className={`text-2xl font-bold ${getScoreColor(analysis.totalScore)}`}>
            {analysis.totalScore.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${getRecommendationColor(analysis.recommendation)}`}
            style={{ width: `${analysis.totalScore}%` }}
          />
        </div>
      </div>

      {/* 推奨度 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">投資推奨度</h3>
        <div className={`inline-block px-4 py-2 rounded-full text-white ${getRecommendationColor(analysis.recommendation)}`}>
          {analysis.recommendation}
        </div>
      </div>

      {/* 詳細スコア */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">財務スコア</h4>
          <p className={`text-xl font-bold ${getScoreColor(analysis.financialScore)}`}>
            {analysis.financialScore.toFixed(1)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">成長スコア</h4>
          <p className={`text-xl font-bold ${getScoreColor(analysis.growthScore)}`}>
            {analysis.growthScore.toFixed(1)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">リスクスコア</h4>
          <p className={`text-xl font-bold ${getScoreColor(analysis.riskScore)}`}>
            {analysis.riskScore.toFixed(1)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">市場スコア</h4>
          <p className={`text-xl font-bold ${getScoreColor(analysis.marketScore)}`}>
            {analysis.marketScore.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}; 