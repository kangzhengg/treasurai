"""
API Routes for Member 5 - Simulation & ROI Engine
FastAPI routes exposing Simulation, ROI, and Scenario logic
"""

from fastapi import APIRouter, HTTPException
from simulation.fx_simulator import FXSimulator
from simulation.roi_calculator import ROICalculator
from simulation.supplier_negotiation import SupplierNegotiationEngine
from simulation.scenario_manager import ScenarioManager
from datetime import datetime, timezone
from typing import Any, Dict

router = APIRouter(prefix="/api", tags=["simulation"])

# Initialize engines
fx_simulator = FXSimulator()
roi_calculator = ROICalculator()
supplier_negotiation = SupplierNegotiationEngine()
scenario_manager = ScenarioManager()

def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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

        # Fallback to simulation engine (Member 5 direct logic)
        plan = supplier_negotiation.generate_negotiation_plan(
            supplier, current_price, quantity, category, relationship, season
        )
        
        # Format plan to match UI expectations
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

        return {"success": True, "data": formatted_plan, "source": "SIMULATION_ENGINE"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============= ROI ROUTES =============

@router.get("/roi/scenarios")
def get_roi_scenarios():
    """Get available ROI scenarios for the simulator."""
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
    """Get specific ROI options for a given scenario using deterministic Member 5 logic."""
    if scenario == "fx-hedge":
        options = [
            {
                "name": "Forward Contract",
                "action": "HEDGE",
                "cost": 4720000,
                "risk_level": "LOW",
                "estimated_savings": 120000,
                "confidence": 0.95,
                "details": ["Zero volatility risk", "Fixed cash flow projection"]
            },
            {
                "name": "Wait & See",
                "action": "WAIT",
                "cost": 0,
                "risk_level": "HIGH",
                "estimated_savings": 350000,
                "confidence": 0.45,
                "details": ["High upside potential", "Full exposure to market risk"]
            }
        ]
    elif scenario == "supplier-negotiation":
        options = [
            {
                "name": "Volume Rebate",
                "action": "NEGOTIATE",
                "cost": 12500000,
                "risk_level": "MEDIUM",
                "estimated_savings": 1200000,
                "confidence": 0.88,
                "details": ["Commit to +20% volume", "Lock 12-month terms"]
            }
        ]
    else:
        options = []
        
    return {"scenario": scenario, "options": options}


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


@router.get("/scenarios/overpricing")
def get_overpricing_scenario():
    """Get supplier overpricing scenario"""
    try:
        scenario = scenario_manager.simulate_supplier_overpricing()
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
        "version": "2.1.0 (Member 5 Standalone)",
        "backend": "Python FastAPI",
    }