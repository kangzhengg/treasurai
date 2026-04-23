/**
 * ROI Calculator Engine
 * Calculates financial returns on treasury decisions
 * Produces monthly/yearly projections with measurable KPIs
 */

class ROICalculator {
  constructor() {
    this.daysPerYear = 365;
    this.daysPerMonth = 30.44; // Average days per month
  }

  /**
   * Calculate ROI for FX strategy decision
   */
  calculateFXStrategyROI(strategy, baselineAmount, executionCost, savings, timeframeMonths = 1) {
    const timeframeYears = timeframeMonths / 12;
    const savingsPerMonth = savings / timeframeMonths;
    const savingsPerYear = savings / timeframeYears;

    // Calculate ROI percentage
    const roi = (savings / executionCost) * 100;
    const roiAnnualized = roi / timeframeYears;

    // Payback period in days
    const paybackDays = (executionCost / (savings / (timeframeMonths * this.daysPerMonth))).toFixed(1);

    return {
      strategy,
      timeframe: `${timeframeMonths} month${timeframeMonths > 1 ? 's' : ''}`,
      baseline: baselineAmount.toFixed(0),
      executionCost: executionCost.toFixed(0),
      grossSavings: savings.toFixed(0),
      netSavings: (savings - executionCost).toFixed(0),
      
      roi: {
        percentage: roi.toFixed(2) + '%',
        annualized: roiAnnualized.toFixed(2) + '%',
        paybackDays: paybackDays + ' days',
      },

      projections: {
        weekly: (savingsPerMonth / 4.3).toFixed(0),
        monthly: savingsPerMonth.toFixed(0),
        quarterly: (savingsPerMonth * 3).toFixed(0),
        semiAnnual: (savingsPerMonth * 6).toFixed(0),
        annual: savingsPerYear.toFixed(0),
      },

      scorecard: {
        efficiency: roi > 50 ? '⭐⭐⭐⭐⭐' : roi > 20 ? '⭐⭐⭐⭐' : roi > 5 ? '⭐⭐⭐' : '⭐⭐',
        timeToValue: paybackDays < 7 ? 'Immediate' : paybackDays < 30 ? 'Quick (< 30 days)' : 'Medium-term',
        recommendation: roi > 50 ? 'HIGHLY RECOMMENDED' : roi > 20 ? 'RECOMMENDED' : 'CONSIDER',
      },
    };
  }

  /**
   * Calculate ROI for supplier negotiation
   */
  calculateSupplierNegotiationROI(
    supplierName,
    currentPrice,
    negotiatedPrice,
    quantity,
    negotiationEffort = 'BALANCED',
    monthlyRecurrence = true
  ) {
    const savingsPerTransaction = currentPrice - negotiatedPrice;
    const transactionsPerYear = monthlyRecurrence ? 12 : 1;
    const annualSavings = savingsPerTransaction * quantity * transactionsPerYear;

    // Negotiation effort cost (internal resources)
    const effortCosts = {
      'AGGRESSIVE': 5000,
      'BALANCED': 2500,
      'COLLABORATIVE': 1500,
    };
    const effortCost = effortCosts[negotiationEffort] || 2500;

    // First transaction benefit
    const firstTransactionSavings = savingsPerTransaction * quantity;

    // Payback period
    const paybackTransactions = monthlyRecurrence
      ? effortCost / (savingsPerTransaction * quantity)
      : 1;
    const paybackMonths = paybackTransactions * (monthlyRecurrence ? 1 : 12);

    const roi = ((annualSavings - effortCost) / effortCost) * 100;

    return {
      supplier: supplierName,
      currentPrice: currentPrice.toFixed(2),
      negotiatedPrice: negotiatedPrice.toFixed(2),
      discountAmount: savingsPerTransaction.toFixed(2),
      discountPercent: ((savingsPerTransaction / currentPrice) * 100).toFixed(2) + '%',
      quantity,
      
      roi: {
        firstTransaction: firstTransactionSavings.toFixed(0),
        annual: annualSavings.toFixed(0),
        netAnnual: (annualSavings - effortCost).toFixed(0),
        percentage: roi.toFixed(2) + '%',
      },

      effort: {
        estimatedHours: this._effortToHours(negotiationEffort),
        internalCost: effortCost.toFixed(0),
        timeToPayback: paybackMonths.toFixed(1) + ' months',
      },

      projections: {
        monthly: (annualSavings / 12).toFixed(0),
        quarterly: (annualSavings / 4).toFixed(0),
        semiAnnual: (annualSavings / 2).toFixed(0),
        annual: annualSavings.toFixed(0),
        threeYear: (annualSavings * 3).toFixed(0),
        fiveYear: (annualSavings * 5).toFixed(0),
      },

      scorecard: {
        impact: annualSavings > 100000 ? '⭐⭐⭐⭐⭐' : annualSavings > 50000 ? '⭐⭐⭐⭐' : '⭐⭐⭐',
        paybackSpeed: paybackMonths < 1 ? 'Immediate' : paybackMonths < 3 ? 'Very Quick' : paybackMonths < 6 ? 'Quick' : 'Medium-term',
        recommendation: roi > 100 ? 'PRIORITY' : roi > 50 ? 'STRONGLY RECOMMENDED' : roi > 20 ? 'RECOMMENDED' : 'OPTIONAL',
        recurringBenefit: monthlyRecurrence ? 'YES (repeats monthly)' : 'ONE-TIME',
      },
    };
  }

