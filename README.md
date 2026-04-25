# TreasurAI - Member 5: Simulation & ROI Engine

This repository contains the standalone **Simulation and ROI Engine** for TreasurAI. 

## 🚀 Overview
Member 5 is responsible for:
- **FX Simulation**: Strategy comparisons (Convert Now, Wait, Hedge) with real-time risk analysis.
- **Supplier Negotiation**: Automated price anomaly detection and script generation.
- **ROI Calculator**: Quantitative business impact tracking (Monthly/Yearly/5-Year projections).
- **Scenario Analysis**: Stress testing against Crisis and Overpricing conditions.

## 🛠️ Getting Started (Backend)

The backend is built with **Python FastAPI**.

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Setup Environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Server**:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8787`.

## 📂 Project Structure
```
.
├── backend/
│   ├── simulation/         # Core Logic (FX, ROI, Supplier, Scenarios)
│   ├── fastapi_app/        # API Routes
│   ├── main.py             # Entry Point
│   └── requirements.txt    # Dependencies
├── .gitignore
└── README.md
```

## 🧪 API Endpoints
- `GET /api/fx/strategies` - Compare FX strategies
- `POST /api/supplier/negotiate` - Generate negotiation plan
- `GET /api/scenarios/compare` - Compare market scenarios
- `GET /api/health` - System health status