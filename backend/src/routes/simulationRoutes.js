/**
 * Simulation + ROI Engine API Routes
 * Exposes all simulation engines via REST API
 */

import express from 'express';
import engines from '../engines/index.js';

const router = express.Router();

// ============= FX SIMULATION ROUTES =============

/**
 * GET /api/fx/strategies - Get all FX strategy comparisons
 */
router.get('/fx/strategies', (req, res) => {
  try {
    const { currency = 'USD', amount = 1000000, days = 30, scenario = 'NORMAL' } = req.query;

    const comparison = engines.compareForexStrategies(
      currency,
      Number(amount),
      Number(days),
      scenario
    );

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/fx/simulate - Simulate specific FX strategy
 * Body: { strategy: 'CONVERT_NOW'|'WAIT'|'HEDGE', currency, amount, daysHorizon }
 */
router.post('/fx/simulate', (req, res) => {
  try {
    const { strategy, currency, amount, daysHorizon = 30 } = req.body;

    let result;
    switch (strategy.toUpperCase()) {
      case 'CONVERT_NOW':
        result = engines.fxSimulator.simulateConvertNow(currency, amount, daysHorizon);
        break;
      case 'WAIT':
        result = engines.fxSimulator.simulateWait(currency, amount, daysHorizon);
        break;
      case 'HEDGE':
        result = engines.fxSimulator.simulateHedge(currency, amount, daysHorizon);
        break;
      default:
        return res.status(400).json({ error: 'Invalid strategy' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fx/rates - Get current market rates
 */
router.get('/fx/rates', (req, res) => {
  try {
    const rates = engines.fxSimulator.getCurrentRates();
    res.json({ success: true, data: rates });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= SUPPLIER NEGOTIATION ROUTES =============

/**
 * POST /api/supplier/analyze - Analyze supplier pricing
 * Body: { category, price, quantity, relationship }
 */
router.post('/supplier/analyze', (req, res) => {
  try {
    const { category, price, quantity = 1, relationship = 'TRANSACTIONAL' } = req.body;

    const analysis = engines.analyzeSupplier(category, price, quantity, relationship);

    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/supplier/compare - Compare multiple suppliers
 * Body: { suppliers: [...], category }
 */
router.post('/supplier/compare', (req, res) => {
  try {
    const { suppliers, category } = req.body;

    const comparison = engines.supplierNegotiation.compareSuppliers(suppliers, category);

    res.json({ success: true, data: comparison });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/supplier/negotiate - Generate negotiation plan
 * Body: { supplier, currentPrice, quantity, category, relationship, season }
 */
router.post('/supplier/negotiate', (req, res) => {
  try {
    const {
      supplier,
      currentPrice,
      quantity,
      category,
      relationship = 'TRANSACTIONAL',
      season = 'Q1',
    } = req.body;

    const plan = engines.supplierNegotiation.generateNegotiationPlan(
      supplier,
      currentPrice,
      quantity,
      category,
      relationship,
      season
    );

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/supplier/cost-reduction - Batch analyze cost reduction opportunity
 * Body: { suppliers: [...] }
 */
router.post('/supplier/cost-reduction', (req, res) => {
  try {
    const { suppliers } = req.body;

    const analysis = engines.supplierNegotiation.analyzeCostReductionOpportunity(suppliers);

    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= ROI CALCULATOR ROUTES =============

/**
 * POST /api/roi/fx-strategy - Calculate ROI for FX strategy
 * Body: { strategy, baselineAmount, executionCost, savings, timeframeMonths }
 */
router.post('/roi/fx-strategy', (req, res) => {
  try {
    const {
      strategy,
      baselineAmount,
      executionCost,
      savings,
      timeframeMonths = 1,
    } = req.body;

    const roi = engines.roiCalculator.calculateFXStrategyROI(
      strategy,
      baselineAmount,
      executionCost,
      savings,
      timeframeMonths
    );

    res.json({ success: true, data: roi });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/roi/supplier-negotiation - Calculate ROI for supplier negotiation
 * Body: { supplier, currentPrice, negotiatedPrice, quantity, negotiationEffort, monthlyRecurrence }
 */
router.post('/roi/supplier-negotiation', (req, res) => {
  try {
    const {
      supplier,
      currentPrice,
      negotiatedPrice,
      quantity,
      negotiationEffort = 'BALANCED',
      monthlyRecurrence = true,
    } = req.body;

    const roi = engines.roiCalculator.calculateSupplierNegotiationROI(
      supplier,
      currentPrice,
      negotiatedPrice,
      quantity,
      negotiationEffort,
      monthlyRecurrence
    );

    res.json({ success: true, data: roi });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/roi/comprehensive - Calculate comprehensive ROI across multiple decisions
 * Body: { decisions: [...] }
 */
router.post('/roi/comprehensive', (req, res) => {
  try {
    const { decisions } = req.body;

    const roi = engines.calculatePortfolioROI(decisions);

    res.json({ success: true, data: roi });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/roi/compare-scenarios - Compare ROI across scenarios
 * Body: { scenarios: [...] }
 */
router.post('/roi/compare-scenarios', (req, res) => {
  try {
    const { scenarios } = req.body;

    const comparison = engines.roiCalculator.compareROIScenarios(scenarios);

    res.json({ success: true, data: comparison });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/roi/90day-projection - Generate 90-day financial projection
 * Body: { monthlyBenefit, startAmount }
 */
router.post('/roi/90day-projection', (req, res) => {
  try {
    const { monthlyBenefit, startAmount = 0 } = req.body;

    const projection = engines.generate90DayProjection(monthlyBenefit, startAmount);

    res.json({ success: true, data: projection });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= SCENARIO SIMULATION ROUTES =============

/**
 * GET /api/scenarios - Compare all three scenarios
 */
router.get('/scenarios', (req, res) => {
  try {
    const comparison = engines.generateScenarioComparison();
    res.json({ success: true, data: comparison });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/scenarios/:scenarioName - Run specific scenario
 * Params: scenarioName = 'NORMAL'|'CRISIS'|'OVERPRICING'
 */
router.get('/scenarios/:scenarioName', (req, res) => {
  try {
    const { scenarioName } = req.params;
    const scenario = engines.runScenario(scenarioName);

    if (scenario.error) {
      return res.status(404).json({ error: scenario.error });
    }

    res.json({ success: true, data: scenario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/scenarios/normal/market - Run normal market scenario
 */
router.get('/scenarios/normal/market', (req, res) => {
  try {
    const scenario = engines.scenarioManager.simulateNormalMarket();
    res.json({ success: true, data: scenario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/scenarios/crisis/economic - Run economic crisis scenario
 */
router.get('/scenarios/crisis/economic', (req, res) => {
  try {
    const scenario = engines.scenarioManager.simulateEconomicCrisis();
    res.json({ success: true, data: scenario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/scenarios/overpricing/supplier - Run supplier overpricing scenario
 */
router.get('/scenarios/overpricing/supplier', (req, res) => {
  try {
    const scenario = engines.scenarioManager.simulateSupplierOverpricing();
    res.json({ success: true, data: scenario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= HEALTH & UTILITY ROUTES =============

/**
 * GET /api/health - Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    engines: ['FXSimulator', 'SupplierNegotiation', 'ROICalculator', 'ScenarioManager'],
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/complete-analysis - Complete treasury decision analysis
 * Body: complete decision object
 */
router.post('/complete-analysis', (req, res) => {
  try {
    const decision = req.body;
    const analysis = engines.analyzeCompleteTreasuryDecision(decision);

    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
