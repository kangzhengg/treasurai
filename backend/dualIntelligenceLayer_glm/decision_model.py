from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ActionType(str, Enum):
    CONVERT_CURRENCY = "CONVERT_CURRENCY"
    DELAY_PAYMENT = "DELAY_PAYMENT"
    NEGOTIATE_SUPPLIER = "NEGOTIATE_SUPPLIER"
    HEDGE_EXPOSURE = "HEDGE_EXPOSURE"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class FinancialDecision(BaseModel):
    action: ActionType = Field(..., description="The recommended financial action")
    currency_pair: Optional[str] = Field(None, description="The currency pair involved, e.g., MYR/USD")
    amount: float = Field(..., description="The amount involved in the decision")
    reasoning: str = Field(..., description="The detailed reasoning behind the decision")
    risk_level: RiskLevel = Field(..., description="The risk level associated with the decision")
    estimated_savings: float = Field(..., description="The estimated savings or financial benefit in base currency")
    confidence: float = Field(..., description="Confidence score between 0 and 1")
    
    # Explainable AI (XAI) components
    reasoning_chain: List[str] = Field(default_factory=list, description="Step-by-step logic used by GLM")
    evidence_news: List[str] = Field(default_factory=list, description="Key news headlines that influenced the decision")
    evidence_internal: List[str] = Field(default_factory=list, description="Internal data points that influenced the decision")

class TradeOffComparison(BaseModel):
    option_a: str
    option_b: str
    cost_difference: float
    risk_difference: str
    best_option: str
    ranking_score: float

class ImpactProjections(BaseModel):
    monthly_savings: float
    yearly_savings: float
    roi_percentage: float

class GLMResponse(BaseModel):
    decisions: List[FinancialDecision]
    trade_offs: List[TradeOffComparison]
    projections: ImpactProjections
    metadata: Dict[str, Any] = Field(default_factory=dict)
