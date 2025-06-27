import { CompanyOverview, StockQuote, TimeSeriesData } from '@/services/alphaVantageApi';

export interface InvestmentScore {
  totalScore: number;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  scores: {
    financialHealth: number;
    growth: number;
    valuation: number;
    risk: number;
  };
  details: {
    strengths: string[];
    weaknesses: string[];
    keyMetrics: Record<string, number | string>;
  };
}

export class InvestmentAnalyzer {
  /**
   * 投資スコアを計算する
   */
  static calculateInvestmentScore(
    overview: CompanyOverview,
    quote: StockQuote,
    timeSeries: TimeSeriesData[]
  ): InvestmentScore {
    const financialHealth = this.calculateFinancialHealth(overview);
    const growth = this.calculateGrowth(overview);
    const valuation = this.calculateValuation(overview);
    const risk = this.calculateRisk(overview, timeSeries);

    // 総合スコア計算（各カテゴリーの重み付け）
    const totalScore = Math.round(
      financialHealth * 0.3 +  // 財務健全性 30%
      growth * 0.25 +          // 成長性 25%
      valuation * 0.25 +       // 割安性 25%
      risk * 0.2               // リスク 20%
    );

    const recommendation = this.getRecommendation(totalScore);
    const details = this.generateDetails(overview, quote, { financialHealth, growth, valuation, risk });

    return {
      totalScore,
      recommendation,
      scores: {
        financialHealth,
        growth,
        valuation,
        risk
      },
      details
    };
  }

