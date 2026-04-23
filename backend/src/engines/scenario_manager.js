/**
 * Scenario Simulation Engine
 * Simulates three market scenarios with realistic outcomes
 * Enables demo storytelling with measurable financial impact
 */

class ScenarioManager {
  constructor() {
    // Base ERP data for scenarios
    this.baseCompanyData = {
      cashBalance: 4300000,
      payables: [
        { currency: 'USD', amount: 2500000, dueDate: '2024-05-15' },
        { currency: 'EUR', amount: 1200000, dueDate: '2024-05-20' },
        { currency: 'SGD', amount: 800000, dueDate: '2024-05-10' },
      ],
      receivables: [
        { currency: 'USD', amount: 1800000, dueDate: '2024-05-25' },
        { currency: 'EUR', amount: 900000, dueDate: '2024-06-01' },
      ],
      suppliers: [
        { name: 'TechSupply Co', category: 'Electronics', monthlySpend: 450000, relationship: 'STRATEGIC' },
        { name: 'LogisticsPro', category: 'Logistics', monthlySpend: 320000, relationship: 'PREFERRED' },
        { name: 'RawMatSupply', category: 'Raw Materials', monthlySpend: 280000, relationship: 'TRANSACTIONAL' },
      ],
    };
  }

  /**
   * Scenario A: Normal Market Conditions
   * - Stable FX rates, normal supplier terms, standard treasury decisions
   */
  simulateNormalMarket() {
    const companyData = JSON.parse(JSON.stringify(this.baseCompanyData));

    // Normal market assumptions
    const fxAssumptions = {
      USD: { currentRate: 4.45, volatility: 0.008, trend: 'stable' },
      EUR: { currentRate: 4.95, volatility: 0.012, trend: 'stable' },
      SGD: { currentRate: 3.32, volatility: 0.007, trend: 'stable' },
    };

    // Treasury recommendations in normal market
    const decisions = [
      {
        id: 1,
        decision: 'PARTIAL_USD_CONVERSION',
        action: 'Convert 50% of USD payables (1.25M) now, delay 50%',
        amount: 1250000,
        currency: 'USD',
        timing: 'Immediate',
        strategy: 'BALANCED',
        savings: this._calculateSavings(1250000, 4.45, 0.008, 30, 'normal'),
        risk: 'LOW',
        confidence: 0.88,
      },
      {
        id: 2,
        decision: 'EUR_WAIT',
        action: 'Wait for ECB signals before EUR conversion',
        amount: 1200000,
        currency: 'EUR',
        timing: '10-15 days',
        strategy: 'WAIT',
        savings: this._calculateSavings(1200000, 4.95, 0.012, 14, 'normal'),
        risk: 'MEDIUM',
        confidence: 0.72,
      },
      {
        id: 3,
        decision: 'SUPPLIER_NEGOTIATION',
        action: 'Negotiate 8% discount with TechSupply Co (volume commitment)',
        supplier: 'TechSupply Co',
        amount: 450000,
        timing: '30 days',
        strategy: 'COLLABORATIVE',
        savings: this._calculateSupplierSavings(450000, 0.08),
        risk: 'LOW',
        confidence: 0.85,
      },
    ];

    // Calculate total impact
    const totalSavings = decisions.reduce((sum, d) => sum + d.savings, 0);
    const monthlyProjection = totalSavings;
    const annualProjection = monthlyProjection * 12;

    return {
      scenario: 'NORMAL_MARKET',
      name: '📈 Normal Market Conditions',
      description: 'Stable FX rates (±0.8%), normal volatility, typical supplier margins',
      marketConditions: {
        fxVolatility: 'Low',
        fxTrend: 'Stable',
        economicOutlook: 'Steady growth',
        supplierMarginPressure: 'Normal',
        recommendedApproach: 'BALANCED - Mix of immediate actions and wait-for-signal',
      },

      decisions,

      financialImpact: {
        immediateImpact: {
          savingsThisMonth: totalSavings.toFixed(0),
          riskExposure: 125000, // Small exposure
          maxDownside: (totalSavings * 0.15).toFixed(0), // 15% margin of error
        },
        projections: {
          monthly: monthlyProjection.toFixed(0),
          quarterly: (monthlyProjection * 3).toFixed(0),
          annual: annualProjection.toFixed(0),
        },
        roi: {
          percentage: '145%',
          paybackDays: '8 days',
          recommendation: 'IMPLEMENT',
        },
      },

      timeline: {
        phase1: 'Days 1-5: Execute USD conversion, initiate supplier negotiation',
        phase2: 'Days 5-15: Monitor EUR rate, close supplier negotiation',
        phase3: 'Days 15-30: Execute EUR conversion if target rate achieved',
      },

      risks: [
        { risk: 'USD strengthens unexpectedly', probability: 'LOW', impact: 'Reduces savings by ~5%', mitigation: 'Hedge 25% with forward' },
        { risk: 'Supplier rejects negotiation', probability: 'LOW', impact: 'Lost 36,000 RM annual', mitigation: 'Have secondary supplier' },
      ],
    };
  }

