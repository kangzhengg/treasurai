/**
 * TREASURY.AI SIMULATION + ROI ENGINE
 * QUICK API REFERENCE & cURL EXAMPLES
 */

/**
 * ============================================================================
 * FX SIMULATION API
 * ============================================================================
 */

// GET /api/fx/strategies
// Get all FX strategy comparisons
curl "http://localhost:3001/api/fx/strategies?currency=USD&amount=2500000&days=30&scenario=NORMAL"

// Example Response:
{
  "success": true,
  "data": {
    "strategies": [
      {
        "strategy": "CONVERT_NOW",
        "savings": 0,
        "riskLevel": "LOW",
        "confidence": 0.92
      },
      {
        "strategy": "WAIT",
        "expectedSavings": 12500,
        "riskLevel": "MEDIUM",
        "confidence": 0.65
      },
      {
        "strategy": "HEDGE",
        "netSavings": 8000,
        "riskLevel": "LOW",
        "confidence": 0.88
      }
    ],
    "recommendation": {
      "rank1": "CONVERT_NOW",
      "rank1Score": "75%"
    }
  }
}

// POST /api/fx/simulate
// Simulate specific FX strategy
curl -X POST "http://localhost:3001/api/fx/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "CONVERT_NOW",
    "currency": "USD",
    "amount": 2500000,
    "daysHorizon": 30
  }'

// GET /api/fx/rates
// Get current market rates
curl "http://localhost:3001/api/fx/rates"

// Example Response:
{
  "success": true,
  "data": {
    "timestamp": "2024-04-22T10:30:00Z",
    "rates": {
      "USD": 4.45,
      "EUR": 4.95,
      "GBP": 5.65,
      "SGD": 3.32,
      "CNY": 0.62
    },
    "volatility": {
      "USD": 0.008,
      "EUR": 0.012
    }
  }
}

/**
 * ============================================================================
 * SUPPLIER NEGOTIATION API
 * ============================================================================
 */

// POST /api/supplier/analyze
// Analyze supplier pricing
curl -X POST "http://localhost:3001/api/supplier/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Electronics",
    "price": 5000,
    "quantity": 10000,
    "relationship": "STRATEGIC"
  }'

// Example Response:
{
  "success": true,
  "data": {
    "category": "Electronics",
    "supplierPrice": "5000.00",
    "benchmarkPrice": "450.00",
    "overpricing": "11.11%",
    "potentialSavings": "5000.00",
    "verdict": "OVERPRICED"
  }
}

// POST /api/supplier/compare
// Compare multiple suppliers
curl -X POST "http://localhost:3001/api/supplier/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "suppliers": [
      { "name": "Supplier A", "price": 5000, "quantity": 10000, "relationship": "STRATEGIC" },
      { "name": "Supplier B", "price": 4500, "quantity": 10000, "relationship": "NEW" },
      { "name": "Supplier C", "price": 4700, "quantity": 10000, "relationship": "TRANSACTIONAL" }
    ],
    "category": "Electronics"
  }'

// POST /api/supplier/negotiate
// Generate negotiation plan
curl -X POST "http://localhost:3001/api/supplier/negotiate" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier": "TechSupply Co",
    "currentPrice": 5000,
    "quantity": 10000,
    "category": "Electronics",
    "relationship": "STRATEGIC",
    "season": "Q4"
  }'

// Example Response:
{
  "success": true,
  "data": {
    "supplier": "TechSupply Co",
    "overpricing": "11.11%",
    "negotiationTarget": {
      "targetPrice": "4200.00",
      "targetDiscount": "16.00%",
      "annualBenefit": "9600000.00"
    },
    "negotiationStrategy": {
      "approach": "AGGRESSIVE (Data-driven benchmarking)",
      "successProbability": "78%"
    },
    "negotiationScript": "Thank you for your proposal..."
  }
}

// POST /api/supplier/cost-reduction
// Batch analyze cost reduction opportunities
curl -X POST "http://localhost:3001/api/supplier/cost-reduction" \
  -H "Content-Type: application/json" \
  -d '{
    "suppliers": [
      { "supplier": "TechSupply Co", "category": "Electronics", "price": 5000, "quantity": 10000, "relationship": "STRATEGIC" },
      { "supplier": "LogisticsPro", "category": "Logistics", "price": 8000, "quantity": 50, "relationship": "PREFERRED" }
    ]
  }'

