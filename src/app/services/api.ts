export type ScenarioName = "Normal Market" | "Oil Crisis" | "Interest Rate Drop";

export interface RecommendationDto {
  id: number;
  title: string;
  action: string;
  estimated_savings: number;
  logic: string;
  news_signal: string;
  risk_level: "Low" | "Medium" | "High";
  priority: "high" | "medium" | "low" | "critical";
  confidence: string;
}

export interface DashboardResponse {
  success: boolean;
  summary: {
    total_annual_projected_savings: number;
    active_decisions_count: number;
    risk_status: string;
    last_update: string;
  };
  comparison: {
    previous_savings: number;
    previous_decisions_count: number;
    previous_monthly_savings: number;
    previous_success_rate: number;
  };
  system_status: {
    glm_engine: string;
    data_engine: string;
    simulation_engine: string;
  };
  latest_analysis: {
    glm_decision: {
      decisions: Array<{
        action: string;
        currency_pair?: string;
        amount: number;
        reasoning: string;
        risk_level: string;
        estimated_savings: number;
        confidence: number;
        reasoning_chain: string[];
        evidence_news: string[];
        evidence_internal: string[];
      }>;
      trade_offs: any[];
      projections: {
        monthly_savings: number;
        yearly_savings: number;
        roi_percentage: number;
      };
      metadata: {
        is_fallback: boolean;
      };
    };
    simulations: any[];
    cash_flow_projection?: Array<{
      date: string;
      original: number;
      optimized: number;
      inflow: number;
      outflow: number;
      optimizations: string[];
    }>;
    metadata: any;
    company_data?: any;
    news_data?: any[];
    market_context?: any;
  };
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8787";

export async function fetchDashboardData(scenario: ScenarioName): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE}/api/dashboard?scenario=${encodeURIComponent(scenario)}`);
  if (!response.ok) throw new Error("Failed to load dashboard data");
  return response.json();
}

export interface MappedDashboardData {
  success: boolean;
  summary: DashboardResponse['summary'];
  comparison: DashboardResponse['comparison'];
  projections: DashboardResponse['latest_analysis']['glm_decision']['projections'];
  decisions: RecommendationDto[];
  isFallback: boolean;
  cashFlowProjection: DashboardResponse['latest_analysis']['cash_flow_projection'];
  raw: DashboardResponse;
}

function derivePriority(d: any): "high" | "medium" | "low" | "critical" {
  const risk = d.risk_level?.toLowerCase();
  if (risk === 'high' || risk === 'critical') return 'high';
  if (risk === 'medium') return 'medium';
  return 'low';
}

function mapDecisionToRecommendation(d: any, index: number): RecommendationDto {
  return {
    id: d.id ?? index,
    title: d.action.replace(/_/g, ' '),
    action: d.action,
    estimated_savings: d.estimated_savings,
    confidence: `${(d.confidence * 100).toFixed(0)}%`,
    news_signal: d.reasoning,
    logic: (d.reasoning_chain || []).join('; '),
    risk_level: (d.risk_level.charAt(0).toUpperCase() + d.risk_level.slice(1).toLowerCase()) as any,
    priority: derivePriority(d),
  };
}

export async function fetchRecommendations(scenario: ScenarioName): Promise<{ recommendations: RecommendationDto[]; fallback: boolean }> {
  const data = await fetchDashboardData(scenario);
  const decisions = data.latest_analysis.glm_decision.decisions;
  const fallback = data.latest_analysis.glm_decision.metadata.is_fallback;
  const recommendations = decisions.map((d, i) => mapDecisionToRecommendation(d, i));
  return { recommendations, fallback };
}

export async function fetchDashboard(scenario: ScenarioName): Promise<MappedDashboardData> {
  const data = await fetchDashboardData(scenario);
  
  const decisions: RecommendationDto[] = data.latest_analysis.glm_decision.decisions.map((d, index) => 
    mapDecisionToRecommendation(d, index)
  );

  return {
    success: data.success,
    summary: data.summary,
    comparison: data.comparison,
    projections: data.latest_analysis.glm_decision.projections,
    decisions,
    isFallback: data.latest_analysis.glm_decision.metadata.is_fallback,
    cashFlowProjection: data.latest_analysis.cash_flow_projection,
    raw: data
  };
}

export async function runScenarioSimulation(scenario: ScenarioName) {
  const response = await fetch(`${API_BASE}/api/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
  });
  if (!response.ok) throw new Error("Failed to run scenario");
  return response.json();
}