  /**
   * Calculate comprehensive ROI across multiple decisions
   */
  calculateComprehensiveROI(decisions) {
    // decisions = [
    //   { type: 'FX', strategy: 'CONVERT_NOW', savings: 10000, cost: 150, months: 1 },
    //   { type: 'SUPPLIER', supplier: 'SupplierA', annualSavings: 50000, effortCost: 2500 },
    // ]

    let totalSavings = 0;
    let totalCosts = 0;
    const breakdownByType = {};

    decisions.forEach(decision => {
      const savings = decision.savings || decision.annualSavings || 0;
      const cost = decision.cost || decision.effortCost || 0;

      totalSavings += savings;
      totalCosts += cost;

      if (!breakdownByType[decision.type]) {
        breakdownByType[decision.type] = { savings: 0, cost: 0, count: 0 };
      }
      breakdownByType[decision.type].savings += savings;
      breakdownByType[decision.type].cost += cost;
      breakdownByType[decision.type].count += 1;
    });

    const netBenefit = totalSavings - totalCosts;
    const roi = (netBenefit / totalCosts) * 100;
    const roiAnnualized = roi; // Assuming annual basis

    return {
      overview: {
        totalDecisions: decisions.length,
        totalSavings: totalSavings.toFixed(0),
        totalCosts: totalCosts.toFixed(0),
        netBenefit: netBenefit.toFixed(0),
        roi: roi.toFixed(2) + '%',
        roiAnnualized: roiAnnualized.toFixed(2) + '%',
      },

      breakdown: Object.entries(breakdownByType).map(([type, data]) => ({
        type,
        decisions: data.count,
        savingsPerDecision: (data.savings / data.count).toFixed(0),
        totalSavings: data.savings.toFixed(0),
        totalCost: data.cost.toFixed(0),
        netBenefit: (data.savings - data.cost).toFixed(0),
        roi: ((data.savings - data.cost) / data.cost * 100).toFixed(2) + '%',
      })),

      projections: {
        monthly: (totalSavings / 12).toFixed(0),
        quarterly: (totalSavings / 4).toFixed(0),
        annual: totalSavings.toFixed(0),
        threeYear: (totalSavings * 3).toFixed(0),
        fiveYear: (totalSavings * 5).toFixed(0),
      },

      performance: {
        bestDecision: this._identifyBestDecision(decisions),
        quickestPayback: this._quickestPayback(decisions),
        highestImpact: this._highestImpact(decisions),
      },

      scorecard: {
        overallEvaluation: roi > 100 ? '⭐⭐⭐⭐⭐ EXCEPTIONAL' : roi > 50 ? '⭐⭐⭐⭐ EXCELLENT' : roi > 20 ? '⭐⭐⭐ GOOD' : '⭐⭐ MODEST',
        implementationRecommendation: netBenefit > 50000 ? 'IMPLEMENT ALL' : 'IMPLEMENT TOP PRIORITY',
      },
    };
  }

