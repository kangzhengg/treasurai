/**
 * Supplier Negotiation Engine
 * Analyzes supplier pricing and generates negotiation strategies
 * Detects overpricing and calculates discount opportunities
 */

class SupplierNegotiationEngine {
  constructor() {
    // Market price benchmarks for common commodities/services
    this.marketBenchmarks = {
      'Electronics': { avgPrice: 450, margin: 0.35, volatility: 0.12 },
      'Raw Materials': { avgPrice: 320, margin: 0.25, volatility: 0.20 },
      'Logistics': { avgPrice: 80, margin: 0.30, volatility: 0.08 },
      'Software Licenses': { avgPrice: 1200, margin: 0.50, volatility: 0.05 },
      'Consulting Services': { avgPrice: 150, margin: 0.55, volatility: 0.10 },
      'Manufacturing': { avgPrice: 200, margin: 0.40, volatility: 0.15 },
      'Maintenance': { avgPrice: 100, margin: 0.35, volatility: 0.07 },
    };

    // Supplier profiles (relationship history, negotiation flexibility)
    this.supplierProfiles = {
      'NEW': { negotiationFlexibility: 0.40, loyaltyDiscount: 0, riskyFlag: true },
      'TRANSACTIONAL': { negotiationFlexibility: 0.20, loyaltyDiscount: 0.02, riskyFlag: false },
      'STRATEGIC': { negotiationFlexibility: 0.35, loyaltyDiscount: 0.05, riskyFlag: false },
      'PREFERRED': { negotiationFlexibility: 0.50, loyaltyDiscount: 0.08, riskyFlag: false },
    };

    // Seasonal discount windows (% probability of discount)
    this.seasonalWindows = {
      'Q1': 0.30,
      'Q2': 0.40,
      'Q3': 0.25,
      'Q4': 0.65, // Year-end push
    };
  }

  /**
   * Analyze supplier price against market benchmark
   */
  analyzeSupplierPrice(category, supplierPrice, quantity = 1, supplierRelationship = 'TRANSACTIONAL') {
    const benchmark = this.marketBenchmarks[category];
    if (!benchmark) {
      return { error: `Category '${category}' not found in benchmarks` };
    }

    const pricePerUnit = supplierPrice / quantity;
    const benchmarkPrice = benchmark.avgPrice;
    const overpricing = ((pricePerUnit - benchmarkPrice) / benchmarkPrice) * 100;
    const isDeal = overpricing < -5;
    const isOverpriced = overpricing > 5;

    // Calculate potential savings
    const fairPrice = benchmarkPrice * quantity;
    const potentialSavings = supplierPrice - fairPrice;

    return {
      category,
      supplierPrice: supplierPrice.toFixed(2),
      benchmarkPrice: benchmarkPrice.toFixed(2),
      pricePerUnit: pricePerUnit.toFixed(2),
      quantity,
      overpricing: overpricing.toFixed(2) + '%',
      isDeal,
      isOverpriced,
      potentialSavings: Math.max(0, potentialSavings).toFixed(2),
      verdict: this._priceVerdict(overpricing),
      competitivenessScore: (100 - Math.abs(overpricing)).toFixed(0) + '%',
    };
  }

  /**
   * Compare against multiple suppliers
   */
  compareSuppliers(suppliers, category) {
    // suppliers = [
    //   { name: 'Supplier A', price: 5000, quantity: 10, relationship: 'STRATEGIC' },
    //   { name: 'Supplier B', price: 4500, quantity: 10, relationship: 'NEW' }
    // ]

    const analysis = suppliers.map(s => ({
      ...s,
      ...this.analyzeSupplierPrice(category, s.price, s.quantity, s.relationship),
    }));

    const lowestPrice = Math.min(...suppliers.map(s => s.price));
    const benchmark = this.marketBenchmarks[category];

    return {
      category,
      suppliers: analysis,
      lowestCost: lowestPrice.toFixed(2),
      benchmarkPrice: benchmark.avgPrice.toFixed(2),
      recommendedSupplier: this._selectBestSupplier(analysis),
      savingsOpportunity: {
        switchToLowest: (analysis.reduce((sum, s) => sum + Number(s.price), 0) - (lowestPrice * suppliers.length)).toFixed(0),
        switchToBenchmark: (analysis.reduce((sum, s) => sum + Number(s.price), 0) - (benchmark.avgPrice * suppliers.length)).toFixed(0),
      },
    };
  }