export async function executeFXStrategy(strategy: string, params: any) {
  const response = await fetch(`${API_BASE}/api/fx/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strategy, ...params }),
  });
  if (!response.ok) throw new Error("Failed to execute strategy");
  return response.json();
}

export interface ROIOption {
  name: string;
  action: string;
  cost: string;
  risk: string;
  riskLevel: number;
  savings: string;
  savingsPercent: string;
  details: string[];
  recommended: boolean;
  strategy?: string;
}

export interface ROIScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export async function fetchROIScenarios(): Promise<ROIScenario[]> {
  try {
    const response = await fetch(`${API_BASE}/api/roi/scenarios`);
    if (!response.ok) throw new Error("Failed to fetch scenarios");
    return await response.json();
  } catch (error) {
    console.warn("Using fallback scenarios", error);
    return [
      { id: 'fx-hedge', title: 'FX Hedge Decision', description: 'USD/MYR exposure', icon: 'DollarSign' },
      { id: 'supplier-negotiation', title: 'Supplier Negotiation', description: 'Vendor Sigma pricing', icon: 'TrendingDown' },
      { id: 'payment-timing', title: 'Payment Timing', description: 'EUR payment strategy', icon: 'Clock' }
    ];
  }
}

export async function fetchROIScenarioOptions(scenarioId: string): Promise<ROIOption[]> {
  try {
    const response = await fetch(`${API_BASE}/api/roi/options?scenario=${encodeURIComponent(scenarioId)}`);
    if (!response.ok) throw new Error("Failed to fetch ROI options");
    const data = await response.json();
    
    return data.options.map((o: any) => {
      const isMillions = o.cost >= 1000000 || Math.abs(o.estimated_savings) >= 1000000;
      
      return {
        name: o.name,
        action: o.action,
        cost: isMillions 
          ? `RM ${(o.cost / 1000000).toFixed(2)}M${scenarioId.includes('supplier') ? '/year' : ''}` 
          : `RM ${(o.cost / 1000).toFixed(0)}K`,
        risk: o.risk_level,
        riskLevel: o.risk_level === 'LOW' ? 1 : o.risk_level === 'MEDIUM' ? 2 : 3,
        savings: Math.abs(o.estimated_savings) >= 1000000
          ? `${o.estimated_savings < 0 ? '-' : ''}RM ${(Math.abs(o.estimated_savings) / 1000000).toFixed(2)}M`
          : `${o.estimated_savings < 0 ? '-' : ''}RM ${(Math.abs(o.estimated_savings) / 1000).toFixed(0)}K`,
        savingsPercent: `${((o.estimated_savings / (o.cost + (o.estimated_savings > 0 ? 0 : Math.abs(o.estimated_savings)))) * 100).toFixed(1)}%`,
        details: o.details && o.details.length > 0 ? o.details : ["Automated AI analysis applied", "Risk mitigation strategy included", "Optimized for current market conditions"],
        recommended: o.confidence >= 0.85,
        strategy: o.action
      };
    });
  } catch (error) {
    console.warn("Using mock data for scenario options", error);
    // Return mock data if API fails
    const mockData: Record<string, ROIOption[]> = {
      'fx-hedge': [
        {
          name: "Forward Contract",
          action: "Lock rate at 4.72",
          cost: "RM 4.72M",
          risk: "LOW",
          riskLevel: 1,
          savings: "RM 120K",
          savingsPercent: "2.5%",
          details: ["Zero volatility risk", "Fixed cash flow projection", "100% protection against MYR weakness"],
          recommended: true,
          strategy: "FORWARD"
        },
        {
          name: "Vanilla Option",
          action: "Buy Call Option",
          cost: "RM 45K",
          risk: "MEDIUM",
          riskLevel: 2,
          savings: "RM 350K",
          savingsPercent: "7.4%",
          details: ["Participation in MYR strength", "Limited downside (premium only)", "Flexible execution window"],
          recommended: false,
          strategy: "OPTION"
        }
      ],
      'supplier-negotiation': [
        {
          name: "Volume Rebate",
          action: "Commit to +20% volume",
          cost: "RM 12.5M/year",
          risk: "MEDIUM",
          riskLevel: 2,
          savings: "RM 1.2M",
          savingsPercent: "9.6%",
          details: ["Tiered discount structure", "Inventory holding cost impact", "Quarterly performance review"],
          recommended: true,
          strategy: "REBATE"
        }
      ]
    };
    return mockData[scenarioId] || [];
  }
}

export interface NegotiationStrategyData {
  name: string;
  currentPrice: string;
  marketAverage: string;
  overpayment: string;
  annualSpend: string;
  potentialSavings: string;
  relationship: string;
  contractRenewal: string;
  marketPosition: string;
  negotiationStrategy: {
    opening: string;
    target: string;
    fallback: string;
    leverage: string[];
    approach: string[];
    script: string;
  };
}

export async function fetchSupplierNegotiation(supplierData: {
  supplier: string;
  current_price: number;
  quantity: number;
  category: string;
  relationship: string;
}): Promise<{ data: NegotiationStrategyData; source: string }> {
  const response = await fetch(`${API_BASE}/api/supplier/negotiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplierData),
  });
  if (!response.ok) throw new Error("Failed to fetch negotiation strategy");
  const result = await response.json();
  return { data: result.data, source: result.source || "STATIC" };
}

