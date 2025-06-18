import { Company } from '@/types/company';

export class InvestmentAnalyzer {
  private company: Company;

  constructor(company: Company) {
    this.company = company;
  }

  /**
   * @returns 0-100のスコア
   */
  public calculateInvestmentScore(): number {
    const scores = [
      this.calculateFinancialScore(),
      this.calculateGrowthScore(),
      this.calculateRiskScore(),
      this.calculateMarketScore()
    ];

    // 各スコアの重み付け
    const weights = [0.4, 0.3, 0.2, 0.1];
    return scores.reduce((acc, score, index) => acc + score * weights[index], 0);
  }

  /**
   * 財務スコアを計算する
   */
  private calculateFinancialScore(): number {
    const { financials } = this.company;
    if (!financials) return 0;

    let score = 0;
    
    // 売上高成長率
    if (financials.sales_growth_rate) {
      score += Math.min(financials.sales_growth_rate * 2, 30);
    }

    // 営業利益率
    if (financials.operating_profit_margin) {
      score += Math.min(financials.operating_profit_margin * 2, 30);
    }

    // 自己資本比率
    if (financials.equity_ratio) {
      score += Math.min(financials.equity_ratio, 20);
    }

    // 流動比率
    if (financials.current_ratio) {
      score += Math.min(financials.current_ratio / 2, 20);
    }

    return Math.min(score, 100);
  }

  /**
   * 成長スコアを計算する
   */
  private calculateGrowthScore(): number {
    const { financials } = this.company;
    if (!financials) return 0;

    let score = 0;

    // 売上高成長率
    if (financials.sales_growth_rate) {
      score += Math.min(financials.sales_growth_rate * 3, 40);
    }

    // 営業利益成長率
    if (financials.operating_profit_growth_rate) {
      score += Math.min(financials.operating_profit_growth_rate * 3, 40);
    }

    // 従業員数成長率
    if (financials.employee_growth_rate) {
      score += Math.min(financials.employee_growth_rate * 2, 20);
    }

    return Math.min(score, 100);
  }

  /**
   * リスクスコアを計算する
   */
  private calculateRiskScore(): number {
    const { financials } = this.company;
    if (!financials) return 0;

    let score = 100;

    // 負債比率が高いほどリスクスコアを下げる
    if (financials.debt_ratio) {
      score -= Math.min(financials.debt_ratio / 2, 30);
    }

    // 流動比率が低いほどリスクスコアを下げる
    if (financials.current_ratio) {
      score -= Math.max(0, (2 - financials.current_ratio) * 20);
    }

    // 営業利益率が低いほどリスクスコアを下げる
    if (financials.operating_profit_margin) {
      score -= Math.max(0, (5 - financials.operating_profit_margin) * 10);
    }

    return Math.max(0, score);
  }

  /**
   * 市場スコアを計算する
   */
  private calculateMarketScore(): number {
    const { financials } = this.company;
    if (!financials) return 0;

    let score = 0;

    // 時価総額
    if (financials.market_cap) {
      score += Math.min(financials.market_cap / 1000000000, 30);
    }

    // 株価収益率（PER）
    if (financials.per) {
      score += Math.min(30 / financials.per, 30);
    }

    // 株価純資産倍率（PBR）
    if (financials.pbr) {
      score += Math.min(3 / financials.pbr, 20);
    }

    // 配当利回り
    if (financials.dividend_yield) {
      score += Math.min(financials.dividend_yield * 10, 20);
    }

    return Math.min(score, 100);
  }

  /**
   * 投資推奨度を取得する
   */
  public getInvestmentRecommendation(): string {
    const score = this.calculateInvestmentScore();
    
    if (score >= 80) return '強く推奨';
    if (score >= 60) return '推奨';
    if (score >= 40) return '中立';
    if (score >= 20) return '注意';
    return '非推奨';
  }

  /**
   * 詳細な分析結果を取得する
   */
  public getDetailedAnalysis(): {
    totalScore: number;
    financialScore: number;
    growthScore: number;
    riskScore: number;
    marketScore: number;
    recommendation: string;
  } {
    return {
      totalScore: this.calculateInvestmentScore(),
      financialScore: this.calculateFinancialScore(),
      growthScore: this.calculateGrowthScore(),
      riskScore: this.calculateRiskScore(),
      marketScore: this.calculateMarketScore(),
      recommendation: this.getInvestmentRecommendation()
    };
  }
} 