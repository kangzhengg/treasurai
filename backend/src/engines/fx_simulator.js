/**
 * FX Simulation Engine
 * Simulates foreign exchange strategies for currency management
 * Outputs: convert now, wait, hedge scenarios with cost/savings/risk analysis
 */

class FXSimulator {
  constructor() {
    // Current market rates (MYR per foreign currency)
    this.rates = {
      'USD': 4.45,
      'EUR': 4.95,
      'GBP': 5.65,
      'SGD': 3.32,
      'CNY': 0.62,
    };

    // Historical volatility (std dev of daily changes)
    this.volatility = {
      'USD': 0.008,    // 0.8% daily volatility
      'EUR': 0.012,    // 1.2% daily volatility
      'GBP': 0.015,    // 1.5% daily volatility
      'SGD': 0.007,    // 0.7% daily volatility
      'CNY': 0.005,    // 0.5% daily volatility
    };

    // Trend direction (1 = strengthen foreign, -1 = weaken foreign)
    this.trends = {
      'USD': 1,        // USD expected to strengthen
      'EUR': -0.5,     // EUR expected to weaken slightly
      'GBP': 0.3,      // GBP expected to strengthen slightly
      'SGD': 0,        // SGD neutral
      'CNY': -0.2,     // CNY expected to weaken
    };
  }

  /**
   * Simulate CONVERT NOW strategy
   * Execute currency conversion immediately at current rates
   */
  simulateConvertNow(currency, amount, daysHorizon = 30) {
    const currentRate = this.rates[currency];
    const amountInRm = amount * currentRate;
    const fxFee = amountInRm * 0.0015; // 0.15% FX fee

    // Best case: currency actually strengthens (we benefit)
    const bestCaseRate = currentRate * (1 - this.volatility[currency] * 2);
    const bestCaseValue = (amount * currentRate) + (amount * (currentRate - bestCaseRate));

    // Worst case: currency weakens further (we're protected)
    const worstCaseRate = currentRate * (1 + this.volatility[currency] * 2);
    const worstCaseValue = amountInRm;

    return {
      strategy: 'CONVERT_NOW',
      currency,
      amount,
      currentRate,
      executionCost: amountInRm,
      fxFee,
      netCost: amountInRm + fxFee,
      savings: 0, // No savings on day 0
      riskLevel: 'LOW',
      confidence: 0.92,
      bestCase: bestCaseValue,
      worstCase: worstCaseValue,
      reasoning: `Convert ${amount} ${currency} immediately at ${currentRate.toFixed(4)} MYR/${currency}. Locks in rate but incurs ${fxFee.toFixed(0)} RM fee.`,
      timeline: 'Immediate (1-2 business days)',
    };
  }

  /**
   * Simulate WAIT strategy
   * Delay currency conversion hoping for rate improvement
   */
  simulateWait(currency, amount, daysHorizon = 30) {
    const currentRate = this.rates[currency];
    const trend = this.trends[currency];
    const volatility = this.volatility[currency];

    // Project rate after daysHorizon
    const trendComponent = trend * volatility * (daysHorizon / 30) * 0.5;
    const projectedRate = currentRate * (1 + trendComponent);

    // Cost comparison
    const costIfConvertToday = amount * currentRate;
    const costIfWait = amount * projectedRate;
    const savings = costIfConvertToday - costIfWait;

    // Downside risk: rate moves against us
    const downRiskRate = currentRate * (1 + volatility * Math.sqrt(daysHorizon / 30) * 1.5);
    const downRiskCost = amount * downRiskRate;
    const downRiskLoss = downRiskCost - costIfConvertToday;

    return {
      strategy: 'WAIT',
      currency,
      amount,
      currentRate,
      projectedRate: projectedRate.toFixed(4),
      daysHorizon,
      costIfConvertToday: costIfConvertToday.toFixed(0),
      projectedCost: costIfWait.toFixed(0),
      expectedSavings: Math.max(0, savings).toFixed(0),
      downRiskLoss: Math.max(0, downRiskLoss).toFixed(0),
      riskLevel: trend < 0 ? 'MEDIUM' : 'HIGH',
      confidence: 0.65,
      successProbability: trend < 0 ? 0.68 : 0.42,
      reasoning: `Wait ${daysHorizon} days for rate improvement. Projected savings: ${Math.max(0, savings).toFixed(0)} RM if ${trend < 0 ? currency + ' weakens' : 'rate improves'}. Risk: Rate could worsen by ${Math.max(0, downRiskLoss).toFixed(0)} RM.`,
      timeline: `${daysHorizon} days`,
    };
  }