  /**
   * Scenario B: Economic Crisis
   * - High FX volatility, currency flight, supplier defaults, cashflow squeeze
   */
  simulateEconomicCrisis() {
    const companyData = JSON.parse(JSON.stringify(this.baseCompanyData));

    // Crisis assumptions
    const fxAssumptions = {
      USD: { currentRate: 4.45, volatility: 0.035, trend: 'strengthening' }, // 3.5% daily volatility
      EUR: { currentRate: 4.95, volatility: 0.042, trend: 'weakening' },
      SGD: { currentRate: 3.32, volatility: 0.025, trend: 'weakening' },
    };

    // Treasury recommendations in crisis
    const decisions = [
      {
        id: 1,
        decision: 'HEDGE_USD_EXPOSURE',
        action: 'HEDGE 100% USD payables with forward contracts (limit volatility)',
        amount: 2500000,
        currency: 'USD',
        timing: 'IMMEDIATE',
        strategy: 'HEDGE',
        savings: this._calculateCrisisSavings(2500000, 0.035, 'hedged'),
        hedgeCost: 44000,
        netSavings: this._calculateCrisisSavings(2500000, 0.035, 'hedged') - 44000,
        risk: 'LOW',
        confidence: 0.94,
        reasoning: 'Protects against USD spike; costs ~1.76% but eliminates catastrophic loss risk',
      },
      {
        id: 2,
        decision: 'EUR_ACCELERATED_CONVERSION',
        action: 'CONVERT EUR now (before further deterioration)',
        amount: 1200000,
        currency: 'EUR',
        timing: 'TODAY',
        strategy: 'CONVERT_NOW',
        savings: this._calculateCrisisSavings(1200000, 0.042, 'convert_now'),
        risk: 'MEDIUM',
        confidence: 0.82,
        reasoning: 'EUR declining; immediate action prevents 3-5% further loss',
      },
      {
        id: 3,
        decision: 'CASHFLOW_PRESERVATION',
        action: 'Negotiate payment deferrals (30-60 days extension)',
        supplier: 'RawMatSupply',
        amount: 280000,
        timing: '5-10 days',
        strategy: 'PAYMENT_DEFERRAL',
        savings: this._calculateCrisisSupplierSavings(280000, 0.045),
        risk: 'HIGH',
        confidence: 0.68,
        reasoning: 'Preserve cash for margin calls; expensive but essential',
      },
    ];

    // Calculate total impact
    const totalSavings = decisions.reduce((sum, d) => sum + (d.netSavings || d.savings), 0);

    return {
      scenario: 'ECONOMIC_CRISIS',
      name: '🔴 Economic Crisis (Flight-to-Safety)',
      description: 'High FX volatility (3-4%), currency devaluation, supply chain stress, margin calls',
      marketConditions: {
        fxVolatility: 'CRITICAL (3-4% daily swings)',
        fxTrend: 'USD spike, emerging currencies weaken',
        economicOutlook: 'Recession risk, capital flight',
        supplierMarginPressure: 'High defaults, payment term tightening',
        recommendedApproach: 'DEFENSIVE - Hedge exposure, preserve cashflow, lock in costs',
      },

      decisions,

      financialImpact: {
        immediateImpact: {
          savingsThisMonth: totalSavings.toFixed(0),
          riskExposure: '2.4M (without hedging)',
          maxDownside: (totalSavings * 0.25).toFixed(0), // 25% margin of error in crisis
          potentialLossIfUnhedged: 875000, // 5% × USD exposure
        },
        projections: {
          monthly: totalSavings.toFixed(0),
          quarterly: (totalSavings * 3).toFixed(0),
          annual: (totalSavings * 12).toFixed(0),
        },
        roi: {
          percentage: '267%',
          paybackDays: '2-3 days',
          recommendation: 'URGENT - IMPLEMENT IMMEDIATELY',
        },
      },

      timeline: {
        immediate: 'Hour 0: Execute USD hedge, convert EUR',
        urgent: 'Day 1: Initiate supplier payment negotiations',
        shortTerm: 'Days 2-7: Reassess daily, adjust hedging if rates stabilize',
      },

      risks: [
        { 
          risk: 'Supplier defaults entirely', 
          probability: 'MEDIUM', 
          impact: 'Supply chain disruption', 
          mitigation: 'Activate backup suppliers now' 
        },
        { 
          risk: 'Hedging cost exceeds savings', 
          probability: 'LOW', 
          impact: '50,000 RM additional cost', 
          mitigation: 'Cost of business continuity' 
        },
        { 
          risk: 'Counterparty credit default', 
          probability: 'LOW', 
          impact: 'Hedge contract fails', 
          mitigation: 'Use major banks only' 
        },
      ],

      warningFlags: [
        '⚠️ Corporate bond spreads widen',
        '⚠️ Credit default swaps spike',
        '⚠️ Bank lending tightens',
        '⚠️ Supplier credit ratings drop',
      ],
    };
  }

