def fallback_decision(amount: float):

    return {
        "action": "CONVERT_GRADUALLY",
        "reasoning": "GLM unavailable → using historical average FX trend",
        "risk_level": "MEDIUM",
        "estimated_savings": 3000,
        "confidence": 0.60
    }