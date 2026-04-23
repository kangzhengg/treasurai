from services.simulation_engine import run_simulation
from services.fallback_engine import fallback_decision

def run_orchestration(input_data):

    amount = input_data.get("amount", 0)

    try:
      
        glm_output = {
            "action": "CONVERT_NOW",
            "amount": amount,
            "reasoning": "USD expected to strengthen based on news + exposure",
            "risk_level": "HIGH",
            "confidence": 0.87,
            "estimated_savings": 12000
        }

    except Exception:
    
        glm_output = fallback_decision(amount)

 
    simulation_output = run_simulation(amount)

  
    ui_markers = [
        {"type": "CONVERT_NOW", "color": "cyan", "message": "Convert now → Save RM 12,000"},
        {"type": "DELAY", "color": "lime", "message": "Delay 3 days → Risk increase"},
        {"type": "HEDGE", "color": "purple", "message": "Consider hedge → Reduce volatility risk"}
    ]

    return {
        "decision": glm_output,
        "simulation": simulation_output,
        "ui_markers": ui_markers,
        "status": "SUCCESS"
    }

import time

def get_live_updates():
    return {
        "timestamp": time.time(),
        "new_decision": "CONVERT_NOW",
        "updated_savings": 12500
    }