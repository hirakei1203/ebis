// /app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundParticles from '@/components/ui/BackgroundParticles';

export default function Home() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Dummy company data
  const dummyCompanies = [
    'Toyota Motor Corporation',
    'Sony Group Corporation',
    'SoftBank Group Corp.',
    'Nintendo Co., Ltd.',
    'Panasonic Holdings Corporation',
    'Mitsubishi UFJ Financial Group',
    'Fast Retailing Co., Ltd.',
    'Tokyo Marine Holdings',
    'Hitachi, Ltd.',
    'Keyence Corporation'
  ];

  useEffect(() => {
    if (companyName.length > 0) {
      const filteredSuggestions = dummyCompanies.filter(
        company => company.toLowerCase().includes(companyName.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [companyName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search process (to be implemented later)
    setShowSuggestions(false);
    
    // Navigate to analysis result page with company name
    if (companyName.trim()) {
      router.push(`/analysis/result?company=${encodeURIComponent(companyName)}`);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setCompanyName(suggestion);
    setShowSuggestions(false);
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
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/80 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Toyota Motor Corporation"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Start AI Analysis
            </button>
          </form>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 text-gray-300 text-sm space-y-2">
          <p>Enter a company name to search, and AI will comprehensively analyze:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Financial Performance</li>
            <li>Industry Position</li>
            <li>Future Prospects</li>
            <li>Business Model</li>
          </ul>
          <p>and provide a comprehensive analysis.</p>
        </div>
      </div>
    </>
  );
}
