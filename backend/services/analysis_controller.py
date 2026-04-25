"""
Member 4: Orchestration Controller
Flow: Data Ingestion -> GLM Decision -> Result
"""
from pathlib import Path
from dualIntelligenceLayer.data_ingestion import refresh_once
from dualIntelligenceLayer_glm.glm_engine import run_glm_decision
from simulation.fx_simulator import FXSimulator
from services.cashflow_projector import project_cash_flow
from datetime import datetime

import time

_CACHE = {}
CACHE_TTL = 300  # 5 minutes

def analyze_financials(erp_path_str: str):
    """
    Orchestrates the full analysis flow (Member 4):
    1. Fetch and clean data (Data Engine)
    2. Pass to GLM for reasoning (Core Brain)
    3. Trigger simulations based on decisions (Simulation Engine)
    4. Apply fallback logic if needed
    """
    cache_key = "dashboard_analysis"
    now = time.time()
    if cache_key in _CACHE:
        cached_result, timestamp = _CACHE[cache_key]
        if now - timestamp < CACHE_TTL:
            print("Returning cached analysis to prevent GLM overload")
            return cached_result

    erp_path = Path(erp_path_str)
    
    # Check if ERP path exists, if not try local default locations
    if not erp_path.exists():
        potential_path = Path("backend/dualIntelligenceLayer/erp_data.json")
        if potential_path.exists():
            erp_path = potential_path
        else:
            erp_path = Path("dualIntelligenceLayer/erp_data.json")
        
    # 1. Data Ingestion (Member 3)
    try:
        payload = refresh_once(erp_path=erp_path, max_news=3)
    except Exception as e:
        return _get_fallback_response(f"Data ingestion failed: {str(e)}")

    # 2. GLM Decision (Member 1)
    try:
        decision = run_glm_decision(payload)
        if "error" in decision and decision.get("error"):
            decision = _get_fallback_decision("GLM API Error")
    except Exception as e:
        decision = _get_fallback_decision(f"GLM Exception: {str(e)}")

    # 3. Simulation Engine (Member 5) integration
    simulations = []
    fx_sim = FXSimulator()
    for d in decision.get("decisions", []):
        if d.get("action") == "CONVERT_CURRENCY":
            currency = d.get("currency_pair", "MYR/USD").split("/")[-1]
            amount = d.get("amount", 0)
            if currency in fx_sim.rates:
                sim_result = fx_sim.compare_strategies(currency, amount)
                simulations.append(sim_result)

    # 4. Cash Flow Projection
    cash_flow_projection = project_cash_flow(payload, decision.get("decisions", []))

    timestamp = payload.get("market_context", {}).get("fetched_at_utc") or datetime.utcnow().isoformat()

    result = {
        "status": "success",
        "orchestration_flow": "Data -> GLM -> Simulation",
        "timestamp": timestamp,
        "glm_decision": decision,
        "simulations": simulations,
        "cash_flow_projection": cash_flow_projection,
        "company_data": payload.get("company_data", {}),
        "news_data": payload.get("news_data", []),
        "market_context": payload.get("market_context", {}),
        "metadata": {
            "cash_balance_count": len(payload.get("company_data", {}).get("cash_balances", {}).get("accounts", [])),
            "news_items_count": len(payload.get("news_data", [])),
            "is_fallback": decision.get("metadata", {}).get("is_fallback", False)
        }
    }
    
    _CACHE[cache_key] = (result, now)
    return result

def _get_fallback_decision(reason: str):
    """Member 4: Fallback system logic"""
    return {
        "decisions": [
            {
                "action": "CONVERT_CURRENCY",
                "currency_pair": "MYR/USD",
                "amount": 100000.0,
                "reasoning": f"FALLBACK MODE: {reason}. Recommendation based on historical averages: Convert gradually over 5 days to mitigate volatility.",
                "risk_level": "LOW",
                "estimated_savings": 0.0,
                "confidence": 0.5,
                "reasoning_chain": ["GLM Unavailable", "Applying safe historical average strategy"],
                "evidence_news": [],
                "evidence_internal": []
            }
        ],
        "trade_offs": [],
        "projections": {
            "monthly_savings": 0.0,
            "yearly_savings": 0.0,
            "roi_percentage": 0.0
        },
        "metadata": {"is_fallback": True, "reason": reason}
    }

def _get_fallback_response(error_msg: str):
    return {
        "status": "error",
        "message": error_msg,
        "fallback_active": True,
        "glm_decision": _get_fallback_decision(error_msg)
    }

from simulation.scenario_manager import ScenarioManager

def simulate_scenario(scenario_name: str, erp_path_str: str = "dualIntelligenceLayer/erp_data.json"):
    """
    Run a GLM simulation with a specific scenario context injected.
    If GLM fails, fall back to the deterministic ScenarioManager.
    """
    erp_path = Path(erp_path_str)
    if not erp_path.exists():
        potential_path = Path("backend/dualIntelligenceLayer/erp_data.json")
        erp_path = potential_path if potential_path.exists() else Path("dualIntelligenceLayer/erp_data.json")
    
    try:
        payload = refresh_once(erp_path=erp_path, max_news=3)
        payload["market_context"]["scenario"] = scenario_name
    except Exception as e:
        fallback_decision = _get_fallback_scenario(scenario_name, f"Data ingestion failed: {str(e)}")
        return {
            "status": "success",
            "glm_decision": fallback_decision,
            "company_data": {},
            "news_data": [],
            "metadata": {"scenario": scenario_name, "is_fallback": True}
        }

    try:
        decision = run_glm_decision(payload)
        if "error" in decision and decision.get("error"):
             decision = _get_fallback_scenario(scenario_name, "GLM API Error")
    except Exception as e:
        decision = _get_fallback_scenario(scenario_name, f"GLM Exception: {str(e)}")

    return {
        "status": "success",
        "orchestration_flow": "Data -> GLM -> Scenario Simulation",
        "timestamp": payload.get("market_context", {}).get("fetched_at_utc", ""),
        "glm_decision": decision,
        "company_data": payload.get("company_data", {}),
        "news_data": payload.get("news_data", []),
        "metadata": {
            "scenario": scenario_name,
            "is_fallback": decision.get("metadata", {}).get("is_fallback", False)
        }
    }

def _get_fallback_scenario(scenario_name: str, reason: str):
    manager = ScenarioManager()
    scenario_map = {
        "Normal Market": manager.simulate_normal_market,
        "Oil Crisis": manager.simulate_economic_crisis,
        "Interest Rate Drop": manager.simulate_economic_crisis,
    }
    func = scenario_map.get(scenario_name, manager.simulate_normal_market)
    sim_result = func()
    
    decisions = []
    for d in sim_result.get("decisions", []):
        decisions.append({
            "title": d.get("action", ""),
            "action": d.get("decision", ""),
            "estimated_savings": float(d.get("savings", 0)),
            "confidence": float(d.get("confidence", 0.5)),
            "reasoning": str(d.get("reasoning", "Generated by fallback simulation engine.")),
            "risk_level": str(d.get("risk", "MEDIUM")).upper(),
        })
        
    return {
        "decisions": decisions,
        "metadata": {"is_fallback": True, "reason": reason},
        "projections": {
            "monthly_savings": float(sim_result.get("financial_impact", {}).get("projections", {}).get("monthly", 0)),
            "yearly_savings": float(sim_result.get("financial_impact", {}).get("projections", {}).get("annual", 0))
        }
    }
