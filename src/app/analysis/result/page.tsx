'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AnalysisResult() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || 'Unknown';
  const [activeTab, setActiveTab] = useState('finance'); // finance, positioning, future

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{companyName} Analysis Results</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Company Overview</h2>
          <p className="text-gray-300">
            Analysis results for {companyName} will be displayed here.
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
              Financial Performance
            </button>
            <button
              onClick={() => setActiveTab('positioning')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'positioning'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Market Positioning
            </button>
            <button
              onClick={() => setActiveTab('future')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'future'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Future Prospects
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Finance Tab */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">Financial Performance Analysis</h3>
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Profitability</h4>
                <p className="text-gray-300">Shows positive trends. Revenue has grown at an average of 5.2% annually over the past 3 years.</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">Profitability chart will be displayed here</p>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Financial Health</h4>
                <p className="text-gray-300">Debt ratio is below industry average, maintaining a stable financial foundation.</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">Financial metrics will be displayed here</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Positioning Tab */}
          {activeTab === 'positioning' && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">Market Positioning</h3>
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Competitive Analysis</h4>
                <p className="text-gray-300">Holds approximately 15% market share within the industry, ranking among the top 3 companies.</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">Competitive comparison chart will be displayed here</p>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Differentiation Factors</h4>
                <p className="text-gray-300">Aggressive investment in technological innovation and high customer satisfaction are key strengths.</p>
              </div>
            </div>
          )}
          
          {/* Future Potential Tab */}
          {activeTab === 'future' && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">Future Prospects Assessment</h3>
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Growth Forecast</h4>
                <p className="text-gray-300">Expected to achieve an average annual growth of 7% over the next 5 years through expansion into new business areas.</p>
                <div className="h-32 bg-gray-600/50 rounded mt-3 flex items-center justify-center">
                  <p className="text-gray-400">Future forecast chart will be displayed here</p>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Risk Assessment</h4>
                <p className="text-gray-300">High resilience to market fluctuations with an established sustainable business model.</p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <h4 className="text-lg font-medium text-blue-400 mb-2">Investment Recommendation</h4>
                <p className="text-gray-200">
                  Suitable for long-term investment. Considering the stable financial foundation and future prospects, it's worth including in your portfolio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 