  /**
   * Simulate HEDGE strategy
   * Use financial instruments (forwards/options) to limit downside
   */
  simulateHedge(currency, amount, daysHorizon = 30) {
    const currentRate = this.rates[currency];
    const volatility = this.volatility[currency];

    // Forward contract rate (typically includes spread)
    const forwardSpread = 0.002; // 0.2% spread
    const forwardRate = currentRate * (1 + forwardSpread);
    const costIfHedge = amount * forwardRate;

    // Hedge cost (option premium)
    const optionPremium = amount * currentRate * volatility * Math.sqrt(daysHorizon / 365) * 0.4;

    // Scenarios
    const costIfConvertToday = amount * currentRate;
    const bestCaseRate = currentRate * (1 - volatility * 2);
    const bestCaseCost = amount * bestCaseRate;
    const worstCaseRate = currentRate * (1 + volatility * 3);
    const worstCaseCost = amount * worstCaseRate;

    // Protected cost with hedge
    const protectedCost = costIfHedge + optionPremium;

    return {
      strategy: 'HEDGE',
      currency,
      amount,
      currentRate,
      forwardRate: forwardRate.toFixed(4),
      optionPremium: optionPremium.toFixed(0),
      forwardCost: costIfHedge.toFixed(0),
      totalHedgeCost: protectedCost.toFixed(0),
      maxExposure: costIfHedge.toFixed(0),
      riskLevel: 'LOW',
      confidence: 0.88,
      bestCaseUnhedged: bestCaseCost.toFixed(0),
      worstCaseUnhedged: worstCaseCost.toFixed(0),
      bestCaseHedged: costIfHedge.toFixed(0),
      worstCaseHedged: costIfHedge.toFixed(0),
      reasoning: `Lock rate at ${forwardRate.toFixed(4)} MYR/${currency} via forward contract. Costs ${optionPremium.toFixed(0)} RM premium but caps maximum exposure. Protects against extreme volatility.`,
      timeline: `${daysHorizon} days (locked contract)`,
    };
  }

  /**
   * Compare all three strategies and rank by effectiveness
   */
  compareStrategies(currency, amount, daysHorizon = 30, marketScenario = 'NORMAL') {
    const convertNow = this.simulateConvertNow(currency, amount, daysHorizon);
    const wait = this.simulateWait(currency, amount, daysHorizon);
    const hedge = this.simulateHedge(currency, amount, daysHorizon);

    // Scoring logic based on market scenario
    const scores = this._scoreStrategies(convertNow, wait, hedge, marketScenario);

    return {
      strategies: [convertNow, wait, hedge],
      scores,
      recommendation: this._rankStrategies(scores),
      marketScenario,
      analysisDate: new Date().toISOString(),
    };
  }

  _scoreStrategies(convertNow, wait, hedge, scenario) {
    const scores = {};

    if (scenario === 'CRISIS') {
      // In crisis: hedge is safest
      scores['CONVERT_NOW'] = 0.6;
      scores['WAIT'] = 0.4;
      scores['HEDGE'] = 0.95;
    } else if (scenario === 'OPPORTUNISTIC') {
      // In opportunity: wait for gains
      scores['CONVERT_NOW'] = 0.7;
      scores['WAIT'] = 0.85;
      scores['HEDGE'] = 0.5;
    } else {
      // Normal market: balanced
      scores['CONVERT_NOW'] = 0.75;
      scores['WAIT'] = 0.68;
      scores['HEDGE'] = 0.80;
    }

    return scores;
  }

  _rankStrategies(scores) {
    const ranked = Object.entries(scores)
      .map(([strategy, score]) => ({ strategy, score }))
      .sort((a, b) => b.score - a.score);

    return {
      rank1: ranked[0].strategy,
      rank1Score: (ranked[0].score * 100).toFixed(0) + '%',
      rank2: ranked[1].strategy,
      rank2Score: (ranked[1].score * 100).toFixed(0) + '%',
      rank3: ranked[2].strategy,
      rank3Score: (ranked[2].score * 100).toFixed(0) + '%',
    };
  }

  /**
   * Get current market rates
   */
  getCurrentRates() {
    return {
      timestamp: new Date().toISOString(),
      rates: this.rates,
      volatility: this.volatility,
      trends: this.trends,
    };
  }

  /**
   * Simulate multi-currency exposure
   */
  simulateMultiCurrencyExposure(exposures, daysHorizon = 30) {
    // exposures = [{ currency: 'USD', amount: 1000000 }, ...]
    const totalExposure = {};

    exposures.forEach(exp => {
      const convertNow = this.simulateConvertNow(exp.currency, exp.amount, daysHorizon);
      const wait = this.simulateWait(exp.currency, exp.amount, daysHorizon);

      if (!totalExposure[exp.currency]) {
        totalExposure[exp.currency] = {
          convertNow: convertNow,
          wait: wait,
        };
      }
    });

    return totalExposure;
  }
}

export default FXSimulator;
