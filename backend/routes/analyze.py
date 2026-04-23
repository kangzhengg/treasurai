from fastapi import APIRouter
from models.analyze_model import AnalyzeRequest
from orchestration_engine import run_orchestration
from services.simulation_engine import run_simulation

router = APIRouter()


@router.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    return run_orchestration(payload.dict())


@router.post("/api/simulate")
def simulate(payload: AnalyzeRequest):
    return {
        "simulation": run_simulation(payload.amount),
        "status": "SUCCESS"
    }



@router.get("/api/dashboard")
def dashboard():

    return {
        "system_status": "ACTIVE",
        "glM_engine": "RUNNING",
        "active_decisions": 3,
        "risk_level": "MEDIUM",
        "message": "TreasurAI system operational"
    }