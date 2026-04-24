import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ILMU_API_KEY")

def run_glm_decision(payload: dict):
    """
    Member 1: Core GLM Brain
    Processes internal financial data and external market context to provide decisions.
    """
    # In a real scenario, we would build a prompt and call the API
    # prompt = build_prompt(payload)
    # response = call_ilmu_api(prompt)
    
    # Mock decision for demonstration if API key is missing
    if not API_KEY:
        return {
            "recommendation": "HEDGE_50_PERCENT",
            "reasoning": "High volatility detected in MYR/USD based on recent market news. Internal cash flow supports hedging strategy.",
            "confidence_score": 0.85,
            "risk_level": "MEDIUM"
        }

    try:
        response = requests.post(
            "https://api.ilmu.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "ilmu-glm-5.1",
                "messages": [
                    {"role": "system", "content": "You are a Treasury Management Expert. Analyze the following data and provide a decision."},
                    {"role": "user", "content": str(payload)}
                ]
            },
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": f"Failed to call GLM API: {str(e)}", "fallback": "CONVERT_NOW"}

def build_prompt(payload: dict):
    # Heuristic prompt building based on payload
    return f"Analyze financial status: {payload['internal_financial_status']} and market context: {payload['external_market_context']}"
