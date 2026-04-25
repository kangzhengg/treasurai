"""
API Routes for Unified TreasurAI Engine
FastAPI routes exposing Simulation, ROI, and GLM orchestration
"""

from fastapi import APIRouter, HTTPException
from simulation.fx_simulator import FXSimulator
from simulation.roi_calculator import ROICalculator
from simulation.supplier_negotiation import SupplierNegotiationEngine
from simulation.scenario_manager import ScenarioManager
from services.analysis_controller import analyze_financials
from services import analysis_controller
from dualIntelligenceLayer_glm.glm_engine import GLMDecisionEngine
from dualIntelligenceLayer.data_ingestion import refresh_once
from pathlib import Path
from datetime import datetime, timezone
import time
from typing import Any, Dict, Optional

router = APIRouter(prefix="/api", tags=["simulation"])

# Initialize engines
fx_simulator = FXSimulator()
roi_calculator = ROICalculator()
supplier_negotiation = SupplierNegotiationEngine()
scenario_manager = ScenarioManager()
glm_engine = GLMDecisionEngine()

# In-memory toggle to help the UI demonstrate failover behavior.
# NOTE: This is intentionally ephemeral (resets on server restart).
_SIMULATE_GLM_DOWN = False

def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ============= ORCHESTRATION ROUTES (Member 4) =============