  /**
   * Scenario C: Supplier Overpricing Detected
   * - Market analysis reveals suppliers charging 15-25% above benchmark
   * - Strong negotiation opportunity
   */
  simulateSupplierOverpricing() {
    const companyData = JSON.parse(JSON.stringify(this.baseCompanyData));

    // Supplier overpricing analysis
    const supplierAnalysis = [
      {
        supplier: 'TechSupply Co',
        currentPrice: 520, // Per unit
        benchmarkPrice: 450,
        overpricing: 15.6,
        monthlyVolume: 10000,
        annualSpend: 62400000, // 520 × 10000 × 12
        benchmarkAnnualSpend: 54000000, // 450 × 10000 × 12
        opportunitySavings: 8400000,
      },
      {
        supplier: 'LogisticsPro',
        currentPrice: 92,
        benchmarkPrice: 80,
        overpricing: 15.0,
        monthlyVolume: 3500,
        annualSpend: 38640000,
        benchmarkAnnualSpend: 33600000,
        opportunitySavings: 5040000,
      },
      {
        supplier: 'RawMatSupply',
        currentPrice: 365,
        benchmarkPrice: 320,
        overpricing: 14.1,
        monthlyVolume: 2200,
        annualSpend: 9636000,
        benchmarkAnnualSpend: 8448000,
        opportunitySavings: 1188000,
      },
    ];

    // Negotiation decisions
    const decisions = [
      {
        id: 1,
        decision: 'AGGRESSIVE_RENEGOTIATION',
        action: 'Renegotiate TechSupply Co contract (data-driven benchmarking)',
        supplier: 'TechSupply Co',
        currentAnnualSpend: 62400000,
        targetPrice: 460, // 10% above benchmark, 12% discount from current
        targetAnnualSpend: 55200000,
        savingsTarget: 7200000,
        discountPercentage: 11.5,
        risk: 'MEDIUM',
        confidence: 0.78,
        negotiationApproach: 'Volume commitment (3-year contract) + performance SLA',
        timing: '14 days',
      },
      {
        id: 2,
        decision: 'COMPETITIVE_BIDDING',
        action: 'RFQ to secondary suppliers for Logistics (force price reduction)',
        supplier: 'LogisticsPro',
        currentAnnualSpend: 38640000,
        competitorQuote: 82, // Secondary supplier quoting 82 vs 92
        discountRequired: 10.9,
        savingsTarget: 3486000,
        risk: 'MEDIUM',
        confidence: 0.72,
        negotiationApproach: 'Use competitor quote as leverage; offer volume growth incentive',
        timing: '21 days',
      },
      {
        id: 3,
        decision: 'DIRECT_SUPPLIER_NEGOTIATION',
        action: 'Negotiate RawMatSupply on volume growth (lower margin acceptable)',
        supplier: 'RawMatSupply',
        currentAnnualSpend: 9636000,
        targetPrice: 336, // 5% above benchmark, 8% discount
        targetAnnualSpend: 8870400,
        savingsTarget: 765600,
        discountPercentage: 8.0,
        risk: 'LOW',
        confidence: 0.85,
        negotiationApproach: 'Strategic partnership; commit to 50% volume increase',
        timing: '10 days',
      },
    ];

    // Calculate total opportunity
    const totalOpportunitySavings = supplierAnalysis.reduce((sum, s) => sum + s.opportunitySavings, 0);
    const totalAgreedSavings = decisions.reduce((sum, d) => sum + d.savingsTarget, 0);
    const successRate = 0.72; // 72% success probability for negotiations
    const expectedSavings = totalAgreedSavings * successRate;

    return {
      scenario: 'SUPPLIER_OVERPRICING',
      name: '💰 Supplier Overpricing Detected',
      description: 'Market analysis reveals 14-16% overpricing across suppliers; strong negotiation window',
      marketConditions: {
        priceingAnomaly: 'Suppliers 15% above market average',
        marketContext: 'Buyer market (excess supply capacity)',
        supplyChainPressure: 'Low (no supply constraints)',
        recommendedApproach: 'AGGRESSIVE - Leverage data to negotiate 10-15% discounts',
      },

      supplierAnalysis,

      decisions,

      financialImpact: {
        immediateImpact: {
          totalOpportunitySavings: totalOpportunitySavings.toFixed(0),
          negotiationTarget: totalAgreedSavings.toFixed(0),
          expectedAchievement: expectedSavings.toFixed(0),
          successProbability: (successRate * 100).toFixed(0) + '%',
        },
        projections: {
          monthly: (expectedSavings / 12).toFixed(0),
          quarterly: (expectedSavings / 4).toFixed(0),
          annual: expectedSavings.toFixed(0),
          threeYear: (expectedSavings * 3).toFixed(0),
          fiveYear: (expectedSavings * 5).toFixed(0),
        },
        roi: {
          effortCost: 22500, // 3 negotiations × 7.5k each
          percentage: ((expectedSavings - 22500) / 22500 * 100).toFixed(0) + '%',
          paybackDays: '1 day',
          recommendation: 'CRITICAL PRIORITY - Highest ROI opportunity',
        },
      },

      timeline: {
        phase1: 'Days 1-3: Prepare RFQ responses, gather competitive quotes',
        phase2: 'Days 4-10: Initiate negotiations with all three suppliers',
        phase3: 'Days 11-21: Close agreements, finalize contracts',
        phase4: 'Days 22-30: Implementation, contract execution',
      },

      successFactors: [
        '✅ Data-driven approach (benchmarking defensible)',
        '✅ Buyer market conditions (excess supply)',
        '✅ Volume commitment as leverage',
        '✅ Multiple suppliers (can threaten to switch)',
        '✅ Strategic partnerships possible (win-win)',
      ],

      riskMitigation: [
        '📌 Backup suppliers on standby',
        '📌 Quality SLAs in new contracts',
        '📌 Graduated price reductions (if supplier refuses one-time drop)',
        '📌 Poison clauses (price escalation caps)',
      ],
    };
  }

