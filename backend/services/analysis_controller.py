"""
Member 4: Orchestration Controller
Flow: Data Ingestion -> GLM Decision -> Result
"""
from pathlib import Path
from dualIntelligenceLayer.data_ingestion import refresh_once
from dualIntelligenceLayer_glm.glm_engine import run_glm_decision

def analyze_financials(erp_path_str: str):
    """
    Orchestrates the full analysis flow:
    1. Fetch and clean data (Internal ERP + External News)
    2. Pass to GLM for decision making
    3. Return consolidated result
    """
    erp_path = Path(erp_path_str)
    
    # Check if ERP path exists, if not try local default in dualIntelligenceLayer
    if not erp_path.exists():
        erp_path = Path("dualIntelligenceLayer/erp_data.json")
        
    if not erp_path.exists():
        return {"error": f"ERP data not found at {erp_path_str} or default location."}

    # 1. Data Ingestion (Member 3)
    # Note: refresh_once fetches live news via NewsFetcher
    payload = refresh_once(erp_path=erp_path)
    
    # 2. GLM Decision (Member 1)
    decision = run_glm_decision(payload)
    
    # 3. Final Orchestrated Result
    return {
        "status": "success",
        "orchestration_flow": "Data Ingestion -> GLM Decision",
        "input_metadata": payload["internal_financial_status"]["source"],
        "glm_decision": decision,
        "raw_data_summary": {
            "cash_balance_count": len(payload["internal_financial_status"]["cash_balances"]),
            "news_items_count": len(payload["external_market_context"]["items"])
        }
    }
