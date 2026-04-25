# TreasurAI

TreasurAI is an intelligent financial decision-support platform that combines advanced data analysis with AI-driven insights to help businesses make smarter financial and operational decisions. It leverages dual intelligence layers — traditional statistical models and generative AI — to deliver real-time analysis of cash flows, ROI projections, scenario planning, and supplier negotiation strategies.

## 🚀 Key Features

- **Dual Intelligence Layer**: Combines GLM (Generalized Linear Models) with generative AI for robust financial analysis
- **Cash Flow Projections**: Real-time cash flow forecasting with scenario-based modeling
- **ROI Simulation**: Advanced return-on-investment calculators for data-driven investment decisions
- **Scenario Planning**: Test multiple business scenarios and compare outcomes instantly
- **Supplier Negotiation**: AI-powered recommendations for supplier negotiation strategies
- **Real-Time Dashboard**: Interactive visualizations of financial metrics, trends, and KPIs
- **ERP Data Integration**: Seamlessly ingest and process enterprise data from ERP systems
- **Decision Feed**: Live intelligence feed with actionable recommendations and alerts

## 🧱 Architecture Overview

### Backend (/backend)

- **FastAPI Server**: High-performance REST API for all financial analysis services
- **Dual Intelligence Layer**: Combines traditional statistical models (GLM) with generative AI reasoning
- **Data Processing**: Automated data ingestion, cleaning, and validation from ERP systems
- **Business Services**: Specialized modules for cash flow projection, ROI calculation, and scenario management

### Simulation & Analysis (/backend/simulation)

- FX simulation and market scenario modeling
- ROI calculator with sensitivity analysis
- Supplier negotiation engine with deal optimization

### Frontend (/src)

- **React + Vite UI**: Modern, responsive dashboard for real-time financial monitoring
- **Interactive Charts**: Cash flow visualizations and trend analysis
- **Decision Intelligence**: Live feed of AI-generated insights and recommendations
- **Scenario Simulator**: Build and compare multiple business scenarios

## ⚙️ Prerequisites

- Python 3.12+ (recommended)
- Node.js 18+ / npm
- FastAPI and required Python dependencies

## 🧩 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Start the backend server

```bash
python main.py
```

The API will be available at: `http://localhost:8000`

## 🖥 Frontend Setup

```bash
npm install
npm run dev
```

The React UI will be served at: `http://localhost:5173`

## 📊 Using TreasurAI

1. Start the backend server for API access and financial analysis
2. Launch the frontend for interactive dashboards and visualizations
3. Upload or connect your ERP data for analysis
4. Review AI-generated insights in the Decision Feed
5. Use Scenario Mode to test different business strategies
6. Export reports and recommendations for stakeholder review
  