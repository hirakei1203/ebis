'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InvestmentScore {
  category: string;
  score: number;
  maxScore: number;
  description: string;
}

interface AnalysisResult {
  id: string;
  companyName: string;
  symbol?: string;
  sector?: string;
  industry?: string;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
  investmentScores: InvestmentScore[];
  overallScore: number;
  recommendation: string;
  recommendationColor: string;
  analysisDate: Date;
  isFavorite: boolean;
}

export default function History() {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AnalysisResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'buy' | 'hold' | 'sell'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load analysis history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('analysisHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
            ...item,
            analysisDate: new Date(item.analysisDate)
          }));
          setAnalysisHistory(parsedHistory);
        } else {
          // Create some sample data for demonstration
          const sampleData: AnalysisResult[] = [
            {
              id: '1',
              companyName: 'Apple Inc.',
              symbol: 'AAPL',
              sector: 'Technology',
              industry: 'Consumer Electronics',
              currentPrice: 175.43,
              priceChange: 2.15,
              priceChangePercent: 1.24,
              investmentScores: [
                { category: 'Financial Health', score: 9.2, maxScore: 10, description: 'Excellent balance sheet' },
                { category: 'Growth Potential', score: 8.5, maxScore: 10, description: 'Strong innovation pipeline' },
                { category: 'Market Position', score: 9.5, maxScore: 10, description: 'Market leader' },
                { category: 'Risk Assessment', score: 7.8, maxScore: 10, description: 'Low risk profile' },
                { category: 'Valuation', score: 7.2, maxScore: 10, description: 'Fairly valued' }
              ],
              overallScore: 8.4,
              recommendation: 'Buy',
              recommendationColor: 'bg-green-500',
              analysisDate: new Date('2024-01-15'),
              isFavorite: true
            },
            {
              id: '2',
              companyName: 'Tesla Inc.',
              symbol: 'TSLA',
              sector: 'Consumer Discretionary',
              industry: 'Electric Vehicles',
              currentPrice: 248.87,
              priceChange: -5.23,
              priceChangePercent: -2.06,
              investmentScores: [
                { category: 'Financial Health', score: 7.5, maxScore: 10, description: 'Improving fundamentals' },
                { category: 'Growth Potential', score: 9.1, maxScore: 10, description: 'High growth potential' },
                { category: 'Market Position', score: 8.7, maxScore: 10, description: 'EV market leader' },
                { category: 'Risk Assessment', score: 6.2, maxScore: 10, description: 'High volatility' },
                { category: 'Valuation', score: 6.8, maxScore: 10, description: 'Premium valuation' }
              ],
              overallScore: 7.7,
              recommendation: 'Buy',
              recommendationColor: 'bg-green-500',
              analysisDate: new Date('2024-01-14'),
              isFavorite: false
            },
            {
              id: '3',
              companyName: 'Microsoft Corporation',
              symbol: 'MSFT',
              sector: 'Technology',
              industry: 'Software',
              currentPrice: 384.52,
              priceChange: 1.87,
              priceChangePercent: 0.49,
              investmentScores: [
                { category: 'Financial Health', score: 9.0, maxScore: 10, description: 'Strong financials' },
                { category: 'Growth Potential', score: 8.2, maxScore: 10, description: 'Cloud growth driver' },
                { category: 'Market Position', score: 9.1, maxScore: 10, description: 'Dominant position' },
                { category: 'Risk Assessment', score: 8.5, maxScore: 10, description: 'Low risk' },
                { category: 'Valuation', score: 7.5, maxScore: 10, description: 'Reasonable valuation' }
              ],
              overallScore: 8.5,
              recommendation: 'Strong Buy',
              recommendationColor: 'bg-green-600',
              analysisDate: new Date('2024-01-13'),
              isFavorite: true
            }
          ];
          setAnalysisHistory(sampleData);
          localStorage.setItem('analysisHistory', JSON.stringify(sampleData));
        }
      } catch (error) {
        console.error('Error loading analysis history:', error);
        setAnalysisHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Filter and sort history
  useEffect(() => {
    let filtered = [...analysisHistory];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'favorites':
        filtered = filtered.filter(item => item.isFavorite);
        break;
      case 'buy':
        filtered = filtered.filter(item => item.recommendation.includes('Buy'));
        break;
      case 'hold':
        filtered = filtered.filter(item => item.recommendation.includes('Hold'));
        break;
      case 'sell':
        filtered = filtered.filter(item => item.recommendation.includes('Sell'));
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.analysisDate.getTime() - a.analysisDate.getTime();
        case 'score':
          return b.overallScore - a.overallScore;
        case 'name':
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  }, [analysisHistory, searchTerm, sortBy, filterBy]);

  const toggleFavorite = (id: string) => {
    const updatedHistory = analysisHistory.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
  };

  const deleteAnalysis = (id: string) => {
    const updatedHistory = analysisHistory.filter(item => item.id !== id);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('analysisHistory');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Analysis History</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">{filteredHistory.length} of {analysisHistory.length} analyses</span>
          {analysisHistory.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Company name, symbol, or sector..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'name')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Analysis Date</option>
              <option value="score">Investment Score</option>
              <option value="name">Company Name</option>
            </select>
          </div>

          {/* Filter By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter By</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'favorites' | 'buy' | 'hold' | 'sell')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Analyses</option>
              <option value="favorites">Favorites</option>
              <option value="buy">Buy Recommendations</option>
              <option value="hold">Hold Recommendations</option>
              <option value="sell">Sell Recommendations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg text-gray-300 mb-2">
              {analysisHistory.length === 0 ? 'No analysis history available' : 'No analyses match your filters'}
            </p>
            <p className="text-gray-400">
              {analysisHistory.length === 0 ? (
                <>
                  <Link href="/" className="text-blue-400 hover:underline">
                    Start your first analysis
                  </Link>
                  {' '}to see results here.
                </>
              ) : (
                'Try adjusting your search or filter criteria.'
              )}
            </p>
          </div>
        ) : (
          filteredHistory.map((analysis) => (
            <div key={analysis.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold">{analysis.companyName}</h3>
                      {analysis.symbol && (
                        <span className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                          {analysis.symbol}
                        </span>
                      )}
                      <button
                        onClick={() => toggleFavorite(analysis.id)}
                        className={`p-1 rounded ${analysis.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                      >
                        <svg className="w-5 h-5" fill={analysis.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${analysis.recommendationColor}`}>
                        {analysis.recommendation}
                      </div>
                      <button
                        onClick={() => deleteAnalysis(analysis.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Sector</p>
                      <p className="font-medium">{analysis.sector || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Industry</p>
                      <p className="font-medium">{analysis.industry || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current Price</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">${analysis.currentPrice?.toFixed(2) || 'N/A'}</p>
                        {analysis.priceChange !== undefined && (
                          <span className={`text-sm ${analysis.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChange.toFixed(2)} ({analysis.priceChangePercent?.toFixed(2)}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Analysis Date</p>
                      <p className="font-medium">{analysis.analysisDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Investment Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Overall Investment Score</p>
                      <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(analysis.overallScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    {analysis.investmentScores.map((score, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-gray-400 mb-1">{score.category}</p>
                        <p className={`text-sm font-bold ${getScoreColor(score.score)}`}>
                          {score.score}/10
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/analysis/result?company=${encodeURIComponent(analysis.companyName)}${analysis.symbol ? `&symbol=${analysis.symbol}` : ''}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View Full Analysis →
                    </Link>
                    <button
                      onClick={() => {
                        // Re-analyze functionality could be added here
                        window.location.href = `/?company=${encodeURIComponent(analysis.companyName)}`;
                      }}
                      className="text-gray-400 hover:text-gray-300 text-sm"
                    >
                      Re-analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 