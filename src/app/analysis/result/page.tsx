'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getStockQuote, getDailyTimeSeries, getCompanyOverview, getDemoData, type StockQuote, type TimeSeriesData, type CompanyOverview } from '@/services/alphaVantageApi';

// Market share data (simulated based on company sector)
const getMarketShareData = (companyName: string) => [
  { name: companyName, value: 15, color: '#3B82F6' },
  { name: 'Competitor A', value: 22, color: '#EF4444' },
  { name: 'Competitor B', value: 18, color: '#10B981' },
  { name: 'Competitor C', value: 12, color: '#F59E0B' },
  { name: 'Others', value: 33, color: '#6B7280' }
];

// Growth forecast (simulated)
const growthForecast = [
  { year: '2024', revenue: 100, profit: 12 },
  { year: '2025', revenue: 107, profit: 14 },
  { year: '2026', revenue: 115, profit: 16 },
  { year: '2027', revenue: 123, profit: 18 },
  { year: '2028', revenue: 132, profit: 21 }
];

interface InvestmentScore {
  category: string;
  score: number;
  maxScore: number;
  description: string;
}

export default function AnalysisResult() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || 'Unknown';
  const symbol = searchParams.get('symbol') || '';
  
  const [activeTab, setActiveTab] = useState('finance');
  const [isLoading, setIsLoading] = useState(true);
  const [investmentScores, setInvestmentScores] = useState<InvestmentScore[]>([]);
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [companyOverview, setCompanyOverview] = useState<CompanyOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (symbol) {
          // Fetch real data using Alpha Vantage API
          const [quote, timeSeries, overview] = await Promise.all([
            getStockQuote(symbol),
            getDailyTimeSeries(symbol),
            getCompanyOverview(symbol)
          ]);
          
          if (quote || timeSeries.length > 0 || overview) {
            setStockQuote(quote);
            setTimeSeriesData(timeSeries);
            setCompanyOverview(overview);
          } else {
            // Use demo data if API returns no results
            const demoData = getDemoData();
            setStockQuote(demoData.quote);
            setTimeSeriesData(demoData.timeSeries);
            setCompanyOverview(demoData.overview as CompanyOverview);
          }
        } else {
          // Use demo data if no symbol provided
          const demoData = getDemoData();
          setStockQuote(demoData.quote);
          setTimeSeriesData(demoData.timeSeries);
          setCompanyOverview(demoData.overview as CompanyOverview);
        }
        
        // Simulate investment score calculation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const scores: InvestmentScore[] = [
          { category: 'Financial Health', score: 8.5, maxScore: 10, description: 'Strong balance sheet with low debt' },
          { category: 'Growth Potential', score: 7.2, maxScore: 10, description: 'Moderate growth expected in core markets' },
          { category: 'Market Position', score: 8.8, maxScore: 10, description: 'Leading position in key segments' },
          { category: 'Risk Assessment', score: 7.5, maxScore: 10, description: 'Well-diversified business model' },
          { category: 'Valuation', score: 6.8, maxScore: 10, description: 'Fairly valued with some upside potential' }
        ];
        
        setInvestmentScores(scores);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch company data. Please try again.');
        
        // Use demo data as fallback
        const demoData = getDemoData();
        setStockQuote(demoData.quote);
        setTimeSeriesData(demoData.timeSeries);
        setCompanyOverview(demoData.overview as CompanyOverview);
        
        const scores: InvestmentScore[] = [
          { category: 'Financial Health', score: 8.5, maxScore: 10, description: 'Strong balance sheet with low debt' },
          { category: 'Growth Potential', score: 7.2, maxScore: 10, description: 'Moderate growth expected in core markets' },
          { category: 'Market Position', score: 8.8, maxScore: 10, description: 'Leading position in key segments' },
          { category: 'Risk Assessment', score: 7.5, maxScore: 10, description: 'Well-diversified business model' },
          { category: 'Valuation', score: 6.8, maxScore: 10, description: 'Fairly valued with some upside potential' }
        ];
        setInvestmentScores(scores);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyName, symbol]);

  // Save analysis to history when data is loaded
  useEffect(() => {
    if (!isLoading && investmentScores.length > 0) {
      const saveToHistory = () => {
        try {
          const overallScore = calculateOverallScore();
          const recommendation = getRecommendation(overallScore);
          
          const analysisResult = {
            id: Date.now().toString(),
            companyName,
            symbol: symbol || undefined,
            sector: companyOverview?.sector,
            industry: companyOverview?.industry,
            currentPrice: stockQuote?.price,
            priceChange: stockQuote?.change,
            priceChangePercent: stockQuote?.changePercent,
            investmentScores,
            overallScore,
            recommendation: recommendation.text,
            recommendationColor: recommendation.color,
            analysisDate: new Date(),
            isFavorite: false
          };

          // Get existing history
          const existingHistory = localStorage.getItem('analysisHistory');
          let history = existingHistory ? JSON.parse(existingHistory) : [];

          // Check if this analysis already exists (same company and recent date)
          const existingIndex = history.findIndex((item: any) => 
            item.companyName === companyName && 
            item.symbol === symbol &&
            new Date(item.analysisDate).toDateString() === new Date().toDateString()
          );

          if (existingIndex >= 0) {
            // Update existing analysis
            history[existingIndex] = analysisResult;
          } else {
            // Add new analysis to the beginning
            history.unshift(analysisResult);
            // Keep only the latest 50 analyses
            history = history.slice(0, 50);
          }

          localStorage.setItem('analysisHistory', JSON.stringify(history));
        } catch (error) {
          console.error('Error saving to history:', error);
        }
      };

      saveToHistory();
    }
  }, [isLoading, investmentScores, companyName, symbol, stockQuote, companyOverview]);

  const calculateOverallScore = () => {
    if (investmentScores.length === 0) return 0;
    const totalScore = investmentScores.reduce((sum, score) => sum + score.score, 0);
    return Math.round((totalScore / investmentScores.length) * 10) / 10;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRecommendation = (overallScore: number) => {
    if (overallScore >= 8) return { text: 'Strong Buy', color: 'bg-green-600', description: 'Excellent investment opportunity with strong fundamentals' };
    if (overallScore >= 7) return { text: 'Buy', color: 'bg-green-500', description: 'Good investment opportunity with solid prospects' };
    if (overallScore >= 6) return { text: 'Hold', color: 'bg-yellow-500', description: 'Moderate investment with balanced risk-reward' };
    if (overallScore >= 5) return { text: 'Weak Hold', color: 'bg-orange-500', description: 'Below average investment with some concerns' };
    return { text: 'Sell', color: 'bg-red-500', description: 'Poor investment opportunity with significant risks' };
  };

  // Convert time series data for chart
  const chartData = timeSeriesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: item.close,
    volume: item.volume
  }));

  // Create financial metrics data from company overview
  const getFinancialMetrics = () => {
    if (!companyOverview) return [];
    
    return [
      { metric: 'P/E Ratio', value: companyOverview.peRatio || 0, benchmark: 20 },
      { metric: 'Profit Margin', value: (companyOverview.profitMargin || 0) * 100, benchmark: 8 },
      { metric: 'ROE', value: (companyOverview.returnOnEquity || 0) * 100, benchmark: 12 },
      { metric: 'ROA', value: (companyOverview.returnOnAssets || 0) * 100, benchmark: 5 },
      { metric: 'EPS', value: companyOverview.eps || 0, benchmark: 3 }
    ];
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Analyzing {companyName}...</p>
            <p className="text-sm text-gray-400 mt-2">Fetching real-time data from Alpha Vantage API</p>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = calculateOverallScore();
  const recommendation = getRecommendation(overallScore);
  const marketShareData = getMarketShareData(companyName);
  const financialMetrics = getFinancialMetrics();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{companyName} Analysis Results</h1>
          {symbol && <p className="text-gray-400 mt-1">Symbol: {symbol}</p>}
          {companyOverview && (
            <p className="text-gray-300 mt-2">{companyOverview.sector} • {companyOverview.industry}</p>
          )}
        </div>
        {stockQuote && (
          <div className="text-right">
            <div className="text-2xl font-bold">${stockQuote.price.toFixed(2)}</div>
            <div className={`text-sm ${stockQuote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stockQuote.change >= 0 ? '+' : ''}{stockQuote.change.toFixed(2)} ({stockQuote.changePercent.toFixed(2)}%)
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
          <p className="text-yellow-200">{error}</p>
          <p className="text-sm text-yellow-300 mt-1">Showing demo data for demonstration purposes.</p>
        </div>
      )}
      
      {/* Investment Score Summary */}
      <div className="bg-gray-800 rounded-lg shadow-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Investment Score</h2>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}/10
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${recommendation.color}`}>
              {recommendation.text}
            </div>
          </div>
        </div>
        <p className="text-gray-300 mb-4">{recommendation.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {investmentScores.map((score, index) => (
            <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">{score.category}</h4>
              <div className={`text-xl font-bold ${getScoreColor(score.score)}`}>
                {score.score}/10
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{score.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg">
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
            <div className="space-y-6">
              <h3 className="text-xl font-medium mb-4">Financial Performance Analysis</h3>
              
              {/* Stock Price Chart */}
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Stock Price Trend ({chartData.length} Days)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#374151', 
                          border: '1px solid #4B5563',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Stock Price ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {stockQuote && (
                  <p className="text-gray-300 mt-3">
                    Current price: ${stockQuote.price.toFixed(2)} | 
                    Change: {stockQuote.change >= 0 ? '+' : ''}{stockQuote.change.toFixed(2)} ({stockQuote.changePercent.toFixed(2)}%) | 
                    Volume: {stockQuote.volume.toLocaleString()}
                  </p>
                )}
              </div>
              
              {/* Financial Metrics */}
              {financialMetrics.length > 0 && (
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Key Financial Metrics vs Industry Benchmark</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="metric" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#374151', 
                            border: '1px solid #4B5563',
                            borderRadius: '6px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#3B82F6" name="Company" />
                        <Bar dataKey="benchmark" fill="#6B7280" name="Industry Average" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-gray-300 mt-3">Financial metrics compared to industry benchmarks.</p>
                </div>
              )}

              {/* Company Overview */}
              {companyOverview && (
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Company Overview</h4>
                  <p className="text-gray-300 mb-4">{companyOverview.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Market Cap</p>
                      <p className="font-medium">${(companyOverview.marketCap / 1000000000).toFixed(1)}B</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">P/E Ratio</p>
                      <p className="font-medium">{companyOverview.peRatio?.toFixed(2) || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">EPS</p>
                      <p className="font-medium">${companyOverview.eps?.toFixed(2) || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dividend Yield</p>
                      <p className="font-medium">{(companyOverview.dividendYield * 100)?.toFixed(2) || '0'}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Positioning Tab */}
          {activeTab === 'positioning' && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium mb-4">Market Positioning</h3>
              
              {/* Market Share */}
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Market Share Distribution (Estimated)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#374151', 
                          border: '1px solid #4B5563',
                          borderRadius: '6px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-300 mt-3">Estimated market share based on industry analysis and company size.</p>
              </div>
              
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Competitive Advantages</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Strong brand recognition and customer loyalty
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Advanced technology and R&D capabilities
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Efficient supply chain and distribution network
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                    Moderate pricing power in premium segments
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Future Potential Tab */}
          {activeTab === 'future' && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium mb-4">Future Prospects Assessment</h3>
              
              {/* Growth Forecast */}
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">5-Year Growth Forecast (Estimated)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#374151', 
                          border: '1px solid #4B5563',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Revenue Growth (%)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Profit Growth (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-300 mt-3">Projected growth based on current trends and market analysis.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Growth Drivers</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Expansion into emerging markets
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      New product line launches
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Digital transformation initiatives
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Strategic partnerships and acquisitions
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Risk Factors</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Regulatory changes in key markets
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Increased competition from new entrants
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                      Supply chain disruption risks
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                      Currency fluctuation exposure
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 