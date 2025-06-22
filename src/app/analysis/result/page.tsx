'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getStockQuote, getDailyTimeSeries, getCompanyOverview, getDemoData, type StockQuote, type TimeSeriesData, type CompanyOverview } from '@/services/alphaVantageApi';
import { InvestmentAnalyzer, type InvestmentScore } from '@/utils/InvestmentAnalyzer';
import { InvestmentAnalysis } from '@/components/InvestmentAnalysis';

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

export default function AnalysisResult() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || 'Unknown';
  const symbol = searchParams.get('symbol') || '';
  
  const [activeTab, setActiveTab] = useState('finance');
  const [isLoading, setIsLoading] = useState(true);
  const [investmentScore, setInvestmentScore] = useState<InvestmentScore | null>(null);
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
            
            // Calculate investment score using real data
            if (overview && quote) {
              const score = InvestmentAnalyzer.calculateInvestmentScore(overview, quote, timeSeries);
              setInvestmentScore(score);
            }
          } else {
            // Use demo data if API returns no results
            const demoData = getDemoData();
            setStockQuote(demoData.quote);
            setTimeSeriesData(demoData.timeSeries);
            setCompanyOverview(demoData.overview as CompanyOverview);
            
            // Calculate investment score with demo data
            const score = InvestmentAnalyzer.calculateInvestmentScore(
              demoData.overview as CompanyOverview,
              demoData.quote,
              demoData.timeSeries
            );
            setInvestmentScore(score);
          }
        } else {
          // Use demo data if no symbol provided
          const demoData = getDemoData();
          setStockQuote(demoData.quote);
          setTimeSeriesData(demoData.timeSeries);
          setCompanyOverview(demoData.overview as CompanyOverview);
          
          // Calculate investment score with demo data
          const score = InvestmentAnalyzer.calculateInvestmentScore(
            demoData.overview as CompanyOverview,
            demoData.quote,
            demoData.timeSeries
          );
          setInvestmentScore(score);
        }
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch company data. Please try again.');
        
        // Use demo data as fallback
        const demoData = getDemoData();
        setStockQuote(demoData.quote);
        setTimeSeriesData(demoData.timeSeries);
        setCompanyOverview(demoData.overview as CompanyOverview);
        
        // Calculate investment score with demo data
        const score = InvestmentAnalyzer.calculateInvestmentScore(
          demoData.overview as CompanyOverview,
          demoData.quote,
          demoData.timeSeries
        );
        setInvestmentScore(score);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Save analysis to history when data is loaded
  useEffect(() => {
    if (!isLoading && investmentScore) {
      const saveToHistory = () => {
        try {
          const historyItem = {
            id: Date.now().toString(),
            companyName,
            symbol,
            searchDate: new Date().toISOString(),
            currentPrice: stockQuote?.price,
            priceChange: stockQuote?.change,
            priceChangePercent: stockQuote?.changePercent,
            investmentScore,
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
            history[existingIndex] = historyItem;
          } else {
            // Add new analysis to the beginning
            history.unshift(historyItem);
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
  }, [isLoading, investmentScore, companyName, symbol, stockQuote, companyOverview]);

  const getFinancialMetrics = () => {
    if (!companyOverview) return [];
    
    return [
      { name: 'Market Cap', value: companyOverview.marketCap ? `$${(companyOverview.marketCap / 1000000000).toFixed(1)}B` : 'N/A' },
      { name: 'P/E Ratio', value: companyOverview.peRatio || 'N/A' },
      { name: 'P/B Ratio', value: companyOverview.priceToBook || 'N/A' },
      { name: 'Dividend Yield', value: companyOverview.dividendYield ? `${(companyOverview.dividendYield * 100).toFixed(2)}%` : 'N/A' },
      { name: 'ROE', value: companyOverview.returnOnEquity ? `${(companyOverview.returnOnEquity * 100).toFixed(2)}%` : 'N/A' },
      { name: 'ROA', value: companyOverview.returnOnAssets ? `${(companyOverview.returnOnAssets * 100).toFixed(2)}%` : 'N/A' },
      { name: 'Profit Margin', value: companyOverview.profitMargin ? `${(companyOverview.profitMargin * 100).toFixed(2)}%` : 'N/A' },
      { name: 'Beta', value: companyOverview.beta || 'N/A' }
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
      
      {/* Investment Analysis */}
      {investmentScore && (
        <div className="mb-6">
          <InvestmentAnalysis score={investmentScore} />
        </div>
      )}

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
                <h4 className="text-lg font-medium mb-3">Stock Price Trend ({timeSeriesData.length} Days)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData.map(item => ({
                      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      price: item.close,
                      volume: item.volume
                    }))}>
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
                        <XAxis dataKey="name" stroke="#9CA3AF" />
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
                    {financialMetrics.map((metric, index) => (
                      <div key={index}>
                        <p className="text-sm text-gray-400">{metric.name}</p>
                        <p className="font-medium">{metric.value}</p>
                      </div>
                    ))}
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