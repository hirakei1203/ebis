// Alpha Vantage API Service
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';

const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CompanyOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  bookValue: number;
  dividendYield: number;
  eps: number;
  revenuePerShare: number;
  profitMargin: number;
  operatingMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  revenue: number;
  grossProfit: number;
  dilutedEPS: number;
  quarterlyEarningsGrowth: number;
  quarterlyRevenueGrowth: number;
  analystTargetPrice: number;
  trailingPE: number;
  forwardPE: number;
  priceToSales: number;
  priceToBook: number;
  evToRevenue: number;
  evToEbitda: number;
  beta: number;
  week52High: number;
  week52Low: number;
  day50MovingAverage: number;
  day200MovingAverage: number;
  sharesOutstanding: number;
  sharesFloat: number;
  sharesShort: number;
  sharesShortPriorMonth: number;
  shortRatio: number;
  shortPercentOutstanding: number;
  shortPercentFloat: number;
  percentInsiders: number;
  percentInstitutions: number;
  forwardAnnualDividendRate: number;
  forwardAnnualDividendYield: number;
  payoutRatio: number;
  dividendDate: string;
  exDividendDate: string;
  lastSplitFactor: string;
  lastSplitDate: string;
}

// Get stock quote data
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check error response
    if (data['Error Message'] || data['Note']) {
      console.error('API Error:', data['Error Message'] || data['Note']);
      return null;
    }
    
    const quote = data['Global Quote'];
    if (!quote) {
      console.error('No quote data found');
      return null;
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume'])
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

// Get time series data (daily)
export async function getDailyTimeSeries(symbol: string): Promise<TimeSeriesData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check error response
    if (data['Error Message'] || data['Note']) {
      console.error('API Error:', data['Error Message'] || data['Note']);
      return [];
    }
    
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      console.error('No time series data found');
      return [];
    }
    
    // Convert data to array and sort by date
    const timeSeriesArray: TimeSeriesData[] = Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Get latest 30 days of data
    
    return timeSeriesArray;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return [];
  }
}

// Get company overview
export async function getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check error response
    if (data['Error Message'] || data['Note']) {
      console.error('API Error:', data['Error Message'] || data['Note']);
      return null;
    }
    
    // If data is empty
    if (!data.Symbol) {
      console.error('No company overview data found');
      return null;
    }
    
    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description,
      sector: data.Sector,
      industry: data.Industry,
      marketCap: parseInt(data.MarketCapitalization) || 0,
      peRatio: parseFloat(data.PERatio) || 0,
      pegRatio: parseFloat(data.PEGRatio) || 0,
      bookValue: parseFloat(data.BookValue) || 0,
      dividendYield: parseFloat(data.DividendYield) || 0,
      eps: parseFloat(data.EPS) || 0,
      revenuePerShare: parseFloat(data.RevenuePerShareTTM) || 0,
      profitMargin: parseFloat(data.ProfitMargin) || 0,
      operatingMargin: parseFloat(data.OperatingMarginTTM) || 0,
      returnOnAssets: parseFloat(data.ReturnOnAssetsTTM) || 0,
      returnOnEquity: parseFloat(data.ReturnOnEquityTTM) || 0,
      revenue: parseInt(data.RevenueTTM) || 0,
      grossProfit: parseInt(data.GrossProfitTTM) || 0,
      dilutedEPS: parseFloat(data.DilutedEPSTTM) || 0,
      quarterlyEarningsGrowth: parseFloat(data.QuarterlyEarningsGrowthYOY) || 0,
      quarterlyRevenueGrowth: parseFloat(data.QuarterlyRevenueGrowthYOY) || 0,
      analystTargetPrice: parseFloat(data.AnalystTargetPrice) || 0,
      trailingPE: parseFloat(data.TrailingPE) || 0,
      forwardPE: parseFloat(data.ForwardPE) || 0,
      priceToSales: parseFloat(data.PriceToSalesRatioTTM) || 0,
      priceToBook: parseFloat(data.PriceToBookRatio) || 0,
      evToRevenue: parseFloat(data.EVToRevenue) || 0,
      evToEbitda: parseFloat(data.EVToEBITDA) || 0,
      beta: parseFloat(data.Beta) || 0,
      week52High: parseFloat(data['52WeekHigh']) || 0,
      week52Low: parseFloat(data['52WeekLow']) || 0,
      day50MovingAverage: parseFloat(data['50DayMovingAverage']) || 0,
      day200MovingAverage: parseFloat(data['200DayMovingAverage']) || 0,
      sharesOutstanding: parseInt(data.SharesOutstanding) || 0,
      sharesFloat: parseInt(data.SharesFloat) || 0,
      sharesShort: parseInt(data.SharesShort) || 0,
      sharesShortPriorMonth: parseInt(data.SharesShortPriorMonth) || 0,
      shortRatio: parseFloat(data.ShortRatio) || 0,
      shortPercentOutstanding: parseFloat(data.ShortPercentOutstanding) || 0,
      shortPercentFloat: parseFloat(data.ShortPercentFloat) || 0,
      percentInsiders: parseFloat(data.PercentInsiders) || 0,
      percentInstitutions: parseFloat(data.PercentInstitutions) || 0,
      forwardAnnualDividendRate: parseFloat(data.ForwardAnnualDividendRate) || 0,
      forwardAnnualDividendYield: parseFloat(data.ForwardAnnualDividendYield) || 0,
      payoutRatio: parseFloat(data.PayoutRatio) || 0,
      dividendDate: data.DividendDate || '',
      exDividendDate: data.ExDividendDate || '',
      lastSplitFactor: data.LastSplitFactor || '',
      lastSplitDate: data.LastSplitDate || ''
    };
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
}

// Company search (symbol search)
export async function searchCompanies(keywords: string): Promise<Array<{symbol: string, name: string}>> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check error response
    if (data['Error Message'] || data['Note']) {
      console.error('API Error:', data['Error Message'] || data['Note']);
      return [];
    }
    
    const matches = data['bestMatches'];
    if (!matches || !Array.isArray(matches)) {
      return [];
    }
    
    return matches.slice(0, 10).map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name']
    }));
  } catch (error) {
    console.error('Error searching companies:', error);
    return [];
  }
}

// Demo data (for API key 'demo' limitation handling)
export function getDemoData() {
  return {
    quote: {
      symbol: 'IBM',
      price: 139.70,
      change: 0.42,
      changePercent: 0.30,
      volume: 3542000
    },
    timeSeries: [
      { date: '2024-01-01', open: 135.0, high: 140.0, low: 134.0, close: 139.0, volume: 2500000 },
      { date: '2024-01-02', open: 139.0, high: 142.0, low: 138.0, close: 141.0, volume: 2800000 },
      { date: '2024-01-03', open: 141.0, high: 143.0, low: 139.0, close: 140.0, volume: 2200000 },
      { date: '2024-01-04', open: 140.0, high: 141.0, low: 137.0, close: 139.7, volume: 3542000 }
    ],
    overview: {
      symbol: 'IBM',
      name: 'International Business Machines Corporation',
      description: 'International Business Machines Corporation provides integrated solutions and services worldwide.',
      sector: 'Technology',
      industry: 'Information Technology Services',
      marketCap: 128000000000,
      peRatio: 22.5,
      eps: 6.20,
      profitMargin: 0.089,
      returnOnEquity: 0.125
    }
  };
} 