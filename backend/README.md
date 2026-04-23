# 🔥 SIMULATION + ROI ENGINE
**Member 5 – Treasury Management Simulation & Financial Impact Engine**

This is the financial simulation and ROI calculation engine that powers Treasury.ai's decision intelligence. It simulates FX strategies, supplier negotiations, and three realistic market scenarios with measurable financial impact.

---

## 📊 CORE ENGINES

### 1️⃣ FX Simulation Engine (`fx_simulator.js`)
Simulates foreign exchange strategies and their financial outcomes.

**Methods:**
- `simulateConvertNow(currency, amount, daysHorizon)` - Execute conversion immediately
- `simulateWait(currency, amount, daysHorizon)` - Delay hoping for rate improvement
- `simulateHedge(currency, amount, daysHorizon)` - Use forwards/options to limit downside
- `compareStrategies(currency, amount, daysHorizon)` - Rank all 3 strategies

**Output:**
```javascript
{
  strategy: 'CONVERT_NOW',
  currency: 'USD',
  amount: 1250000,
  currentRate: 4.45,
  executionCost: 5562500,
  fxFee: 8344,
  netCost: 5570844,
  savings: 0,
  riskLevel: 'LOW',
  confidence: 0.92,
  reasoning: "Convert 1.25M USD at 4.45 RM/USD..."
}
```

**Real Rates (Malaysian context):**
- USD: 4.45 RM (volatile 0.8%)
- EUR: 4.95 RM (volatile 1.2%)
- GBP: 5.65 RM (volatile 1.5%)
- SGD: 3.32 RM (volatile 0.7%)
- CNY: 0.62 RM (volatile 0.5%)

---

### 2️⃣ Supplier Negotiation Engine (`supplier_negotiation.js`)
Analyzes supplier pricing and generates data-driven negotiation strategies.

**Methods:**
- `analyzeSupplierPrice(category, price, quantity, relationship)` - Compare against benchmark
- `compareSuppliers(suppliers, category)` - Rank suppliers, identify best cost
- `generateNegotiationPlan(supplier, price, quantity, category, relationship, season)` - Create negotiation script
- `analyzeCostReductionOpportunity(catalog)` - Batch analyze multiple suppliers

**Market Benchmarks:**
| Category | Avg Price | Margin | Volatility |
|----------|-----------|--------|-----------|
| Electronics | RM 450 | 35% | 12% |
| Raw Materials | RM 320 | 25% | 20% |
| Logistics | RM 80 | 30% | 8% |
| Software Licenses | RM 1,200 | 50% | 5% |
| Consulting Services | RM 150 | 55% | 10% |
| Manufacturing | RM 200 | 40% | 15% |
| Maintenance | RM 100 | 35% | 7% |

**Output Example:**
```javascript
{
  supplier: 'TechSupply Co',
  currentPrice: 5000,
  benchmarkPrice: 4500,
  overpricing: '11.11%',
  isDeal: false,
  isOverpriced: true,
  potentialSavings: 5000,
  verdict: 'OVERPRICED',
  competitivenessScore: '88%'
}
```

**Negotiation Plan:**
```javascript
{
  negotiationTarget: {
    targetPrice: 4200,
    targetDiscount: '16.00%',
    savingsIfSuccessful: 8000,
    annualBenefit: 96000
  },
  negotiationStrategy: {
    approach: 'AGGRESSIVE (Data-driven benchmarking)',
    successProbability: '78%',
    fallbackDiscount: '9.60%',
    fallbackPrice: 4520
  },
  negotiationScript: "Thank you for your proposal at 5000 RM..."
}
```

---

### 3️⃣ ROI Calculator Engine (`roi_calculator.js`)
Calculates financial returns on treasury decisions with multiple timeframe projections.

**Methods:**
- `calculateFXStrategyROI(strategy, baseline, cost, savings, months)` - FX decision ROI
- `calculateSupplierNegotiationROI(supplier, current, negotiated, qty, effort, recurring)` - Supplier ROI
- `calculateComprehensiveROI(decisions)` - Portfolio ROI across all decisions
- `compareROIScenarios(scenarios)` - Rank scenarios by ROI
- `generate90DayProjection(monthlyBenefit)` - Day-by-day projection

**Output Example (FX Strategy ROI):**
```javascript
{
  strategy: 'CONVERT_NOW',
  timeframe: '1 month',
  baseline: 1250000,
  executionCost: 8344,
  grossSavings: 15000,
  netSavings: 6656,
  
  roi: {
    percentage: '179.82%',
    annualized: '2157.84%',
    paybackDays: '16.7'
  },
  
  projections: {
    weekly: 3488,
    monthly: 15000,
    quarterly: 45000,
    semiAnnual: 90000,
    annual: 180000
  },
  
  scorecard: {
    efficiency: '⭐⭐⭐⭐⭐',
    timeToValue: 'Quick (< 30 days)',
    recommendation: 'HIGHLY RECOMMENDED'
  }
}
```

