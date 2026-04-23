/**
 * Simulation + ROI Engine Index
 * Exports all four core engines for use in the treasury management system
 */

import FXSimulator from './fx_simulator.js';
import SupplierNegotiationEngine from './supplier_negotiation.js';
import ROICalculator from './roi_calculator.js';
import ScenarioManager from './scenario_manager.js';

// Initialize all engines
const fxSimulator = new FXSimulator();
const supplierNegotiation = new SupplierNegotiationEngine();
const roiCalculator = new ROICalculator();
const scenarioManager = new ScenarioManager();

export default {
  // Engines
  FXSimulator,
  SupplierNegotiationEngine,
  ROICalculator,
  ScenarioManager,

  // Instances
  fxSimulator,
  supplierNegotiation,
  roiCalculator,
  scenarioManager,

  // Convenience methods
  
  /**
   * Run complete analysis for treasury decision
   */
  analyzeCompleteTreasuryDecision: (decision) => {
    // decision = { type: 'FX', currency: 'USD', amount: 1000000, daysHorizon: 30 }
    const analysis = {};

    if (decision.type === 'FX') {
      analysis.fxStrategies = fxSimulator.compareStrategies(
        decision.currency,
        decision.amount,
        decision.daysHorizon || 30
      );
    }

    if (decision.type === 'SUPPLIER') {
      analysis.negotiation = supplierNegotiation.generateNegotiationPlan(
        decision.supplier,
        decision.currentPrice,
        decision.quantity,
        decision.category,
        decision.relationship || 'TRANSACTIONAL'
      );
    }

    // Calculate ROI
    if (analysis.fxStrategies) {
      const recommendedStrategy = analysis.fxStrategies.recommendation.rank1;
      const strategy = analysis.fxStrategies.strategies.find(s => s.strategy === recommendedStrategy);
      analysis.roi = roiCalculator.calculateFXStrategyROI(
        recommendedStrategy,
        decision.amount,
        strategy.fxFee || 0,
        Number(strategy.expectedSavings || 0),
        1
      );
    }

    if (analysis.negotiation) {
      analysis.roi = roiCalculator.calculateSupplierNegotiationROI(
        decision.supplier,
        decision.currentPrice,
        Number(analysis.negotiation.negotiationTarget.targetPrice),
        decision.quantity
      );
    }

    return analysis;
  },

  /**
   * Generate complete scenario comparison
   */
  generateScenarioComparison: () => {
    return scenarioManager.compareAllScenarios();
  },

  /**
   * Run individual scenario simulation
   */
  runScenario: (scenarioName) => {
    switch (scenarioName.toUpperCase()) {
      case 'NORMAL':
      case 'NORMAL_MARKET':
        return scenarioManager.simulateNormalMarket();
      case 'CRISIS':
      case 'ECONOMIC_CRISIS':
        return scenarioManager.simulateEconomicCrisis();
      case 'OVERPRICING':
      case 'SUPPLIER_OVERPRICING':
        return scenarioManager.simulateSupplierOverpricing();
      default:
        return { error: 'Unknown scenario' };
    }
  },

  /**
   * Quick FX strategy comparison
   */
  compareForexStrategies: (currency, amount, daysHorizon = 30, marketScenario = 'NORMAL') => {
    return fxSimulator.compareStrategies(currency, amount, daysHorizon, marketScenario);
  },

  /**
   * Quick supplier analysis
   */
  analyzeSupplier: (category, price, quantity = 1, relationship = 'TRANSACTIONAL') => {
    return supplierNegotiation.analyzeSupplierPrice(category, price, quantity, relationship);
  },

  /**
   * Calculate ROI for multiple decisions
   */
  calculatePortfolioROI: (decisions) => {
    return roiCalculator.calculateComprehensiveROI(decisions);
  },

  /**
   * Generate 90-day financial projection
   */
  generate90DayProjection: (monthlyBenefit, startAmount = 0) => {
    return roiCalculator.generate90DayProjection(monthlyBenefit, startAmount);
  },
};