  /**
   * Compare ROI across different scenarios
   */
  compareROIScenarios(scenarioResults) {
    // scenarioResults = [
    //   { scenario: 'Normal', savings: 50000, cost: 2000 },
    //   { scenario: 'Crisis', savings: 120000, cost: 2000 },
    //   { scenario: 'Overpricing', savings: 75000, cost: 3000 },
    // ]

    const analyzed = scenarioResults.map(scenario => {
      const netBenefit = scenario.savings - scenario.cost;
      const roi = (netBenefit / scenario.cost) * 100;

      return {
        ...scenario,
        netBenefit: netBenefit.toFixed(0),
        roi: roi.toFixed(2) + '%',
        recommendation: roi > 50 ? 'RECOMMENDED' : 'ACCEPTABLE',
      };
    });

    const ranked = [...analyzed].sort((a, b) => {
      const aROI = Number(a.roi);
      const bROI = Number(b.roi);
      return bROI - aROI;
    });

    return {
      scenarios: analyzed,
      ranking: ranked.map((s, i) => ({
        rank: i + 1,
        scenario: s.scenario,
        roi: s.roi,
        netBenefit: s.netBenefit,
        recommendation: s.recommendation,
      })),
      bestCase: {
        scenario: ranked[0].scenario,
        roi: ranked[0].roi,
        savingsUpside: (Number(ranked[0].netBenefit) - Number(ranked[1].netBenefit)).toFixed(0),
      },
      worstCase: {
        scenario: ranked[ranked.length - 1].scenario,
        roi: ranked[ranked.length - 1].roi,
        savingsDownside: (Number(ranked[1].netBenefit) - Number(ranked[ranked.length - 1].netBenefit)).toFixed(0),
      },
    };
  }

  /**
   * Create dashboard KPI card
   */
  generateKPICard(metric, value, unit = 'RM', trend = 'neutral', variance = 0) {
    let trendIndicator = '→';
    let trendClass = 'neutral';

    if (trend === 'up' && variance > 0) {
      trendIndicator = '↑';
      trendClass = 'positive';
    } else if (trend === 'down' && variance < 0) {
      trendIndicator = '↓';
      trendClass = 'negative';
    }

    return {
      metric,
      value: typeof value === 'number' ? value.toFixed(0) : value,
      unit,
      trend: trendIndicator,
      trendClass,
      variance: Math.abs(variance).toFixed(0),
      display: `${trendIndicator} ${typeof value === 'number' ? value.toFixed(0) : value} ${unit}`,
    };
  }

  /**
   * Create 90-day projection chart data
   */
  generate90DayProjection(monthlyBenefit, startAmount = 0) {
    const days = [];
    let cumulativeBenefit = startAmount;

    for (let day = 1; day <= 90; day++) {
      cumulativeBenefit += monthlyBenefit / 30.44; // Daily benefit
      days.push({
        day,
        date: new Date(new Date().getTime() + day * 86400000).toISOString().split('T')[0],
        dailyBenefit: (monthlyBenefit / 30.44).toFixed(0),
        cumulativeBenefit: cumulativeBenefit.toFixed(0),
      });
    }

    return {
      period: '90 days',
      monthlyBenefit: monthlyBenefit.toFixed(0),
      projectedTotal: (monthlyBenefit * 3).toFixed(0),
      dayByDayData: days,
      milestones: {
        day30: (monthlyBenefit).toFixed(0),
        day60: (monthlyBenefit * 2).toFixed(0),
        day90: (monthlyBenefit * 3).toFixed(0),
      },
    };
  }

  // Helper methods
  _effortToHours(effort) {
    const hours = {
      'AGGRESSIVE': 20,
      'BALANCED': 12,
      'COLLABORATIVE': 8,
    };
    return hours[effort] || 12;
  }

  _identifyBestDecision(decisions) {
    return decisions.reduce((best, curr) => {
      const currROI = (curr.savings || curr.annualSavings) / (curr.cost || curr.effortCost);
      const bestROI = (best.savings || best.annualSavings) / (best.cost || best.effortCost);
      return currROI > bestROI ? curr : best;
    });
  }

  _quickestPayback(decisions) {
    return decisions.reduce((quickest, curr) => {
      const currPayback = (curr.cost || curr.effortCost) / (curr.savings || curr.annualSavings);
      const quickestPayback = (quickest.cost || quickest.effortCost) / (quickest.savings || quickest.annualSavings);
      return currPayback < quickestPayback ? curr : quickest;
    });
  }

  _highestImpact(decisions) {
    return decisions.reduce((highest, curr) => {
      const currSavings = curr.savings || curr.annualSavings;
      const highestSavings = highest.savings || highest.annualSavings;
      return currSavings > highestSavings ? curr : highest;
    });
  }
}

export default ROICalculator;
