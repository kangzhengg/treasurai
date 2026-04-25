"""
TreasurAI Backend - Unified Entry Point
5-Member Architecture Integrated System
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import os


from fastapi_app.api_routes import router as main_router


app = FastAPI(
    title="TreasurAI Unified Backend",
    description="AI-powered treasury decision system",
    version="2.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(main_router)




@app.get("/")
def home():
    return {
        "message": "TreasurAI Unified Backend Running 🔥",
        "timestamp": datetime.now().isoformat(),
        "system": "5-Member Architecture Integrated",
        "endpoints": {
            "health": "/api/health",
            "analyze": "/api/analyze",
            "simulate": "/api/simulate",
            "dashboard": "/api/dashboard"
        }
    }




@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "system": "TreasurAI Backend",
        "time": datetime.now().isoformat()
    }




@app.exception_handler(404)
async def not_found(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Not found", "path": request.url.path},
    )


@app.exception_handler(500)
async def server_error(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8787)),
        reload=True
    )