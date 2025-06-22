import React from 'react';
import { InvestmentScore } from '@/utils/InvestmentAnalyzer';

interface InvestmentAnalysisProps {
  score: InvestmentScore;
}

export const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = ({ score }) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-green-600 bg-green-100';
      case 'Buy': return 'text-green-500 bg-green-50';
      case 'Hold': return 'text-yellow-600 bg-yellow-100';
      case 'Sell': return 'text-red-500 bg-red-50';
      case 'Strong Sell': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* 総合スコアと推奨 */}
      <div className="text-center border-b pb-4">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {score.totalScore}/100
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getRecommendationColor(score.recommendation)}`}>
          {score.recommendation}
        </div>
      </div>

      {/* カテゴリー別スコア */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">カテゴリー別評価</h3>
        
        {[
          { label: '財務健全性', value: score.scores.financialHealth, key: 'financialHealth' },
          { label: '成長性', value: score.scores.growth, key: 'growth' },
          { label: '割安性', value: score.scores.valuation, key: 'valuation' },
          { label: 'リスク', value: score.scores.risk, key: 'risk' }
        ].map(({ label, value, key }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className={`text-sm font-semibold ${getScoreColor(value)}`}>
                {value}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 強みと弱み */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 強み */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-green-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            強み
          </h4>
          <ul className="space-y-1">
            {score.details.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* 弱み */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            弱み
          </h4>
          <ul className="space-y-1">
            {score.details.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 主要指標 */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-900">主要指標</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(score.details.keyMetrics).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">{key}</div>
              <div className="text-sm font-semibold text-gray-900">
                {typeof value === 'number' ? value.toFixed(2) : value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 