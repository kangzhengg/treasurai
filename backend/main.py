"""
TreasurAI Backend - Unified Entry Point
Consolidated Python FastAPI Backend following the 5-Member Architecture
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from datetime import datetime
from fastapi_app.api_routes import router

# Initialize FastAPI app
app = FastAPI(
    title="TreasurAI Unified Backend",
    description="Consolidated Treasury Management System - 5 Member Architecture",
    version="2.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include consolidated routes
app.include_router(router)


# ============= ROOT ROUTES =============

@app.get("/")
def home():
    """Root endpoint - API overview"""
    return {
        "message": "TreasurAI Unified Backend Running 🔥",
        "architecture": "5-Member Python FastAPI",
        "timestamp": datetime.now().isoformat(),
        "members": {
            "Member 1": "GLM Decision Engine (dualIntelligenceLayer_glm)",
            "Member 2": "API Routes & FastAPI Structure (fastapi_app)",
            "Member 3": "Data Ingestion (dualIntelligenceLayer)",
            "Member 4": "Orchestration Controller (services)",
            "Member 5": "Simulation & ROI Engine (simulation)"
        },
        "endpoints": {
            "health": "/api/health",
            "analyze": "/api/analyze (Member 4 Orchestration)",
            "fx": "/api/fx/strategies",
            "roi": "/api/roi/fx-strategy",
            "scenarios": "/api/scenarios/compare"
        }
    }


@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "OK",
        "timestamp": datetime.now().isoformat(),
        "backend": "Python FastAPI",
    }


# ============= ERROR HANDLERS =============

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors"""
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "path": request.url.path},
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors"""
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )


# ============= SERVER START =============

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 3001))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"Starting TreasurAI Unified Backend on {host}:{port}")
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    )