  /**
   * Generate detailed negotiation plan
   */
  generateNegotiationPlan(supplierName, currentPrice, quantity, category, relationship = 'TRANSACTIONAL', season = 'Q1') {
    const priceAnalysis = this.analyzeSupplierPrice(category, currentPrice, quantity, relationship);
    const benchmark = this.marketBenchmarks[category];
    const profile = this.supplierProfiles[relationship];
    const seasonalProb = this.seasonalWindows[season];

    // Calculate target discount
    const overpricing = Number(priceAnalysis.overpricing.replace('%', ''));
    const targetDiscountPercent = Math.min(overpricing * 0.6, profile.negotiationFlexibility * 100);
    const targetPrice = currentPrice * (1 - targetDiscountPercent / 100);
    const savingsIfSuccessful = currentPrice - targetPrice;

    // Success probability
    const successProbability = this._calculateSuccessProbability(
      profile.negotiationFlexibility,
      seasonalProb,
      overpricing > 5
    );

    // Generate negotiation script
    const script = this._generateNegotiationScript(
      supplierName,
      currentPrice,
      targetPrice,
      category,
      benchmark,
      relationship,
      savingsIfSuccessful
    );

    return {
      supplier: supplierName,
      category,
      relationship,
      season,
      currentPrice: currentPrice.toFixed(2),
      quantity,
      benchmarkPrice: benchmark.avgPrice.toFixed(2),
      overpricing: priceAnalysis.overpricing,
      
      negotiationTarget: {
        targetPrice: targetPrice.toFixed(2),
        targetDiscount: targetDiscountPercent.toFixed(2) + '%',
        savingsIfSuccessful: savingsIfSuccessful.toFixed(2),
        monthlyRecurringBenefit: (savingsIfSuccessful * 12 / 12).toFixed(2),
        annualBenefit: (savingsIfSuccessful * 12).toFixed(2),
      },

      negotiationStrategy: {
        approach: this._selectNegotiationApproach(profile.negotiationFlexibility, overpricing),
        successProbability: (successProbability * 100).toFixed(0) + '%',
        fallbackDiscount: (targetDiscountPercent * 0.6).toFixed(2) + '%',
        fallbackPrice: (currentPrice * (1 - (targetDiscountPercent * 0.6 / 100))).toFixed(2),
        riskySupplier: profile.riskyFlag,
      },

      negotiationScript: script,

      timing: {
        seasonalOpportunity: seasonalProb > 0.4,
        seasonalBonus: (seasonalProb * 10).toFixed(0) + '%',
        recommendedTiming: season === 'Q4' ? 'Immediate (year-end push)' : `Negotiate before ${season} ends`,
      },

      riskMitigation: {
        alternativeSuppliers: 2,
        priceEscalationClause: 'Recommended (protect against future hikes)',
        volumeCommitment: `Offer ${quantity > 100 ? '12-month' : '6-month'} commitment for ${targetDiscountPercent.toFixed(1)}% discount`,
      },
    };
  }