export interface FallbackBehaviorDto {
  id: string;
  title: string;
  activeMode: string;
  fallbackMode: string;
  description: string;
  icon: string; // lucide icon name to render
  color: "cyan" | "purple" | "blue" | "amber" | string;
}

export interface FallbackEngineStatusResponse {
  success: boolean;
  timestamp_utc: string;
  simulate_glm_down: boolean;
  glm_active: boolean;
  systemStatus: {
    apiResponseTime: {
      value_ms: number;
      threshold_ms: number;
      status: "healthy" | "degraded" | "failed" | string;
    };
    erpSync: {
      connected: boolean;
      last_sync_seconds: number | null;
      status: "healthy" | "degraded" | "failed" | string;
    };
    dataFreshness: {
      freshness_seconds: number | null;
      status: "healthy" | "degraded" | "failed" | string;
    };
    glmEngine: {
      status: "active" | "failed" | string;
      mode: "ONLINE" | "FALLBACK" | string;
      reason?: string;
    };
  };
  fallbackBehaviors: FallbackBehaviorDto[];
  glmDecisions?: Array<{
    action?: string;
    currency_pair?: string;
    amount?: number;
    reasoning?: string;
    risk_level?: string;
    estimated_savings?: number;
    confidence?: number;
  }> | null;
}

export async function fetchFallbackEngineStatus(opts?: { includeGlmDecisions?: boolean }): Promise<FallbackEngineStatusResponse> {
  const include = opts?.includeGlmDecisions ? "true" : "false";
  const response = await fetch(`${API_BASE}/api/system/fallback?include_glm_decisions=${include}`);
  if (!response.ok) throw new Error("Failed to load live system monitoring status");
  return response.json();
}

export async function setFallbackEngineSimulation(simulate_glm_down: boolean): Promise<{ success: boolean; simulate_glm_down: boolean }> {
  const response = await fetch(`${API_BASE}/api/system/fallback/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ simulate_glm_down }),
  });
  if (!response.ok) throw new Error("Failed to update fallback simulation");
  return response.json();
}

export interface FXRate {
  pair: string;
  rate: number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down';
  data?: number[];
}

export async function fetchLiveFXRates(): Promise<{ success: boolean; data: Record<string, number> }> {
  const response = await fetch(`${API_BASE}/api/fx/rates`);
  if (!response.ok) throw new Error("Failed to fetch FX rates");
  return response.json();
}

export interface NewsItem {
  headline: string;
  source: string;
  published_at?: string;
  impact?: 'high' | 'medium' | 'low';
}

export async function fetchLiveMarketNews(): Promise<{ success: boolean; data: NewsItem[] }> {
  try {
    const dashboardData = await fetchDashboard('Normal Market');
    const newsData = dashboardData.raw.latest_analysis.company_data?.news_data || [];
    
    // Map news data to NewsItem format
    const mappedNews: NewsItem[] = newsData.map((news: any) => ({
      headline: news.headline || news.title || 'Market Update',
      source: news.source || 'Market Data',
      published_at: news.published_at || new Date().toISOString(),
      impact: 'medium' as const, // Default impact level
    }));
    
    return { success: true, data: mappedNews };
  } catch (error) {
    console.error('Failed to fetch live market news:', error);
    throw error;
  }
}