  /**
   * Compare all three scenarios
   */
  compareAllScenarios() {
    const normalMarket = this.simulateNormalMarket();
    const crisis = this.simulateEconomicCrisis();
    const overpricing = this.simulateSupplierOverpricing();

    return {
      scenarios: [
        {
          name: normalMarket.name,
          scenario: normalMarket.scenario,
          savings: normalMarket.financialImpact.projections.annual,
          roi: normalMarket.financialImpact.roi.percentage,
          probability: '65%',
          recommendation: normalMarket.financialImpact.roi.recommendation,
        },
        {
          name: crisis.name,
          scenario: crisis.scenario,
          savings: crisis.financialImpact.projections.annual,
          roi: crisis.financialImpact.roi.percentage,
          probability: '25%',
          recommendation: crisis.financialImpact.roi.recommendation,
        },
        {
          name: overpricing.name,
          scenario: overpricing.scenario,
          savings: overpricing.financialImpact.projections.annual,
          roi: overpricing.financialImpact.roi.percentage,
          probability: '45%',
          recommendation: overpricing.financialImpact.roi.recommendation,
        },
      ],

      summary: {
        bestCase: overpricing.financialImpact.projections.annual,
        baseCase: normalMarket.financialImpact.projections.annual,
        worstCase: crisis.financialImpact.projections.annual,
        expectedValue: ((Number(normalMarket.financialImpact.projections.annual) * 0.65) +
          (Number(crisis.financialImpact.projections.annual) * 0.25) +
          (Number(overpricing.financialImpact.projections.annual) * 0.45)).toFixed(0),
      },

      dashboardRecommendation: 'Implement all decisions across all scenarios for maximum flexibility and upside capture',
    };
  }

  // Helper methods
  _calculateSavings(amount, rate, volatility, days, scenario) {
    const dailyVolatility = Math.sqrt(days / 252) * volatility; // Annualized to daily
    const rateMovement = dailyVolatility * Math.random();
    return amount * rate * rateMovement * 0.5; // Savings from rate movement
  }

  _calculateSupplierSavings(monthlySpend, discountPercentage) {
    return monthlySpend * discountPercentage;
  }

  _calculateCrisisSavings(amount, volatility, strategy) {
    if (strategy === 'hedged') {
      return amount * volatility * 2; // Savings from volatility elimination
    }
    return amount * volatility; // Savings from rate movement capture
  }

  _calculateCrisisSupplierSavings(monthlySpend, deferralBenefit) {
    return monthlySpend * deferralBenefit;
  }
}

export default ScenarioManager;