---

### 4️⃣ Scenario Manager (`scenario_manager.js`)
Simulates three realistic market scenarios with complete decision recommendations.

**Scenarios:**

#### A) 📈 Normal Market Conditions
- **FX Volatility:** Low (±0.8%)
- **Trend:** Stable
- **Recommendations:** BALANCED approach
- **Annual Savings:** ~450,000 RM
- **ROI:** 145%
- **Confidence:** 88%

```javascript
{
  scenario: 'NORMAL_MARKET',
  decisions: [
    {
      id: 1,
      decision: 'PARTIAL_USD_CONVERSION',
      action: 'Convert 50% of USD payables now, delay 50%',
      amount: 1250000,
      currency: 'USD',
      savings: 187500,
      risk: 'LOW',
      confidence: 0.88
    }
  ],
  financialImpact: {
    immediateImpact: { savingsThisMonth: 450000 },
    projections: {
      monthly: 450000,
      annual: 5400000
    },
    roi: {
      percentage: '145%',
      paybackDays: '8 days',
      recommendation: 'IMPLEMENT'
    }
  }
}
```

#### B) 🔴 Economic Crisis
- **FX Volatility:** CRITICAL (3-4% daily swings)
- **Trend:** USD spike, emerging currencies weaken
- **Recommendations:** DEFENSIVE (hedge, preserve cash)
- **Annual Savings:** ~1,240,000 RM
- **ROI:** 267%
- **Confidence:** 94%
- **Decision:** Hedge 100% USD exposure

```javascript
{
  scenario: 'ECONOMIC_CRISIS',
  decisions: [
    {
      id: 1,
      decision: 'HEDGE_USD_EXPOSURE',
      action: 'HEDGE 100% USD payables with forward contracts',
      amount: 2500000,
      savings: 875000,
      hedgeCost: 44000,
      netSavings: 831000,
      confidence: 0.94
    }
  ],
  warningFlags: [
    '⚠️ Corporate bond spreads widen',
    '⚠️ Credit default swaps spike',
    '⚠️ Bank lending tightens'
  ]
}
```

#### C) 💰 Supplier Overpricing Detected
- **Opportunity:** Suppliers 14-16% above market average
- **Market Context:** Buyer market (excess supply)
- **Recommendations:** AGGRESSIVE negotiation
- **Annual Savings:** ~14,628,000 RM
- **ROI:** 64,900%+
- **Success Probability:** 72%

```javascript
{
  scenario: 'SUPPLIER_OVERPRICING',
  supplierAnalysis: [
    {
      supplier: 'TechSupply Co',
      overpricing: 15.6,
      opportunitySavings: 8400000
    }
  ],
  decisions: [
    {
      id: 1,
      decision: 'AGGRESSIVE_RENEGOTIATION',
      supplier: 'TechSupply Co',
      savingsTarget: 7200000,
      discountPercentage: 11.5,
      successProbability: '78%'
    }
  ]
}
```

---

## 🔗 API ENDPOINTS

### FX Simulation
```
GET    /api/fx/strategies?currency=USD&amount=1000000&days=30&scenario=NORMAL
POST   /api/fx/simulate
GET    /api/fx/rates
```

### Supplier Negotiation
```
POST   /api/supplier/analyze
POST   /api/supplier/compare
POST   /api/supplier/negotiate
POST   /api/supplier/cost-reduction
```

### ROI Calculation
```
POST   /api/roi/fx-strategy
POST   /api/roi/supplier-negotiation
POST   /api/roi/comprehensive
POST   /api/roi/compare-scenarios
POST   /api/roi/90day-projection
```

### Scenarios
```
GET    /api/scenarios
GET    /api/scenarios/normal/market
GET    /api/scenarios/crisis/economic
GET    /api/scenarios/overpricing/supplier
```

### Utilities
```
GET    /api/health
POST   /api/complete-analysis
```

---

## 💡 KEY FEATURES

### ✅ Real Financial Modeling
- Uses actual Malaysian currency (RM) and rates
- Market benchmarks for 7+ commodity/service categories
- Realistic volatility and trend modeling
- Supplier relationship factors

### ✅ Explainable Output
- Every decision includes reasoning
- Shows calculation methodology
- Transparent assumption disclosure
- Confidence scores on all recommendations

### ✅ Multiple Scenario Support
- Normal market conditions
- Economic crisis / FX spike scenarios
- Supplier overpricing opportunities
- Seasonal factors & market windows