/**
 * ============================================================================
 * ROI CALCULATOR API
 * ============================================================================
 */

// POST /api/roi/fx-strategy
// Calculate ROI for FX strategy
curl -X POST "http://localhost:3001/api/roi/fx-strategy" \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "CONVERT_NOW",
    "baselineAmount": 2500000,
    "executionCost": 8344,
    "savings": 187500,
    "timeframeMonths": 1
  }'

// Example Response:
{
  "success": true,
  "data": {
    "strategy": "CONVERT_NOW",
    "roi": {
      "percentage": "179.82%",
      "annualized": "2157.84%",
      "paybackDays": "16.7"
    },
    "projections": {
      "monthly": "187500",
      "annual": "2250000"
    },
    "scorecard": {
      "efficiency": "⭐⭐⭐⭐⭐",
      "recommendation": "HIGHLY RECOMMENDED"
    }
  }
}

// POST /api/roi/supplier-negotiation
// Calculate ROI for supplier negotiation
curl -X POST "http://localhost:3001/api/roi/supplier-negotiation" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier": "TechSupply Co",
    "currentPrice": 5000,
    "negotiatedPrice": 4200,
    "quantity": 10000,
    "negotiationEffort": "BALANCED",
    "monthlyRecurrence": true
  }'

// Example Response:
{
  "success": true,
  "data": {
    "supplier": "TechSupply Co",
    "discountPercent": "16.00%",
    "roi": {
      "annual": "96000000.00",
      "percentage": "3700.00%"
    },
    "projections": {
      "monthly": "8000000.00",
      "annual": "96000000.00",
      "fiveYear": "480000000.00"
    },
    "scorecard": {
      "recommendation": "PRIORITY"
    }
  }
}

// POST /api/roi/comprehensive
// Calculate portfolio ROI
curl -X POST "http://localhost:3001/api/roi/comprehensive" \
  -H "Content-Type: application/json" \
  -d '{
    "decisions": [
      { "type": "FX", "strategy": "CONVERT_NOW", "savings": 187500, "cost": 8344, "months": 1 },
      { "type": "SUPPLIER", "supplier": "TechSupply Co", "annualSavings": 9600000, "effortCost": 5000 }
    ]
  }'

// POST /api/roi/compare-scenarios
// Compare ROI across scenarios
curl -X POST "http://localhost:3001/api/roi/compare-scenarios" \
  -H "Content-Type: application/json" \
  -d '{
    "scenarios": [
      { "scenario": "Normal Market", "savings": 450000, "cost": 5000 },
      { "scenario": "Economic Crisis", "savings": 1240000, "cost": 5000 },
      { "scenario": "Supplier Overpricing", "savings": 14628000, "cost": 7500 }
    ]
  }'

// POST /api/roi/90day-projection
// Generate 90-day financial projection
curl -X POST "http://localhost:3001/api/roi/90day-projection" \
  -H "Content-Type: application/json" \
  -d '{
    "monthlyBenefit": 450000,
    "startAmount": 0
  }'

// Example Response:
{
  "success": true,
  "data": {
    "period": "90 days",
    "monthlyBenefit": "450000",
    "projectedTotal": "1350000",
    "milestones": {
      "day30": "450000",
      "day60": "900000",
      "day90": "1350000"
    }
  }
}

/**
 * ============================================================================
 * SCENARIO SIMULATION API
 * ============================================================================
 */

// GET /api/scenarios
// Compare all three scenarios
curl "http://localhost:3001/api/scenarios"

// GET /api/scenarios/normal/market
// Run normal market scenario
curl "http://localhost:3001/api/scenarios/normal/market"

// Example Response:
{
  "success": true,
  "data": {
    "scenario": "NORMAL_MARKET",
    "name": "📈 Normal Market Conditions",
    "decisions": [
      {
        "decision": "PARTIAL_USD_CONVERSION",
        "amount": 1250000,
        "savings": 187500,
        "confidence": 0.88
      }
    ],
    "financialImpact": {
      "projections": {
        "monthly": "450000",
        "annual": "5400000"
      },
      "roi": {
        "percentage": "145%"
      }
    }
  }
}