  /**
   * Batch analyze multiple suppliers for cost reduction opportunity
   */
  analyzeCostReductionOpportunity(supplierCatalog) {
    // supplierCatalog = [
    //   { supplier: 'Supplier A', category: 'Electronics', price: 5000, quantity: 100, relationship: 'STRATEGIC' },
    //   { supplier: 'Supplier B', category: 'Logistics', price: 8000, quantity: 50, relationship: 'PREFERRED' }
    // ]

    const opportunities = supplierCatalog.map(item => {
      const plan = this.generateNegotiationPlan(
        item.supplier,
        item.price,
        item.quantity,
        item.category,
        item.relationship,
        this._getCurrentQuarter()
      );
      return {
        ...plan,
        priority: this._calculateOpportunityPriority(plan),
      };
    });

    // Sort by opportunity value
    opportunities.sort((a, b) => {
      const aValue = Number(a.negotiationTarget.annualBenefit);
      const bValue = Number(b.negotiationTarget.annualBenefit);
      return bValue - aValue;
    });

    const totalAnnualBenefit = opportunities.reduce(
      (sum, opp) => sum + Number(opp.negotiationTarget.annualBenefit),
      0
    );

    return {
      totalSuppliers: supplierCatalog.length,
      opportunities,
      summary: {
        totalAnnualBenefit: totalAnnualBenefit.toFixed(2),
        averageDiscount: (opportunities.reduce((sum, o) => sum + Number(o.negotiationTarget.targetDiscount), 0) / opportunities.length).toFixed(2) + '%',
        expectedSuccessfulNegotiations: Math.ceil(opportunities.length * 0.65),
        timelineToComplete: '30-60 days',
      },
    };
  }

  // Helper methods
  _priceVerdict(overpricing) {
    if (overpricing < -5) return 'EXCELLENT_DEAL';
    if (overpricing < 0) return 'GOOD_PRICE';
    if (overpricing < 5) return 'FAIR_PRICE';
    if (overpricing < 15) return 'OVERPRICED';
    return 'SIGNIFICANTLY_OVERPRICED';
  }

  _selectBestSupplier(analysis) {
    // Consider both price and reliability (relationship)
    const scored = analysis.map(a => ({
      name: a.name,
      price: Number(a.price),
      competitiveness: Number(a.competitivenessScore),
      relationshipQuality: this.supplierProfiles[a.relationship]?.negotiationFlexibility || 0,
      score: Number(a.competitivenessScore) * 0.6 + (Number(a.competitivenessScore) < 80 ? 0 : 20),
    }));
    return scored.reduce((best, s) => s.score > best.score ? s : best)?.name || analysis[0].name;
  }

  _calculateSuccessProbability(flexibility, seasonalBoost, isOverpriced) {
    let prob = 0.5 + (flexibility * 0.3) + (seasonalBoost * 0.2);
    if (isOverpriced) prob += 0.15;
    return Math.min(0.95, prob);
  }

  _selectNegotiationApproach(flexibility, overpricing) {
    if (flexibility > 0.40 && overpricing > 10) return 'AGGRESSIVE (Data-driven benchmarking)';
    if (flexibility > 0.30 && overpricing > 5) return 'BALANCED (Win-win partnership)';
    return 'COLLABORATIVE (Volume commitment for discount)';
  }

  _generateNegotiationScript(supplier, current, target, category, benchmark, relationship, savings) {
    return `
1. OPENING: "Thank you for your proposal at ${current.toFixed(0)} RM. We value our partnership."

2. JUSTIFICATION: "Industry benchmark for ${category} is ${benchmark.avgPrice.toFixed(0)} RM. We've received competitive quotes at similar pricing."

3. BUSINESS CASE: "If we commit to 12-month volume, your margin expands even at ${target.toFixed(0)} RM. This represents ~${savings.toFixed(0)} RM in combined value."

4. PROPOSAL: "We'd like to secure your rate at ${target.toFixed(0)} RM (${((current - target) / current * 100).toFixed(1)}% reduction). 
   In exchange, we guarantee ${relationship === 'NEW' ? 'trial order' : 'expanded volume'}."

5. CLOSE: "Can we lock this in for Q2? This protects both our businesses during commodity volatility."
    `;
  }

  _calculateOpportunityPriority(plan) {
    const annualBenefit = Number(plan.negotiationTarget.annualBenefit);
    const successProb = Number(plan.negotiationStrategy.successProbability) / 100;
    const expectedValue = annualBenefit * successProb;

    if (expectedValue > 50000) return 'CRITICAL';
    if (expectedValue > 20000) return 'HIGH';
    if (expectedValue > 5000) return 'MEDIUM';
    return 'LOW';
  }

  _getCurrentQuarter() {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return 'Q1';
    if (month <= 6) return 'Q2';
    if (month <= 9) return 'Q3';
    return 'Q4';
  }
}

export default SupplierNegotiationEngine;