### ✅ Measurable Financial Impact
- Real RM savings (not %)
- Monthly, quarterly, annual projections
- ROI calculations with payback periods
- Expected value across scenarios

### ✅ Demo Storytelling
- Three compelling scenarios showing different AI decision-making
- Crisis management capabilities
- Huge cost savings opportunities (14M+ RM)
- Measurable, impressive KPIs

---

## 🎯 USAGE EXAMPLES

### Example 1: FX Strategy Analysis
```javascript
const engines = require('./src/engines');

// Compare all FX strategies for USD exposure
const comparison = engines.compareForexStrategies(
  'USD',
  1000000,  // amount
  30,       // days horizon
  'NORMAL'  // market scenario
);

console.log(comparison);
/* Output:
{
  strategies: [
    { strategy: 'CONVERT_NOW', savings: 0, risk: 'LOW' },
    { strategy: 'WAIT', savings: 12500, risk: 'MEDIUM' },
    { strategy: 'HEDGE', savings: 8000, risk: 'LOW' }
  ],
  recommendation: {
    rank1: 'CONVERT_NOW',
    rank1Score: '75%'
  }
}
*/
```

### Example 2: Supplier Negotiation Plan
```javascript
const plan = engines.supplierNegotiation.generateNegotiationPlan(
  'TechSupply Co',
  5000,           // current price per unit
  10000,          // quantity (annual)
  'Electronics',
  'STRATEGIC',
  'Q4'            // year-end opportunity
);

console.log(plan);
/* Output:
{
  supplier: 'TechSupply Co',
  overpricing: '11.11%',
  negotiationTarget: {
    targetPrice: 4200,
    targetDiscount: '16.00%',
    annualBenefit: 8000000
  },
  negotiationScript: "Thank you for your proposal..."
}
*/
```

### Example 3: Scenario Comparison
```javascript
const scenarios = engines.generateScenarioComparison();

console.log(scenarios);
/* Output:
{
  scenarios: [
    { name: '📈 Normal Market', savings: '450000', roi: '145%' },
    { name: '🔴 Economic Crisis', savings: '1240000', roi: '267%' },
    { name: '💰 Supplier Overpricing', savings: '14628000', roi: '64900%' }
  ],
  summary: {
    expectedValue: '5430000',
    recommendation: 'Implement all across scenarios'
  }
}
*/
```

---

## 🚀 INTEGRATION

### With Express Server
```javascript
const express = require('express');
const simulationRoutes = require('./src/routes/simulationRoutes');

const app = express();
app.use(express.json());

// Mount simulation routes
app.use('/api', simulationRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### With GLM Decision Engine
```javascript
const engines = require('./src/engines');
const { GLMDecisionEngine } = require('../glm');

// 1. GLM generates decision recommendations
const glmRecommendations = await glm.processFinancialData({...});

// 2. Simulation engine calculates financial impact
const roiAnalysis = engines.roiCalculator.calculateComprehensiveROI(glmRecommendations);

// 3. Return to frontend with impact metrics
res.json({
  decisions: glmRecommendations,
  financialImpact: roiAnalysis
});
```

---

## 📈 DASHBOARD KPI CARDS

The engine generates real KPI cards for dashboard visualization:

```javascript
// Generate 90-day projection
const projection = engines.generate90DayProjection(450000);

// Day 30: RM 450,000 saved
// Day 60: RM 900,000 cumulative
// Day 90: RM 1,350,000 cumulative

// KPI card for dashboard
const kpi = engines.roiCalculator.generateKPICard(
  'Monthly Treasury Savings',
  450000,
  'RM',
  'up',
  45000  // variance from baseline
);

// Output: "↑ 450000 RM"
```

---

## 🧪 TESTING

Run individual engines:

```javascript
// Test FX Engine
console.log('FX Simulator:', engines.fxSimulator.getCurrentRates());

// Test Supplier Engine
console.log('Supplier Analysis:', engines.analyzeSupplier('Electronics', 5000, 100));

// Test ROI Engine
console.log('ROI Calculation:', engines.roiCalculator.generate90DayProjection(450000));

// Test Scenarios
console.log('All Scenarios:', engines.generateScenarioComparison());
```

---

## 🔮 FUTURE ENHANCEMENTS

- ✅ Machine learning to improve success probability estimates
- ✅ Integration with real-time FX APIs
- ✅ Supplier credit rating integration
- ✅ Portfolio optimization across all decisions
- ✅ Monte Carlo simulation for downside scenarios
- ✅ Real-time market news correlation

---

**Built by Member 5 - Treasury Simulation & ROI Engine Specialist** 🔥