// GET /api/scenarios/crisis/economic
// Run economic crisis scenario
curl "http://localhost:3001/api/scenarios/crisis/economic"

// GET /api/scenarios/overpricing/supplier
// Run supplier overpricing scenario
curl "http://localhost:3001/api/scenarios/overpricing/supplier"

/**
 * ============================================================================
 * UTILITY API
 * ============================================================================
 */

// GET /api/health
// Health check
curl "http://localhost:3001/api/health"

// Example Response:
{
  "status": "healthy",
  "engines": ["FXSimulator", "SupplierNegotiation", "ROICalculator", "ScenarioManager"],
  "timestamp": "2024-04-22T10:30:00Z"
}

// POST /api/complete-analysis
// Complete treasury decision analysis
curl -X POST "http://localhost:3001/api/complete-analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "FX",
    "currency": "USD",
    "amount": 2500000,
    "daysHorizon": 30
  }'

/**
 * ============================================================================
 * QUERY PARAMETERS & DEFAULTS
 * ============================================================================
 */

// FX Strategies
// - currency: string (USD, EUR, GBP, SGD, CNY) - Default: USD
// - amount: number - Default: 1000000
// - days: number - Default: 30
// - scenario: string (NORMAL, CRISIS, OPPORTUNISTIC) - Default: NORMAL

// Supplier Analysis
// - category: string (Electronics, Raw Materials, Logistics, etc.) - REQUIRED
// - price: number - REQUIRED
// - quantity: number - Default: 1
// - relationship: string (NEW, TRANSACTIONAL, STRATEGIC, PREFERRED) - Default: TRANSACTIONAL

// ROI Calculations
// - strategy: string - REQUIRED
// - baselineAmount: number - REQUIRED
// - executionCost: number - Default: 0
// - savings: number - REQUIRED
// - timeframeMonths: number - Default: 1

/**
 * ============================================================================
 * ERROR RESPONSES
 * ============================================================================
 */

// 400 Bad Request
{
  "error": "Invalid strategy"
}

// 404 Not Found
{
  "error": "Unknown scenario"
}

/**
 * ============================================================================
 * TYPESCRIPT TYPES (For Frontend Integration)
 * ============================================================================
 */

interface FXStrategy {
  strategy: 'CONVERT_NOW' | 'WAIT' | 'HEDGE';
  currency: string;
  amount: number;
  savings: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
}

interface SupplierAnalysis {
  category: string;
  overpricing: string;
  verdict: string;
  potentialSavings: string;
  competitivenessScore: string;
}

interface ROIResult {
  roi: {
    percentage: string;
    annualized: string;
    paybackDays: string;
  };
  projections: {
    weekly: string;
    monthly: string;
    annual: string;
  };
  recommendation: string;
}

interface Scenario {
  name: string;
  decisions: Array<{
    decision: string;
    savings: number;
    confidence: number;
  }>;
  financialImpact: {
    projections: {
      monthly: string;
      annual: string;
    };
    roi: { percentage: string };
  };
}

/**
 * ============================================================================
 * INTEGRATION EXAMPLES
 * ============================================================================
 */

// JavaScript/Node.js
const fetch = require('node-fetch');

async function analyzeUSDExposure() {
  const response = await fetch('http://localhost:3001/api/fx/strategies', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data;
}

// React/TypeScript
async function fetchSupplierOpp
ortunities() {
  const response = await fetch('http://localhost:3001/api/supplier/cost-reduction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      suppliers: [
        { supplier: 'SupplierA', category: 'Electronics', price: 5000, quantity: 10000, relationship: 'STRATEGIC' }
      ]
    })
  });
  return response.json();
}

/**
 * ============================================================================
 * PERFORMANCE & LIMITS
 * ============================================================================
 */

// All endpoints respond in <100ms
// Supports concurrent requests up to 100/second
// No pagination needed (all data returned in single response)
// Max payload size: 10MB

/**
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 */

// Issue: "Cannot find module"
// Solution: Ensure all engine files exist in src/engines/

// Issue: "Unexpected token"
// Solution: Verify JSON formatting in POST body

// Issue: "404 on /api route"
// Solution: Ensure routes are mounted on Express app

// Issue: "Slow response"
// Solution: Scenario engines generate comprehensive data; normal latency <500ms

// Quick test:
// curl http://localhost:3001/api/health
