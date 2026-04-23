export type ScenarioName = "Normal Market" | "Oil Crisis" | "Interest Rate Drop";

export interface RecommendationDto {
  id: number;
  title: string;
  action: string;
  impact_amount: number;
  logic: string;
  news_signal: string;
  risk_level: "Low" | "Medium" | "High";
  priority: "high" | "medium" | "low";
  confidence: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchRecommendations(scenario: ScenarioName) {
  const response = await fetch(`${API_BASE}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
  });
  if (!response.ok) throw new Error("Failed to load recommendations");
  return response.json() as Promise<{
    scenario: ScenarioName;
    fallback: boolean;
    recommendations: RecommendationDto[];
  }>;
}

export async function runScenarioSimulation(scenario: ScenarioName) {
  const response = await fetch(`${API_BASE}/api/scenario/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
  });
  if (!response.ok) throw new Error("Failed to run scenario");
  return response.json() as Promise<{
    scenario: ScenarioName;
    fallback: boolean;
    summary: {
      recommendations: number;
      urgentActions: number;
      potentialSavings: number;
    };
    decisions: Array<{ title: string; action: string; priority: string }>;
  }>;
}

