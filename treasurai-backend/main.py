"""
TreasurAI Backend - Main Entry Point
Python FastAPI Backend for Treasury Management System
Run this file only!

Usage:
    uvicorn main:app --reload
    # or
    python -m uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from datetime import datetime
from routes.api_routes import router

# Initialize FastAPI app
app = FastAPI(
    title="TreasurAI Backend",
    description="Treasury Management System - Python Backend",
    version="2.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)


# ============= ROOT ROUTES =============

@app.get("/")
def home():
    """Root endpoint - API overview"""
    return {
        "message": "TreasurAI Backend Running 🔥",
        "version": "2.0.0",
        "backend": "Python FastAPI",
        "timestamp": datetime.now().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "endpoints": {
            "health": "/api/health",
            "fx": {
                "strategies": "GET /api/fx/strategies",
                "simulate": "POST /api/fx/simulate",
                "rates": "GET /api/fx/rates",
            },
            "supplier": {
                "analyze": "POST /api/supplier/analyze",
                "compare": "POST /api/supplier/compare",
                "negotiate": "POST /api/supplier/negotiate",
                "cost_reduction": "POST /api/supplier/cost-reduction",
            },
            "roi": {
                "fx_strategy": "POST /api/roi/fx-strategy",
                "supplier_negotiation": "POST /api/roi/supplier-negotiation",
                "comprehensive": "POST /api/roi/comprehensive",
            },
            "scenarios": {
                "normal": "GET /api/scenarios/normal",
                "crisis": "GET /api/scenarios/crisis",
                "opportunistic": "GET /api/scenarios/opportunistic",
                "compare": "GET /api/scenarios/compare",
            },
        },
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

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("ENVIRONMENT", "development") == "development",
    )
