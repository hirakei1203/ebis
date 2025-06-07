// /app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundParticles from '@/components/ui/BackgroundParticles';
import { searchCompanies } from '@/services/alphaVantageApi';

interface SearchHistory {
  id: string;
  companyName: string;
  symbol?: string;
  timestamp: Date;
}

interface CompanySuggestion {
  symbol: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Dummy company data (fallback)
  const dummyCompanies = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'IBM', name: 'International Business Machines Corporation' },
    { symbol: 'ORCL', name: 'Oracle Corporation' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: '7203.T', name: 'Toyota Motor Corporation' },
    { symbol: '6758.T', name: 'Sony Group Corporation' },
    { symbol: '9984.T', name: 'SoftBank Group Corp.' },
    { symbol: '7974.T', name: 'Nintendo Co., Ltd.' },
    { symbol: '6752.T', name: 'Panasonic Holdings Corporation' }
  ];

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('companySearchHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setSearchHistory(parsedHistory);
    }
  }, []);

  // Search for companies using Alpha Vantage API
  useEffect(() => {
    const searchWithAPI = async () => {
      if (companyName.length > 2) {
        setIsSearching(true);
        try {
          // Try API search first
          const apiResults = await searchCompanies(companyName);
          
          if (apiResults.length > 0) {
            setSuggestions(apiResults);
          } else {
            // Fallback to dummy data if API fails or returns no results
            const filteredSuggestions = dummyCompanies.filter(
              company => 
                company.name.toLowerCase().includes(companyName.toLowerCase()) ||
                company.symbol.toLowerCase().includes(companyName.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
          }
          
          setShowSuggestions(true);
          setShowHistory(false);
        } catch (error) {
          console.error('Search error:', error);
          // Fallback to dummy data on error
          const filteredSuggestions = dummyCompanies.filter(
            company => 
              company.name.toLowerCase().includes(companyName.toLowerCase()) ||
              company.symbol.toLowerCase().includes(companyName.toLowerCase())
          );
          setSuggestions(filteredSuggestions);
          setShowSuggestions(true);
          setShowHistory(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchWithAPI, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [companyName]);

  const saveToHistory = (company: string, symbol?: string) => {
    const newHistoryItem: SearchHistory = {
      id: Date.now().toString(),
      companyName: company,
      symbol: symbol,
      timestamp: new Date()
    };
    
    const updatedHistory = [newHistoryItem, ...searchHistory.filter(item => item.companyName !== company)].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('companySearchHistory', JSON.stringify(updatedHistory));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    setShowHistory(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to find symbol from suggestions
      const selectedSuggestion = suggestions.find(s => 
        s.name.toLowerCase() === companyName.toLowerCase() ||
        s.symbol.toLowerCase() === companyName.toLowerCase()
      );
      
      // Save to search history
      saveToHistory(companyName.trim(), selectedSuggestion?.symbol);
      
      // Navigate to analysis result page with company name and symbol
      const queryParams = new URLSearchParams({
        company: companyName.trim(),
        ...(selectedSuggestion?.symbol && { symbol: selectedSuggestion.symbol })
      });
      
      router.push(`/analysis/result?${queryParams.toString()}`);
    } catch (error) {
      console.error('Search failed:', error);
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: CompanySuggestion) => {
    setCompanyName(suggestion.name);
    setSuggestions([suggestion]); // Keep the selected suggestion for symbol reference
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleInputFocus = () => {
    if (companyName.length === 0 && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setShowHistory(false);
    }, 200);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('companySearchHistory');
    setShowHistory(false);
  };

  return (
    <>
      <BackgroundParticles />
      
      <div className="relative max-w-3xl mx-auto z-10">
        <h1 className="text-3xl font-bold mb-8">Company Analysis</h1>
        
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2 relative">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                Company Name or Symbol
              </label>
              <div className="relative">
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-gray-700/80 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ex: Apple Inc. or AAPL"
                />
                {(isLoading || isSearching) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 last:border-b-0"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div>
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-sm text-gray-400">{suggestion.symbol}</div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Search history dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="px-4 py-2 bg-gray-600 text-gray-300 text-sm font-medium flex justify-between items-center">
                    <span>Recent Searches</span>
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-gray-200"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 last:border-b-0"
                      onClick={() => setCompanyName(item.companyName)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <span>{item.companyName}</span>
                            {item.symbol && <span className="text-sm text-gray-400 ml-2">({item.symbol})</span>}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {item.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !companyName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                'Start AI Analysis'
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 text-gray-300 text-sm space-y-2">
          <p>Enter a company name or stock symbol to search, and AI will comprehensively analyze:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Real-time Stock Performance</li>
            <li>Financial Health & Metrics</li>
            <li>Market Position & Competition</li>
            <li>Future Growth Prospects</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            * Powered by Alpha Vantage API for real-time financial data
          </p>
        </div>
      </div>
    </>
  );
}
