import requests
import os
import json
from typing import Dict, Any
from dotenv import load_dotenv

from .decision_model import GLMResponse, ActionType, RiskLevel
from .prompt_templates import SYSTEM_PROMPT, DECISION_PROMPT_TEMPLATE

load_dotenv()

class GLMDecisionEngine:
    """
    Member 1: Core GLM Decision Engine
    Responsibilities:
    - Process internal financial data and external news
    - Generate structured decisions (CONVERT, DELAY, NEGOTIATE)
    - Provide XAI (Reasoning chains, evidence)
    - Calculate financial impact and trade-offs
    """
    
    def __init__(self):
        self.api_key = os.getenv("ILMU_API_KEY")
        base_url = os.getenv("ILMU_BASE_URL", "https://api.ilmu.ai/v1").rstrip("/")
        self.api_url = f"{base_url}/chat/completions"
        self.model_name = os.getenv("ILMU_MODEL", "ilmu-glm-5.1")

    def analyze_and_decide(self, payload: Dict[str, Any]) -> GLMResponse:
        """
        Main entry point for financial reasoning.
        """
        prompt = self._build_prompt(payload)
        
        # Check if API key is a placeholder or missing
        if not self.api_key or "sk-..." in self.api_key:
            return self._generate_mock_response(payload, error="API Key missing or placeholder")

        try:
            # Ensure the prompt asks for JSON clearly
            system_msg = SYSTEM_PROMPT + "\n\nIMPORTANT: You MUST return a valid JSON object only."
            
            response = requests.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2, # Lower temperature for more consistent structured output
                    "timeout": 60
                }
            )
            response.raise_for_status()
            raw_data = response.json()
            content = raw_data["choices"][0]["message"]["content"]
            
            # Clean up content if model returns markdown blocks
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            # Robust normalization before validation
            try:
                data = json.loads(content)
                
                # Normalize decisions
                if "decisions" in data and isinstance(data["decisions"], list):
                    for d in data["decisions"]:
                        # 1. Normalize RiskLevel to uppercase
                        if "risk_level" in d and isinstance(d["risk_level"], str):
                            d["risk_level"] = d["risk_level"].upper()
                            if d["risk_level"] == "MED": d["risk_level"] = "MEDIUM"
                        
                        # 2. Normalize ActionType to uppercase
                        if "action" in d and isinstance(d["action"], str):
                            d["action"] = d["action"].upper()

                        # 3. Ensure confidence is float
                        if "confidence" in d and isinstance(d["confidence"], str):
                            try:
                                # Remove % if present
                                clean_conf = d["confidence"].replace("%", "").strip()
                                d["confidence"] = float(clean_conf)
                                if d["confidence"] > 1: d["confidence"] /= 100
                            except:
                                d["confidence"] = 0.8 # Fallback

                        # 4. Ensure list fields are actually lists
                        for list_field in ["reasoning_chain", "evidence_news", "evidence_internal"]:
                            if list_field in d and isinstance(d[list_field], str):
                                val = d[list_field]
                                # Handle numbered lists in a single string
                                if "\n" in val:
                                    d[list_field] = [line.strip().lstrip("- ").lstrip("123456789. ") for line in val.split("\n") if line.strip()]
                                elif any(f"{i}." in val for i in range(1, 5)):
                                    # Fallback split for "1. Step A 2. Step B"
                                    import re
                                    parts = re.split(r'\d+\.', val)
                                    d[list_field] = [p.strip() for p in parts if p.strip()]
                                else:
                                    d[list_field] = [val]
                
                return GLMResponse.model_validate(data)
            except Exception as parse_err:
                print(f"GLM Normalization Error: {str(parse_err)}")
                # Fallback to original validation if normalization fails
                return GLMResponse.model_validate_json(content)
            
        except Exception as e:
            print(f"GLM API Error: {str(e)}")
            return self._generate_mock_response(payload, error=str(e))

    def generate_roi_options(self, scenario: str, payload: Dict[str, Any]) -> list:
        """Generate a list of trade-off options for a specific scenario using GLM."""
        prompt = f"""You are a treasury management AI. Generate an array of decision options for the scenario: "{scenario}". 

Current situation:
Company Data: {json.dumps(payload.get("company_data", {}), indent=2)}
News Data: {json.dumps(payload.get("news_data", []), indent=2)}

Return ONLY a valid JSON array of objects. Each object must have these fields:
- name: string (e.g., "Convert Now", "Delay 1 Week")
- action: string (CONVERT_CURRENCY, DELAY_PAYMENT, NEGOTIATE_SUPPLIER, HEDGE_EXPOSURE, etc.)
- cost: number (total cost in MYR)
- estimated_savings: number (savings in MYR, may be 0 or negative)
- risk_level: string (one of "LOW", "MEDIUM", "HIGH", "CRITICAL")
- confidence: number (between 0 and 1)
- reasoning: string (short explanation)
- details: array of strings (2-4 bullet points)

For the scenario "FX Hedge Decision", generate 3 options.
For "Supplier Negotiation", generate at least 2 options.
For "Payment Timing", generate at least 2 options.
Use the provided company data and news to make the options realistic and quantified."""

        if not self.api_key or "sk-..." in self.api_key:
            return self._static_roi_options(scenario)

        try:
            system_msg = SYSTEM_PROMPT + "\n\nIMPORTANT: You MUST return only a valid JSON array."
            response = requests.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2,
                    "timeout": 45
                }
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            
            # Clean up markdown if present
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            options = json.loads(content)
            if isinstance(options, dict):
                # sometimes the model wraps in {"options": [...]}
                options = options.get("options", options.get("decisions", []))
            
            if not isinstance(options, list):
                raise ValueError("Expected list, got " + str(type(options)))
            
            # Normalize each option's fields
            normalized = []
            for opt in options:
                if "risk_level" in opt and isinstance(opt["risk_level"], str):
                    opt["risk_level"] = opt["risk_level"].upper()
                    if opt["risk_level"] == "MED": opt["risk_level"] = "MEDIUM"
                
                if "confidence" in opt and isinstance(opt["confidence"], str):
                    try:
                        clean_conf = opt["confidence"].replace("%", "").strip()
                        opt["confidence"] = float(clean_conf)
                        if opt["confidence"] > 1: opt["confidence"] /= 100
                    except:
                        opt["confidence"] = 0.8
                
                # ensure details is list
                if "details" in opt and isinstance(opt["details"], str):
                    opt["details"] = [opt["details"]]
                
                normalized.append(opt)
            return normalized
        except Exception as e:
            print(f"GLM ROI options error: {str(e)}")
            return self._static_roi_options(scenario)

    def generate_supplier_negotiation(self, request_data: dict) -> dict:
        """Generate a dynamic supplier negotiation strategy using GLM."""
        if not self.api_key or "sk-..." in self.api_key:
            return {"fallback": True, "error": "API Key missing"}

        supplier = request_data.get("supplier", "Unknown")
        current_price = request_data.get("current_price", 0)
        category = request_data.get("category", "General")
        quantity = request_data.get("quantity", 1)
        relationship = request_data.get("relationship", "TRANSACTIONAL")

        prompt = f"""You are a senior procurement AI. Generate a negotiation strategy for a supplier.
Supplier Name: {supplier}
Category: {category}
Current Price Paid: RM {current_price}
Annual Volume: {quantity} units
Relationship Level: {relationship}

Return ONLY a valid JSON object with the following exact structure:
{{
  "name": "{supplier}",
  "currentPrice": "RM {current_price}/unit",
  "marketAverage": "RM [realistic lower market average]/unit",
  "overpayment": "[percentage]%",
  "annualSpend": "RM [calculate {current_price} * {quantity} formatted]",
  "potentialSavings": "RM [calculate potential savings formatted]",
  "relationship": "{relationship}",
  "contractRenewal": "Q3 2026",
  "marketPosition": "Stable/Weakening/Strong",
  "negotiationStrategy": {{
    "opening": "Request X% reduction (to RM Y/unit)",
    "target": "Z% reduction (to RM W/unit)",
    "fallback": "V% reduction (to RM U/unit)",
    "leverage": [
      "Bullet point 1 about market average",
      "Bullet point 2 about volume",
      "Bullet point 3 about industry trends"
    ],
    "approach": [
      "Step 1...",
      "Step 2...",
      "Step 3..."
    ],
    "script": "Subject: ...\\n\\nDear ...\\n\\nWe are reaching out to discuss...\\n\\nBest regards,"
  }}
}}
Make the script professional and data-driven."""

        try:
            system_msg = SYSTEM_PROMPT + "\n\nIMPORTANT: You MUST return only a valid JSON object matching the exact requested structure."
            response = requests.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2,
                    "timeout": 45
                }
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            data = json.loads(content)
            return data
        except Exception as e:
            print(f"GLM negotiation error: {str(e)}")
            return {"fallback": True, "error": str(e)}

    def _static_roi_options(self, scenario: str) -> list:
        """Fallback static options if GLM fails."""
        if scenario == "fx-hedge" or scenario == "FX Hedge Decision":
            return [
                {
                    "name": "Convert Now",
                    "action": "CONVERT_CURRENCY",
                    "cost": 4450000.0,
                    "estimated_savings": 0,
                    "risk_level": "LOW",
                    "confidence": 0.92,
                    "reasoning": "Lock in current rate 4.45; no exposure",
                    "details": ["Immediate execution", "No volatility risk", "Rate: 4.45 MYR/USD"]
                },
                {
                    "name": "Wait & Watch (30 days)",
                    "action": "DELAY_PAYMENT",
                    "cost": 4450000.0,
                    "estimated_savings": 85000.0,
                    "risk_level": "MEDIUM",
                    "confidence": 0.65,
                    "reasoning": "Potential for MYR strengthening against USD",
                    "details": ["No immediate cash outlay", "Exposed to 0.8% daily volatility", "Potential 2% gain if USD weakens"]
                },
                {
                    "name": "Forward Hedge",
                    "action": "HEDGE_EXPOSURE",
                    "cost": 4468000.0,
                    "estimated_savings": 120000.0,
                    "risk_level": "LOW",
                    "confidence": 0.88,
                    "reasoning": "Lock rate at 4.468 via forward contract",
                    "details": ["Premium cost included", "Caps maximum exposure", "100% protection against extreme weakness"]
                }
            ]
        elif scenario == "supplier-negotiation" or scenario == "Supplier Negotiation":
            return [
                {
                    "name": "Volume Rebate",
                    "action": "NEGOTIATE_SUPPLIER",
                    "cost": 12500000.0,
                    "estimated_savings": 1200000.0,
                    "risk_level": "MEDIUM",
                    "confidence": 0.85,
                    "reasoning": "Commit to +20% volume for 10% discount",
                    "details": ["Tiered discount structure", "Inventory holding cost impact", "Quarterly performance review"]
                },
                {
                    "name": "Early Payment Discount",
                    "action": "NEGOTIATE_SUPPLIER",
                    "cost": 5000000.0,
                    "estimated_savings": 100000.0,
                    "risk_level": "LOW",
                    "confidence": 0.95,
                    "reasoning": "2% discount for payment within 10 days",
                    "details": ["2/10 Net 30 terms", "Immediate cash benefit", "Requires available liquidity"]
                }
            ]
        elif scenario == "payment-timing" or scenario == "Payment Timing":
            return [
                {
                    "name": "Dynamic Payables Scheduling",
                    "action": "DELAY_PAYMENT",
                    "cost": 1000000.0,
                    "estimated_savings": 15000.0,
                    "risk_level": "MEDIUM",
                    "confidence": 0.78,
                    "reasoning": "Align payments with expected MYR strength",
                    "details": ["Wait for projected 2% MYR appreciation", "Zero execution cost", "Optimizes working capital"]
                }
            ]
        return []

    def _build_prompt(self, payload: Dict[str, Any]) -> str:
        base_prompt = DECISION_PROMPT_TEMPLATE.format(
            company_data=json.dumps(payload.get("company_data", {}), indent=2),
            news_data=json.dumps(payload.get("news_data", []), indent=2),
            market_context=json.dumps(payload.get("market_context", {}), indent=2)
        )
        
        scenario = payload.get("market_context", {}).get("scenario")
        if scenario and scenario != "Normal Market":
            scenario_instruction = f"""\n\n!!! CRITICAL SCENARIO INJECTION !!!
You MUST evaluate the above data assuming the following scenario is CURRENTLY HAPPENING: "{scenario}".
Ignore any contradictory news. Your decisions MUST strictly address the risks and opportunities of this specific scenario.
Adjust all your strategies, urgency, and reasoning to fit the "{scenario}" scenario perfectly."""
            base_prompt += scenario_instruction
            
        return base_prompt

    def _generate_mock_response(self, payload: Dict[str, Any], error: str = None) -> GLMResponse:
        """
        Generates a high-quality mock response if API is unavailable.
        Ensures the system remains functional for UI testing.
        """
        # Logic to derive some values from payload for the mock
        cash = payload.get("internal_financial_status", {}).get("cash_balances", {}).get("total_myr", 5000000)
        
        return GLMResponse(
            decisions=[
                {
                    "action": ActionType.CONVERT_CURRENCY,
                    "currency_pair": "MYR/USD",
                    "amount": 250000.0,
                    "reasoning": "Strong bullish trend in USD detected. News suggests further strengthening due to Fed rate hike expectations.",
                    "risk_level": RiskLevel.MEDIUM,
                    "estimated_savings": 850000.0,
                    "confidence": 0.89,
                    "reasoning_chain": [
                        "Analyze current MYR/USD spot rate",
                        "Evaluate news sentiment on Fed policy",
                        "Assess internal USD liquidity needs",
                        "Calculate cost of waiting vs immediate conversion"
                    ],
                    "evidence_news": [
                        "Fed signals potential rate hike next month",
                        "US Job data exceeds expectations"
                    ],
                    "evidence_internal": [
                        "Upcoming USD payables of $200k in 30 days",
                        "Low USD buffer in treasury accounts"
                    ]
                },
                {
                    "action": ActionType.DELAY_PAYMENT,
                    "currency_pair": "MYR",
                    "amount": 150000.0,
                    "reasoning": "Optimize cash flow by utilizing vendor credit terms while MYR interest rates are high.",
                    "risk_level": RiskLevel.LOW,
                    "estimated_savings": 450000.0,
                    "confidence": 0.95,
                    "reasoning_chain": [
                        "Check vendor payment terms (Net 60)",
                        "Analyze current short-term MYR deposit rates",
                        "Compute opportunity cost of early payment"
                    ],
                    "evidence_news": [
                        "Bank Negara maintains interest rates at 3.0%"
                    ],
                    "evidence_internal": [
                        "Excess cash in MYR operating account",
                        "Vendor 'TechCorp' offers no early payment discount"
                    ]
                }
            ],
            trade_offs=[
                {
                    "option_a": "Convert USD Now",
                    "option_b": "Wait 30 Days",
                    "cost_difference": 850000.0,
                    "risk_difference": "Waiting increases exposure to 5% volatility",
                    "best_option": "Convert USD Now",
                    "ranking_score": 0.92
                },
                {
                    "option_b": "Delay Payment",
                    "option_a": "Pay Early",
                    "cost_difference": 450000.0,
                    "risk_difference": "Negligible risk to vendor relationship",
                    "best_option": "Delay Payment",
                    "ranking_score": 0.88
                }
            ],
            projections={
                "monthly_savings": 1300000.0,
                "yearly_savings": 15600000.0,
                "roi_percentage": 24.8
            },
            metadata={
                "is_mock": True,
                "error": error,
                "engine_version": "5.1-unified"
            }
        )

# Backward compatibility wrapper
def run_glm_decision(payload: dict):
    engine = GLMDecisionEngine()
    result = engine.analyze_and_decide(payload)
    return result.dict()