  /**
   * 財務健全性スコア計算
   */
  private static calculateFinancialHealth(overview: CompanyOverview): number {
    let score = 0;
    let factors = 0;

    // 利益率
    if (overview.profitMargin > 0) {
      if (overview.profitMargin > 0.15) score += 25;
      else if (overview.profitMargin > 0.10) score += 20;
      else if (overview.profitMargin > 0.05) score += 15;
      else score += 10;
      factors++;
    }

    // 営業利益率
    if (overview.operatingMargin > 0) {
      if (overview.operatingMargin > 0.20) score += 25;
      else if (overview.operatingMargin > 0.15) score += 20;
      else if (overview.operatingMargin > 0.10) score += 15;
      else score += 10;
      factors++;
    }

    // ROE（自己資本利益率）
    if (overview.returnOnEquity > 0) {
      if (overview.returnOnEquity > 0.20) score += 25;
      else if (overview.returnOnEquity > 0.15) score += 20;
      else if (overview.returnOnEquity > 0.10) score += 15;
      else score += 10;
      factors++;
    }

    // ROA（総資産利益率）
    if (overview.returnOnAssets > 0) {
      if (overview.returnOnAssets > 0.10) score += 25;
      else if (overview.returnOnAssets > 0.05) score += 20;
      else if (overview.returnOnAssets > 0.03) score += 15;
      else score += 10;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 50;
  }

  /**
   * 成長性スコア計算
   */
  private static calculateGrowth(overview: CompanyOverview): number {
    let score = 0;
    let factors = 0;

    // 四半期売上成長率
    if (overview.quarterlyRevenueGrowth !== 0) {
      if (overview.quarterlyRevenueGrowth > 0.20) score += 30;
      else if (overview.quarterlyRevenueGrowth > 0.10) score += 25;
      else if (overview.quarterlyRevenueGrowth > 0.05) score += 20;
      else if (overview.quarterlyRevenueGrowth > 0) score += 15;
      else score += 5;
      factors++;
    }

    // 四半期利益成長率
    if (overview.quarterlyEarningsGrowth !== 0) {
      if (overview.quarterlyEarningsGrowth > 0.25) score += 30;
      else if (overview.quarterlyEarningsGrowth > 0.15) score += 25;
      else if (overview.quarterlyEarningsGrowth > 0.05) score += 20;
      else if (overview.quarterlyEarningsGrowth > 0) score += 15;
      else score += 5;
      factors++;
    }

    // P/E ratio
    if (overview.pegRatio > 0) {
      if (overview.pegRatio < 1.0) score += 25;
      else if (overview.pegRatio < 1.5) score += 20;
      else if (overview.pegRatio < 2.0) score += 15;
      else score += 10;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 50;
  }

  private static calculateValuation(overview: CompanyOverview): number {
    let score = 0;
    let factors = 0;

    // PER
    if (overview.peRatio > 0) {
      if (overview.peRatio < 10) score += 25;
      else if (overview.peRatio < 15) score += 20;
      else if (overview.peRatio < 20) score += 15;
      else if (overview.peRatio < 30) score += 10;
      else score += 5;
      factors++;
    }

    // PBR（株価純資産倍率）
    if (overview.priceToBook > 0) {
      if (overview.priceToBook < 1.0) score += 25;
      else if (overview.priceToBook < 1.5) score += 20;
      else if (overview.priceToBook < 2.0) score += 15;
      else if (overview.priceToBook < 3.0) score += 10;
      else score += 5;
      factors++;
    }

    // PSR（株価売上高倍率）
    if (overview.priceToSales > 0) {
      if (overview.priceToSales < 1.0) score += 25;
      else if (overview.priceToSales < 2.0) score += 20;
      else if (overview.priceToSales < 3.0) score += 15;
      else if (overview.priceToSales < 5.0) score += 10;
      else score += 5;
      factors++;
    }

    // 配当利回り
    if (overview.dividendYield > 0) {
      if (overview.dividendYield > 0.04) score += 20;
      else if (overview.dividendYield > 0.02) score += 15;
      else score += 10;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 50;
  }

  /**
   * リスクスコア計算
   */
  private static calculateRisk(overview: CompanyOverview, timeSeries: TimeSeriesData[]): number {
    let score = 100; // リスクスコアは100から減点方式

    // ベータ値（市場との連動性）
    if (overview.beta > 0) {
      if (overview.beta > 2.0) score -= 30;
      else if (overview.beta > 1.5) score -= 20;
      else if (overview.beta > 1.2) score -= 10;
      // ベータ1.0以下は減点なし
    }

    // 株価ボラティリティ（過去30日間）
    if (timeSeries.length >= 5) {
      const prices = timeSeries.map(ts => ts.close);
      const volatility = this.calculateVolatility(prices);
      
      if (volatility > 0.05) score -= 25; // 5%以上の日次変動
      else if (volatility > 0.03) score -= 15; // 3%以上の日次変動
      else if (volatility > 0.02) score -= 10; // 2%以上の日次変動
    }

    // 52週高値からの下落率
    if (overview.week52High > 0 && overview.week52Low > 0) {
      const currentPrice = (overview.week52High + overview.week52Low) / 2; // 概算
      const dropFromHigh = (overview.week52High - currentPrice) / overview.week52High;
      
      if (dropFromHigh > 0.5) score -= 20; // 50%以上下落
      else if (dropFromHigh > 0.3) score -= 15; // 30%以上下落
      else if (dropFromHigh > 0.2) score -= 10; // 20%以上下落
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 株価のボラティリティ計算
   */
  private static calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  /**
   * 投資推奨レベル決定
   */
  private static getRecommendation(score: number): 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' {
    if (score >= 80) return 'Strong Buy';
    if (score >= 65) return 'Buy';
    if (score >= 45) return 'Hold';
    if (score >= 30) return 'Sell';
    return 'Strong Sell';
  }

  /**
   * 詳細情報生成
   */
  private static generateDetails(
    overview: CompanyOverview,
    quote: StockQuote,
    scores: { financialHealth: number; growth: number; valuation: number; risk: number }
  ) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // 強み分析
    if (scores.financialHealth >= 70) strengths.push('優秀な財務健全性');
    if (scores.growth >= 70) strengths.push('高い成長性');
    if (scores.valuation >= 70) strengths.push('割安な株価水準');
    if (scores.risk >= 70) strengths.push('低リスク');

    if (overview.profitMargin > 0.15) strengths.push('高い利益率');
    if (overview.returnOnEquity > 0.20) strengths.push('高い自己資本利益率');
    if (overview.quarterlyRevenueGrowth > 0.15) strengths.push('売上高成長率が高い');
    if (overview.peRatio > 0 && overview.peRatio < 15) strengths.push('適正なPER水準');
    if (overview.dividendYield > 0.03) strengths.push('魅力的な配当利回り');

    // 弱み分析
    if (scores.financialHealth <= 40) weaknesses.push('財務健全性に課題');
    if (scores.growth <= 40) weaknesses.push('成長性が低い');
    if (scores.valuation <= 40) weaknesses.push('割高な株価水準');
    if (scores.risk <= 40) weaknesses.push('高リスク');

    if (overview.profitMargin < 0.05) weaknesses.push('利益率が低い');
    if (overview.returnOnEquity < 0.10) weaknesses.push('自己資本利益率が低い');
    if (overview.quarterlyRevenueGrowth < 0) weaknesses.push('売上高が減少傾向');
    if (overview.peRatio > 30) weaknesses.push('PERが高い');
    if (overview.beta > 1.5) weaknesses.push('株価変動が大きい');

    const keyMetrics = {
      '時価総額': overview.marketCap ? `$${(overview.marketCap / 1000000000).toFixed(1)}B` : 'N/A',
      'PER': overview.peRatio || 'N/A',
      'PBR': overview.priceToBook || 'N/A',
      '利益率': overview.profitMargin ? `${(overview.profitMargin * 100).toFixed(1)}%` : 'N/A',
      'ROE': overview.returnOnEquity ? `${(overview.returnOnEquity * 100).toFixed(1)}%` : 'N/A',
      '配当利回り': overview.dividendYield ? `${(overview.dividendYield * 100).toFixed(1)}%` : 'N/A',
      '売上成長率': overview.quarterlyRevenueGrowth ? `${(overview.quarterlyRevenueGrowth * 100).toFixed(1)}%` : 'N/A',
      'ベータ': overview.beta || 'N/A'
    };

    return {
      strengths: strengths.length > 0 ? strengths : ['特筆すべき強みなし'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['特筆すべき弱みなし'],
      keyMetrics
    };
  }
} 