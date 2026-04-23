import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

const ERP_PAYLOAD = {
  payables_rm: 6200000,
  receivables_rm: 9100000,
  cash_balance_rm: 4300000,
};

const scenarioMap = {
  "Normal Market": "Normal",
  "Oil Crisis": "Crisis",
  "Interest Rate Drop": "Rate Drop",
};

const SYSTEM_PROMPT =
  "You are a Treasury Management GLM. Analyze ERP data (Payables, Receivables, Cash Balance) and Market Scenarios (Normal, Crisis, Rate Drop). Output a JSON array of 3 recommendations. Each must include: 'title', 'action', 'impact_amount', 'logic', 'news_signal', and 'risk_level'.";

function safeParseRecommendations(text) {
  const normalized = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed)) throw new Error("Gemini output is not an array");
  return parsed.slice(0, 3).map((item, idx) => ({
    id: idx + 1,
    title: item.title ?? "Treasury Action",
    action: item.action ?? "Review Decision",
    impact_amount: Number(item.impact_amount) || 0,
    logic: item.logic ?? "No logic supplied",
    news_signal: item.news_signal ?? "No signal supplied",
    risk_level: item.risk_level ?? "Medium",
    priority: item.risk_level === "High" ? "high" : "medium",
    confidence: item.risk_level === "Low" ? "92%" : item.risk_level === "High" ? "81%" : "87%",
  }));
}

function fallbackRecommendations() {
  return [
    {
      id: 1,
      title: "Delay EUR payment by 3 days",
      action: "Schedule delay",
      impact_amount: 340000,
      logic: "Statistically probable based on past 3 years.",
      news_signal: "Historical EUR mean reversion after dovish ECB communication.",
      risk_level: "Medium",
      priority: "medium",
      confidence: "85%",
    },
    {
      id: 2,
      title: "Execute partial USD conversion",
      action: "Convert now",
      impact_amount: 520000,
      logic: "Statistically probable based on past 3 years.",
      news_signal: "Historical MYR drawdown tendency during commodity volatility spikes.",
      risk_level: "Low",
      priority: "high",
      confidence: "89%",
    },
    {
      id: 3,
      title: "Renegotiate top supplier settlement terms",
      action: "Start negotiation",
      impact_amount: 760000,
      logic: "Statistically probable based on past 3 years.",
      news_signal: "Historic supplier discount windows cluster around quarter transitions.",
      risk_level: "High",
      priority: "high",
      confidence: "80%",
    },
  ];
}

async function generateRecommendations(scenario) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return { recommendations: fallbackRecommendations(), fallback: true };
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = [
    SYSTEM_PROMPT,
    `Scenario: ${scenarioMap[scenario] ?? "Normal"}`,
    `ERP data: ${JSON.stringify(ERP_PAYLOAD)}`,
    "Return valid JSON only.",
  ].join("\n\n");

  try {
    const result = await model.generateContent(prompt);
    const recommendations = safeParseRecommendations(result.response.text());
    return { recommendations, fallback: false };
  } catch {
    return { recommendations: fallbackRecommendations(), fallback: true };
  }
}

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", service: "TreasurAI backend" });
});

app.get("/api/intelligence/live", (_, res) => {
  res.json({
    fx_rates: [
      { pair: "MYR/USD", rate: 0.2124, sparkline: [0.209, 0.21, 0.2112, 0.2117, 0.2124] },
      { pair: "MYR/EUR", rate: 0.1967, sparkline: [0.1988, 0.1982, 0.1979, 0.1971, 0.1967] },
    ],
    news_ticker: [
      "Brent crude volatility rises as OPEC supply guidance narrows.",
      "US bond yields hold firm, near-term USD demand supported.",
      "Regional procurement indices suggest softer Q3 contract pricing.",
    ],
  });
});

app.post("/api/recommendations", async (req, res) => {
  const scenario = req.body?.scenario || "Normal Market";
  const result = await generateRecommendations(scenario);
  res.json({
    scenario,
    fallback: result.fallback,
    recommendations: result.recommendations,
  });
});

app.post("/api/scenario/simulate", async (req, res) => {
  const scenario = req.body?.scenario || "Normal Market";
  const { recommendations, fallback } = await generateRecommendations(scenario);
  const potentialSavings = recommendations.reduce((sum, item) => sum + (item.impact_amount || 0), 0);
  const urgentActions = recommendations.filter((item) => item.risk_level === "High").length;

  res.json({
    scenario,
    fallback,
    summary: {
      recommendations: recommendations.length,
      urgentActions,
      potentialSavings,
    },
    decisions: recommendations.map((item) => ({
      title: item.title,
      action: item.action,
      priority: item.priority,
    })),
  });
});

app.listen(PORT, () => {
  console.log(`TreasurAI backend running on http://localhost:${PORT}`);
});

