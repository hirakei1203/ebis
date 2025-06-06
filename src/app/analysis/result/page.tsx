'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const stockPriceData = [
  { month: 'Jan', price: 150, volume: 2400000 },
  { month: 'Feb', price: 165, volume: 2100000 },
  { month: 'Mar', price: 142, volume: 2800000 },
  { month: 'Apr', price: 178, volume: 2200000 },
  { month: 'May', price: 185, volume: 1900000 },
  { month: 'Jun', price: 192, volume: 2300000 },
  { month: 'Jul', price: 188, volume: 2100000 },
  { month: 'Aug', price: 205, volume: 2500000 },
  { month: 'Sep', price: 198, volume: 2200000 },
  { month: 'Oct', price: 215, volume: 2600000 },
  { month: 'Nov', price: 225, volume: 2400000 },
  { month: 'Dec', price: 238, volume: 2700000 }
];

const financialMetrics = [
  { metric: 'Revenue', value: 85, benchmark: 75 },
  { metric: 'Profit Margin', value: 12, benchmark: 8 },
  { metric: 'ROE', value: 15, benchmark: 12 },
  { metric: 'Debt Ratio', value: 35, benchmark: 45 },
  { metric: 'Current Ratio', value: 2.1, benchmark: 1.5 }
];

const marketShareData = [
  { name: 'Target Company', value: 15, color: '#3B82F6' },
  { name: 'Competitor A', value: 22, color: '#EF4444' },
  { name: 'Competitor B', value: 18, color: '#10B981' },
  { name: 'Competitor C', value: 12, color: '#F59E0B' },
  { name: 'Others', value: 33, color: '#6B7280' }
];

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
  const [activeTab, setActiveTab] = useState('finance');
  const [isLoading, setIsLoading] = useState(true);
  const [investmentScores, setInvestmentScores] = useState<InvestmentScore[]>([]);

  useEffect(() => {
    // Simulate API call to get investment scores
    const simulateAnalysis = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const scores: InvestmentScore[] = [
        { category: 'Financial Health', score: 8.5, maxScore: 10, description: 'Strong balance sheet with low debt' },
        { category: 'Growth Potential', score: 7.2, maxScore: 10, description: 'Moderate growth expected in core markets' },
        { category: 'Market Position', score: 8.8, maxScore: 10, description: 'Leading position in key segments' },
        { category: 'Risk Assessment', score: 7.5, maxScore: 10, description: 'Well-diversified business model' },
        { category: 'Valuation', score: 6.8, maxScore: 10, description: 'Fairly valued with some upside potential' }
      ];
      
      setInvestmentScores(scores);
      setIsLoading(false);
    };

    simulateAnalysis();
  }, [companyName]);

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Analyzing {companyName}...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = calculateOverallScore();
  const recommendation = getRecommendation(overallScore);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{companyName} Analysis Results</h1>
      
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
                <h4 className="text-lg font-medium mb-3">Stock Price Trend (12 Months)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stockPriceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
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
                <p className="text-gray-300 mt-3">Stock price has shown a positive trend with 58% growth over the past year.</p>
              </div>
              
              {/* Financial Metrics */}
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
                <p className="text-gray-300 mt-3">Company outperforms industry benchmarks in most key financial metrics.</p>
              </div>
            </div>
          )}
          
          {/* Positioning Tab */}
          {activeTab === 'positioning' && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium mb-4">Market Positioning</h3>
              
              {/* Market Share */}
              <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Market Share Distribution</h4>
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
                <p className="text-gray-300 mt-3">Holds 15% market share, ranking 3rd in the industry with strong competitive position.</p>
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
                <h4 className="text-lg font-medium mb-3">5-Year Growth Forecast</h4>
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
                <p className="text-gray-300 mt-3">Projected CAGR of 7% for revenue and 12% for profit over the next 5 years.</p>
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