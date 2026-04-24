# TreasurAI Backend - Python FastAPI

## Quick Start

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run the Backend

```bash
# Using uvicorn directly
uvicorn main:app --reload

# Or using Python
python main.py
```

Server runs on: **http://localhost:3001**

---

## Architecture

This is a **Python-only backend** with the following structure:

```
treasurai-backend/
├── main.py                      ← ENTRY POINT (run this only!)
├── requirements.txt             ← Python dependencies
├── routes/
│   └── api_routes.py           ← FastAPI endpoints
├── simulation/
│   ├── fx_simulator.py         ← FX Strategy Engine (Member 5)
│   ├── roi_calculator.py       ← ROI Calculator
│   ├── scenario_manager.py     ← Scenario Simulations
│   └── supplier_negotiation.py ← Supplier Analysis
├── services/
│   └── api_handler.py          ← GLM API calls (future - Member 1)
└── utils/
    └── logger.py               ← Logging utilities
```

---

## API Endpoints

### Health Check
- `GET /` - API overview
- `GET /health` - Health status

### FX Simulation
- `GET /api/fx/strategies` - Compare all FX strategies
- `POST /api/fx/simulate` - Simulate specific strategy
- `GET /api/fx/rates` - Get current rates

### Supplier Negotiation
- `POST /api/supplier/analyze` - Analyze pricing
- `POST /api/supplier/compare` - Compare suppliers
- `POST /api/supplier/negotiate` - Generate negotiation plan
- `POST /api/supplier/cost-reduction` - Batch analysis

### ROI Calculation
- `POST /api/roi/fx-strategy` - Calculate FX ROI
- `POST /api/roi/supplier-negotiation` - Calculate supplier ROI
- `POST /api/roi/comprehensive` - Calculate total ROI

### Scenarios
- `GET /api/scenarios/normal` - Normal market scenario
- `GET /api/scenarios/crisis` - Economic crisis scenario
- `GET /api/scenarios/opportunistic` - Opportunistic market
- `GET /api/scenarios/compare` - Compare all scenarios

---

## Example Usage

### Simulate FX Strategy

```bash
curl -X POST http://localhost:3001/api/fx/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "CONVERT_NOW",
    "currency": "USD",
    "amount": 1000000,
    "days_horizon": 30
  }'
```

### Analyze Supplier

```bash
curl -X POST http://localhost:3001/api/supplier/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Electronics",
    "price": 5000,
    "quantity": 10,
    "relationship": "STRATEGIC"
  }'
```

### Get Scenarios

```bash
curl http://localhost:3001/api/scenarios/compare
```

---

## Configuration

Create a `.env` file based on `.env.example`:

```env
ENVIRONMENT=development
PORT=3001
HOST=0.0.0.0
ILMU_API_KEY=your_api_key_here
```

---

## Development

### Add New Endpoint

1. Create the function in the relevant engine (e.g., `simulation/fx_simulator.py`)
2. Add the route in `routes/api_routes.py`
3. Restart the server (`Ctrl+C` and `uvicorn main:app --reload`)

### Code Style

- Follow PEP 8
- Use type hints
- Add docstrings to all functions

---

## Future Enhancements

- ✅ Member 5 (Simulation Engine) - DONE
- 🔜 Member 1 (GLM Engine) - Integrate Ilmu GLM API
- 🔜 Member 3 (Data Ingestion) - ERP data connectors
- 🔜 Member 4 (Controller) - Orchestration layer
- 🔜 Database - Store scenarios and decisions

---

## Notes

- This is a Python-only backend (no Node.js)
- FastAPI replaces Express.js
- All simulation logic is preserved from original Node.js code
- Async-ready architecture for future scaling

---