@router.post("/analyze")
def run_full_analysis(request_data: dict = None):
    """
    Member 4: Full Orchestrated Analysis
    Flow: Data -> GLM -> Simulation
    """
    try:
        # Default ERP path if not provided
        erp_path = request_data.get("erp_path", "dualIntelligenceLayer/erp_data.json") if request_data else "dualIntelligenceLayer/erp_data.json"
        result = analyze_financials(erp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============= SYSTEM / FALLBACK ROUTES =============

@router.get("/system/fallback")
def get_fallback_engine_status(include_glm_decisions: bool = False) -> Dict[str, Any]:
    """
    Provides a backend-driven status payload for the "Live System Monitoring" page.
    Uses the cached orchestration result to avoid GLM overload.
    """
    global _SIMULATE_GLM_DOWN

    # IMPORTANT: this endpoint must respond fast.
    # Prefer cached analysis; do not trigger a full analysis run here.
    started = time.time()
    cached = analysis_controller._CACHE.get("dashboard_analysis") if hasattr(analysis_controller, "_CACHE") else None
    analysis = cached[0] if isinstance(cached, tuple) and len(cached) == 2 else {}
    elapsed_ms = int((time.time() - started) * 1000)

    is_fallback = bool((analysis.get("metadata", {}) or {}).get("is_fallback", False))
    if _SIMULATE_GLM_DOWN:
        is_fallback = True

    # Derive "data freshness" from the orchestration timestamp when possible.
    fetched_at = analysis.get("timestamp") or (analysis.get("metadata", {}) or {}).get("timestamp")
    freshness_seconds: Optional[int] = None
    try:
        if isinstance(fetched_at, str) and fetched_at:
            # Best-effort parse; tolerate missing Z.
            ts = fetched_at.replace("Z", "+00:00")
            dt = datetime.fromisoformat(ts)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            freshness_seconds = max(0, int((datetime.now(timezone.utc) - dt).total_seconds()))
    except Exception:
        freshness_seconds = None

    # ERP "sync" is approximated by file mtime of the ERP JSON.
    erp_path = Path("dualIntelligenceLayer/erp_data.json")
    if not erp_path.exists():
        erp_path = Path("backend/dualIntelligenceLayer/erp_data.json")
    erp_connected = erp_path.exists()
    erp_last_sync_seconds: Optional[int] = None
    if erp_connected:
        try:
            erp_last_sync_seconds = max(0, int(time.time() - erp_path.stat().st_mtime))
        except Exception:
            erp_last_sync_seconds = None

    fallback_behaviors = [
        {
            "id": "decision-feed",
            "title": "Decision Feed",
            "activeMode": "GLM-powered real-time recommendations",
            "fallbackMode": "Using 90-day rolling averages",
            "description": "Historical pattern matching based on similar market conditions from past 90 days",
            "icon": "Activity",
            "color": "cyan",
        },
        {
            "id": "negotiation-engine",
            "title": "Negotiation Engine",
            "activeMode": "Market intelligence + competitive analysis",
            "fallbackMode": "Using historical supplier benchmarks",
            "description": "Static pricing comparisons from last benchmark update (weekly)",
            "icon": "Database",
            "color": "purple",
        },
        {
            "id": "roi-simulator",
            "title": "ROI Simulator",
            "activeMode": "Dynamic scenario modeling with live data",
            "fallbackMode": "Running static scenario models",
            "description": "Pre-computed scenarios based on historical volatility patterns",
            "icon": "Shield",
            "color": "blue",
        },
        {
            "id": "alerting-system",
            "title": "Alerting System",
            "activeMode": "Context-aware intelligent alerts",
            "fallbackMode": "Threshold-based alerts only",
            "description": "Simple rule-based triggers when metrics exceed defined limits",
            "icon": "AlertCircle",
            "color": "amber",
        },
    ]

    glm_decisions = None
    if include_glm_decisions:
        glm_decisions = (analysis.get("glm_decision", {}) or {}).get("decisions", [])
        if not isinstance(glm_decisions, list):
            glm_decisions = []
        # keep it small for the UI
        glm_decisions = glm_decisions[:3]

    return {
        "success": True,
        "timestamp_utc": _utc_now_iso(),
        "simulate_glm_down": _SIMULATE_GLM_DOWN,
        "glm_active": (not is_fallback),
        "systemStatus": {
            "apiResponseTime": {
                "value_ms": elapsed_ms,
                "threshold_ms": 200,
                "status": "healthy" if elapsed_ms < 200 else "degraded",
            },
            "erpSync": {
                "connected": erp_connected,
                "last_sync_seconds": erp_last_sync_seconds,
                "status": "healthy" if erp_connected else "failed",
            },
            "dataFreshness": {
                "freshness_seconds": freshness_seconds,
                "status": "healthy" if freshness_seconds is None or freshness_seconds < 120 else "degraded",
            },
            "glmEngine": {
                "status": "active" if (not is_fallback) else "failed",
                "mode": "ONLINE" if (not is_fallback) else "FALLBACK",
                "reason": (analysis.get("glm_decision", {}) or {}).get("metadata", {}).get("reason"),
            },
        },
        "fallbackBehaviors": fallback_behaviors,
        "glmDecisions": glm_decisions,
    }


@router.post("/system/fallback/simulate")
def set_fallback_simulation(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enables/disables in-memory GLM-down simulation for the Live System Monitoring UI.
    Body: { "simulate_glm_down": true/false }
    """
    global _SIMULATE_GLM_DOWN
    simulate = bool(request_data.get("simulate_glm_down", False))
    _SIMULATE_GLM_DOWN = simulate
    return {"success": True, "simulate_glm_down": _SIMULATE_GLM_DOWN, "timestamp_utc": _utc_now_iso()}


@router.get("/dashboard")
@router.get("/dashboard-data")
def get_dashboard_summary():
    """
    Member 4: Unified Dashboard Data
    Combines high-level metrics, latest decisions, and system health
    Supports both /dashboard and /dashboard-data as per requirements
    """
    try:
        # Run a fresh analysis for the dashboard
        analysis = analyze_financials("dualIntelligenceLayer/erp_data.json")
        
        # Calculate summary metrics
        total_savings = analysis.get("glm_decision", {}).get("projections", {}).get("yearly_savings", 0)
        is_fallback = analysis.get("metadata", {}).get("is_fallback", False)
        decisions = analysis.get("glm_decision", {}).get("decisions", [])
        
        # Compute simulated comparison data
        avg_conf = sum(d.get("confidence", 0) for d in decisions) / len(decisions) * 100 if decisions else 0
        
        comparison = {
            "previous_savings": total_savings * 0.92,  # assume previous quarter was 8% lower
            "previous_decisions_count": max(0, len(decisions) - 1),  # previous had 1 fewer pending
            "previous_monthly_savings": analysis.get("glm_decision", {}).get("projections", {}).get("monthly_savings", 0) * 0.85,
            "previous_success_rate": avg_conf * 0.95,  # previous success rate was slightly lower
        }
        
        return {
            "success": True,
            "summary": {
                "total_annual_projected_savings": total_savings,
                "active_decisions_count": len(decisions),
                "risk_status": "MONITOR" if is_fallback else "HEALTHY",
                "last_update": analysis.get("timestamp")
            },
            "comparison": comparison,
            "system_status": {
                "glm_engine": "FALLBACK" if is_fallback else "ONLINE",
                "data_engine": "ONLINE",
                "simulation_engine": "ONLINE"
            },
            "latest_analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from services.analysis_controller import simulate_scenario

@router.post("/simulate")
def run_full_simulation_flow(request_data: dict = None):
    """
    Member 4: Trade-off Simulator Endpoint
    Runs a scenario-specific GLM simulation
    """
    try:
        scenario = request_data.get("scenario") if request_data else None
        if scenario:
            return simulate_scenario(scenario)
        return run_full_analysis(request_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/refresh")
def refresh_system_data():
    """
    Member 4: Real-time update trigger
    Forces a data refresh and returns the latest state
    """
    try:
        return run_full_analysis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= FX SIMULATION ROUTES (Member 5) =============

@router.get("/fx/strategies")
def get_fx_strategies(currency: str = "USD", amount: int = 1000000, days: int = 30, scenario: str = "NORMAL"):
    """Get all FX strategy comparisons"""
    try:
        comparison = fx_simulator.compare_strategies(currency, amount, days, scenario)
        return {
            "success": True,
            "data": comparison,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/fx/simulate")
def simulate_fx_strategy(request_data: dict):
    """Simulate specific FX strategy"""
    try:
        strategy = request_data.get("strategy", "").upper()
        currency = request_data.get("currency")
        amount = request_data.get("amount")
        days_horizon = request_data.get("days_horizon", 30)

        if not all([strategy, currency, amount]):
            raise ValueError("Missing required fields: strategy, currency, amount")

        result = None
        if strategy == "CONVERT_NOW":
            result = fx_simulator.simulate_convert_now(currency, amount, days_horizon)
        elif strategy == "WAIT":
            result = fx_simulator.simulate_wait(currency, amount, days_horizon)
        elif strategy == "HEDGE":
            result = fx_simulator.simulate_hedge(currency, amount, days_horizon)
        else:
            raise ValueError("Invalid strategy")

        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/fx/rates")
def get_fx_rates():
    """Get current market rates"""
    try:
        rates = fx_simulator.get_current_rates()
        return {"success": True, "data": rates}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============= SUPPLIER NEGOTIATION ROUTES =============

@router.post("/supplier/analyze")
def analyze_supplier(request_data: dict):
    """Analyze supplier pricing"""
    try:
        category = request_data.get("category")
        price = request_data.get("price")
        quantity = request_data.get("quantity", 1)
        relationship = request_data.get("relationship", "TRANSACTIONAL")

        if not all([category, price]):
            raise ValueError("Missing required fields: category, price")

        analysis = supplier_negotiation.analyze_supplier_price(category, price, quantity, relationship)

        return {"success": True, "data": analysis}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/supplier/compare")
def compare_suppliers(request_data: dict):
    """Compare multiple suppliers"""
    try:
        suppliers = request_data.get("suppliers", [])
        category = request_data.get("category")

        if not all([suppliers, category]):
            raise ValueError("Missing required fields: suppliers, category")

        comparison = supplier_negotiation.compare_suppliers(suppliers, category)

        return {"success": True, "data": comparison}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/supplier/negotiate")
def generate_negotiation_plan(request_data: dict):
    """Generate negotiation plan"""
    try:
        supplier = request_data.get("supplier")
        current_price = request_data.get("current_price")
        quantity = request_data.get("quantity")
        category = request_data.get("category")
        relationship = request_data.get("relationship", "TRANSACTIONAL")
        season = request_data.get("season", "Q1")

        if not all([supplier, current_price, quantity, category]):
            raise ValueError("Missing required fields: supplier, current_price, quantity, category")

        # Try GLM First
        try:
            glm_plan = glm_engine.generate_supplier_negotiation(request_data)
            if glm_plan and not glm_plan.get("fallback") and not glm_plan.get("error"):
                return {"success": True, "data": glm_plan, "source": "GLM"}
        except Exception as e:
            print(f"GLM negotiation failed, falling back: {e}")

        # Fallback to simulation engine
        plan = supplier_negotiation.generate_negotiation_plan(
            supplier, current_price, quantity, category, relationship, season
        )
        
        # Format fallback plan to match UI expectations
        formatted_plan = {
            "name": plan.get("supplier"),
            "currentPrice": f"RM {plan.get('current_price')}/unit",
            "marketAverage": f"RM {plan.get('benchmark_price')}/unit",
            "overpayment": plan.get("overpricing"),
            "annualSpend": f"RM {float(plan.get('current_price', 0)) * quantity:,.0f}",
            "potentialSavings": f"RM {plan.get('negotiation_target', {}).get('annual_benefit')}",
            "relationship": plan.get("relationship"),
            "contractRenewal": "Q3 2026",
            "marketPosition": "Stable",
            "negotiationStrategy": {
                "opening": f"Request {plan.get('negotiation_target', {}).get('target_discount')} reduction (to RM {plan.get('negotiation_target', {}).get('target_price')}/unit)",
                "target": f"Target {plan.get('negotiation_target', {}).get('target_discount')} reduction",
                "fallback": f"Accept {plan.get('negotiation_strategy', {}).get('fallback_discount')} reduction (to RM {plan.get('negotiation_strategy', {}).get('fallback_price')}/unit)",
                "leverage": [
                    f"Market average is RM {plan.get('benchmark_price')}/unit",
                    f"Current premium is {plan.get('overpricing')}",
                    f"Annual volume of {quantity} units provides leverage"
                ],
                "approach": [
                    "Lead with market data showing overpayment",
                    f"Use {plan.get('negotiation_strategy', {}).get('approach')} strategy",
                    "Propose volume commitment for better rates"
                ],
                "script": f"Subject: Pricing Discussion - Market Alignment Request\n\nDear {supplier},\n\nWe value our {relationship.lower()} partnership. However, our analysis shows the current price of RM {plan.get('current_price')} is {plan.get('overpricing')} above the market average of RM {plan.get('benchmark_price')}.\n\nWe propose an adjustment to RM {plan.get('negotiation_target', {}).get('target_price')}/unit, representing a {plan.get('negotiation_target', {}).get('target_discount')} discount, backed by our commitment of {quantity} units annually.\n\nLet's discuss this soon.\n\nBest regards,"
            }
        }

        return {"success": True, "data": formatted_plan, "source": "STATIC_FALLBACK"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/supplier/cost-reduction")
def analyze_cost_reduction(request_data: dict):
    """Batch analyze cost reduction opportunity"""
    try:
        suppliers = request_data.get("suppliers", [])

        if not suppliers:
            raise ValueError("Missing required field: suppliers")

        analysis = supplier_negotiation.analyze_cost_reduction_opportunity(suppliers)

        return {"success": True, "data": analysis}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============= ROI ROUTES =============

@router.get("/roi/scenarios")
def get_roi_scenarios():
    """
    Get available ROI scenarios for the simulator.
    These can be static definitions or dynamically generated.
    """
    return [
        { 
            "id": "fx-hedge", 
            "title": "FX Hedge Decision", 
            "description": "Optimize USD/MYR exposure based on current volatility", 
            "icon": "DollarSign" 
        },
        { 
            "id": "supplier-negotiation", 
            "title": "Supplier Negotiation", 
            "description": "Analyze volume-based discounts and payment terms", 
            "icon": "TrendingDown" 
        },
        { 
            "id": "payment-timing", 
            "title": "Payment Timing", 
            "description": "Strategic scheduling of EUR/MYR payables", 
            "icon": "Clock" 
        }
    ]


@router.get("/roi/options")
def get_roi_scenario_options(scenario: str):
    """
    Get specific ROI options for a given scenario.
    Dynamically generates options using GLM + Data Ingestion.
    """
    try:
        # Load actual ERP and news (same as dashboard)
        erp_path = Path("dualIntelligenceLayer/erp_data.json")
        payload = refresh_once(erp_path=erp_path, max_news=5)
        
        # Call GLM to generate dynamic options
        options = glm_engine.generate_roi_options(scenario, payload)
        return {"scenario": scenario, "options": options}
        
    except Exception as e:
        print(f"Dynamic ROI generation failed: {str(e)}")
        # Fallback to static data if GLM fails
        options = glm_engine._static_roi_options(scenario)
        return {"scenario": scenario, "options": options, "fallback": True}


@router.post("/roi/fx-strategy")
def calculate_fx_roi(request_data: dict):
    """Calculate ROI for FX strategy"""
    try:
        strategy = request_data.get("strategy")
        baseline_amount = request_data.get("baseline_amount")
        execution_cost = request_data.get("execution_cost")
        savings = request_data.get("savings")
        timeframe_months = request_data.get("timeframe_months", 1)

        if not all([strategy, baseline_amount, execution_cost, savings]):
            raise ValueError("Missing required fields: strategy, baseline_amount, execution_cost, savings")

        roi = roi_calculator.calculate_fx_strategy_roi(strategy, baseline_amount, execution_cost, savings, timeframe_months)

        return {"success": True, "data": roi}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/roi/supplier-negotiation")
def calculate_supplier_roi(request_data: dict):
    """Calculate ROI for supplier negotiation"""
    try:
        supplier = request_data.get("supplier")
        current_price = request_data.get("current_price")
        negotiated_price = request_data.get("negotiated_price")
        quantity = request_data.get("quantity")
        effort = request_data.get("negotiation_effort", "BALANCED")
        monthly_recurrence = request_data.get("monthly_recurrence", True)

        if not all([supplier, current_price, negotiated_price, quantity]):
            raise ValueError("Missing required fields: supplier, current_price, negotiated_price, quantity")

        roi = roi_calculator.calculate_supplier_negotiation_roi(
            supplier, current_price, negotiated_price, quantity, effort, monthly_recurrence
        )

        return {"success": True, "data": roi}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/roi/comprehensive")
def calculate_comprehensive_roi(request_data: dict):
    """Calculate comprehensive ROI"""
    try:
        decisions = request_data.get("decisions", [])

        if not decisions:
            raise ValueError("Missing required field: decisions")

        roi = roi_calculator.calculate_comprehensive_roi(decisions)

        return {"success": True, "data": roi}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============= SCENARIO ROUTES =============

@router.get("/scenarios/normal")
def get_normal_scenario():
    """Get normal market scenario"""
    try:
        scenario = scenario_manager.simulate_normal_market()
        return {"success": True, "data": scenario}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/scenarios/crisis")
def get_crisis_scenario():
    """Get economic crisis scenario"""
    try:
        scenario = scenario_manager.simulate_economic_crisis()
        return {"success": True, "data": scenario}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/scenarios/opportunistic")
def get_opportunistic_scenario():
    """Get opportunistic market scenario"""
    try:
        scenario = scenario_manager.simulate_opportunistic_market()
        return {"success": True, "data": scenario}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/scenarios/compare")
def compare_scenarios():
    """Compare all scenarios"""
    try:
        comparison = scenario_manager.compare_all_scenarios()
        return {"success": True, "data": comparison}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============= HEALTH CHECK =============

@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "status": "TreasurAI Simulation Engine is running 🔥",
        "version": "2.0.0",
        "backend": "Python FastAPI",
    }