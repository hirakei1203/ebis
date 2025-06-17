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
  beta: number;
  debtToEquity: number;
  currentRatio: number;
  priceToBook: number;
  priceToSales: number;
}

export interface CompanyFinancials {
  sales_growth_rate?: number;
  operating_profit_margin?: number;
  equity_ratio?: number;
  current_ratio?: number;
  operating_profit_growth_rate?: number;
  employee_growth_rate?: number;
  debt_ratio?: number;
  market_cap?: number;
  per?: number;
  pbr?: number;
  dividend_yield?: number;
}

export interface Company {
  overview: CompanyOverview;
  financials?: CompanyFinancials;
} 