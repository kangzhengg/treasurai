import "dotenv/config";
import express from "express";
import cors from "cors";
import simulationRoutes from "./src/routes/simulationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Simulation Engine Routes
app.use("/api", simulationRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "Treasury.ai Simulation Engine is running 🔥",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      fx: {
        strategies: "GET /api/fx/strategies",
        simulate: "POST /api/fx/simulate",
        rates: "GET /api/fx/rates",
      },
      supplier: {
        analyze: "POST /api/supplier/analyze",
        compare: "POST /api/supplier/compare",
        negotiate: "POST /api/supplier/negotiate",
        costReduction: "POST /api/supplier/cost-reduction",
      },
      roi: {
        fxStrategy: "POST /api/roi/fx-strategy",
        supplierNegotiation: "POST /api/roi/supplier-negotiation",
        comprehensive: "POST /api/roi/comprehensive",
        compareScenarios: "POST /api/roi/compare-scenarios",
        projection90Day: "POST /api/roi/90day-projection",
      },
      scenarios: {
        all: "GET /api/scenarios",
        normal: "GET /api/scenarios/normal/market",
        crisis: "GET /api/scenarios/crisis/economic",
        overpricing: "GET /api/scenarios/overpricing/supplier",
      },
    },
    documentation: "/docs",
  });
});

// Documentation
app.get("/docs", (req, res) => {
  res.json({
    title: "Treasury.ai Simulation + ROI Engine",
    version: "1.0.0",
    description: "Financial simulation and ROI calculation engine for treasury management",
    components: [
      {
        name: "FX Simulator",
        description: "Simulate currency conversion strategies",
        file: "src/engines/fx_simulator.js",
      },
      {
        name: "Supplier Negotiation Engine",
        description: "Analyze and negotiate supplier pricing",
        file: "src/engines/supplier_negotiation.js",
      },
      {
        name: "ROI Calculator",
        description: "Calculate financial returns on decisions",
        file: "src/engines/roi_calculator.js",
      },
      {
        name: "Scenario Manager",
        description: "Simulate three market scenarios",
        file: "src/engines/scenario_manager.js",
      },
    ],
    features: [
      "Real financial modeling with Malaysian Ringgit",
      "FX rate simulations with volatility modeling",
      "Supplier price benchmarking and negotiation planning",
      "Comprehensive ROI calculations with projections",
      "Three realistic market scenarios",
      "Measurable financial impact in actual currency",
      "Complete transparency and explainability",
    ],
    quickStart: {
      1: "npm install",
      2: "cp .env.example .env",
      3: "npm run dev",
      4: "Test: curl http://localhost:3001/api/health",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  res.status(500).json({
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    availableEndpoints: "GET /",
  });
});

// ============================================================================
// SERVER START
// ============================================================================

const server = app.listen(PORT, () => {
  console.log(`\n🔥 TREASURY.AI - SIMULATION + ROI ENGINE`);
  console.log(`📊 Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/docs`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
  console.log("Engines available:");
  console.log("  ✅ FX Simulator");
  console.log("  ✅ Supplier Negotiation");
  console.log("  ✅ ROI Calculator");
  console.log("  ✅ Scenario Manager\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n⏹️  SIGTERM received. Gracefully shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n⏹️  SIGINT received. Gracefully shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export default app;
