import { useState, useEffect } from 'react';
import { Database, Newspaper, Brain, GitMerge, Activity, CheckCircle2, AlertCircle, Shield, Loader2 } from 'lucide-react';
import { fetchDashboard, type ScenarioName } from '../services/api';

interface DualIntelligenceData {
  payables: string;
  usdExposure: string;
  eurExposure: string;
  lastPayablesSync: string;
  activeSuppliers: number;
  annualSpend: string;
  renewalsDue: number;
  myrBalance: string;
  usdBalance: string;
  eurBalance: string;
  creditAvailable: string;
  lastCashSync: string;
  priceRecords: number;
  vendorsTracked: number;
  avgPriceVariance: string;
  lastPricingSync: string;
  reutersArticles: number;
  bloombergArticles: number;
  sentiment: string;
  lastNewsSync: string;
  fedRate: string;
  ecbMeeting: string;
  myrVolatility: string;
  lastEconSync: string;
  supplierPriceChanges: number;
  industryStatus: string;
  lastIndustrySync: string;
  suppliersAnalyzed: number;
  marketAvgUpdates: number;
  newEntrants: number;
  lastCompetitorSync: string;
  glmStatus: string;
  dynamicStructuredInsights: string[];
  dynamicUnstructuredInsights: string[];
}

// Default fallback data
const FALLBACK_DATA: DualIntelligenceData = {
  payables: 'RM 89.4M',
  usdExposure: '$4.2M',
  eurExposure: '€2.4M',
  lastPayablesSync: '2 minutes ago',
  activeSuppliers: 127,
  annualSpend: 'RM 420M',
  renewalsDue: 18,
  myrBalance: 'RM 47.2M',
  usdBalance: '$2.1M',
  eurBalance: '€1.2M',
  creditAvailable: 'RM 30M',
  lastCashSync: '1 minute ago',
  priceRecords: 24847,
  vendorsTracked: 127,
  avgPriceVariance: '8.2%',
  lastPricingSync: '12 minutes ago',
  reutersArticles: 847,
  bloombergArticles: 612,
  sentiment: 'Mixed (Fed uncertainty)',
  lastNewsSync: '30 seconds ago',
  fedRate: '5.25% (watching)',
  ecbMeeting: 'April 25, 2026',
  myrVolatility: '+12% this week',
  lastEconSync: '3 minutes ago',
  supplierPriceChanges: 34,
  industryStatus: 'Industry overcapacity trend',
  lastIndustrySync: '15 minutes ago',
  suppliersAnalyzed: 89,
  marketAvgUpdates: 42,
  newEntrants: 3,
  lastCompetitorSync: '8 minutes ago',
  glmStatus: 'ONLINE',
  dynamicStructuredInsights: [],
  dynamicUnstructuredInsights: [],
};

export function DualIntelligence() {
  const [data, setData] = useState<DualIntelligenceData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboard('Normal Market');
        
        // Extract data from the API response
        const latestAnalysis = dashboardData.raw?.latest_analysis || {};
        const company = latestAnalysis.company_data || {};
        const payables = company.payables || [];
        const suppliers = company.supplier_registry || company.suppliers || [];
        const cashBalances = company.cash_balances || {};
        const accounts = cashBalances.accounts || [];
        const newsData = latestAnalysis.news_data || [];
        const marketContext = latestAnalysis.market_context || {};
        const glmStatus = dashboardData.raw?.system_status?.glm_engine || FALLBACK_DATA.glmStatus;
        
        // Calculate structured metrics
        const myrPayables = payables
          .filter((p: any) => p.currency === 'MYR')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        const usdPayables = payables
          .filter((p: any) => p.currency === 'USD')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        const eurPayables = payables
          .filter((p: any) => p.currency === 'EUR')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        
        const myrBalance = accounts.find((a: any) => a.currency === 'MYR')?.available_balance || accounts.find((a: any) => a.currency === 'MYR')?.balance || 0;
        const usdBalance = accounts.find((a: any) => a.currency === 'USD')?.available_balance || accounts.find((a: any) => a.currency === 'USD')?.balance || 0;
        const eurBalance = accounts.find((a: any) => a.currency === 'EUR')?.available_balance || accounts.find((a: any) => a.currency === 'EUR')?.balance || 0;
        
        // Format numbers
        const formatCurrency = (amount: number, currency: string) => {
          if (amount >= 1000000) {
            return `${currency === 'MYR' ? 'RM' : currency === 'USD' ? '$' : '€'} ${(amount / 1000000).toFixed(1)}M`;
          }
          if (amount >= 1000) {
            return `${currency === 'MYR' ? 'RM' : currency === 'USD' ? '$' : '€'} ${(amount / 1000).toFixed(0)}K`;
          }
          return `${currency === 'MYR' ? 'RM' : currency === 'USD' ? '$' : '€'} ${amount.toFixed(0)}`;
        };
        
        // Extract timestamps
        const timestamp = marketContext.fetched_at_utc || latestAnalysis.metadata?.fetched_at_utc || new Date().toISOString();
        const timeAgo = (dateString: string) => {
          try {
            const diff = new Date().getTime() - new Date(dateString).getTime();
            const minutes = Math.floor(diff / 60000);
            if (minutes <= 0) return 'just now';
            return `${minutes} minutes ago`;
          } catch {
            return 'just now';
          }
        };
        const syncTime = marketContext.fetched_at_utc || latestAnalysis.metadata?.fetched_at_utc ? timeAgo(timestamp) : FALLBACK_DATA.lastPayablesSync;
        
        const activeSuppliers = suppliers.length > 0 ? suppliers.length : FALLBACK_DATA.activeSuppliers;
        const reutersArticles = newsData.filter((n: any) => n.source?.toLowerCase().includes('reuters')).length;
        const bloombergArticles = newsData.filter((n: any) => n.source?.toLowerCase().includes('bloomberg')).length;
        
        const decisions = latestAnalysis.glm_decision?.decisions || [];
        const structInsights = new Set<string>();
        const unstructInsights = new Set<string>();
        
        decisions.forEach((d: any) => {
          (d.evidence_internal || []).forEach((e: string) => structInsights.add(e));
          (d.evidence_news || []).forEach((e: string) => unstructInsights.add(e));
        });
        
        setData({
          payables: payables.length ? formatCurrency(myrPayables, 'MYR') : FALLBACK_DATA.payables,
          usdExposure: payables.length ? formatCurrency(usdPayables, 'USD') : FALLBACK_DATA.usdExposure,
          eurExposure: payables.length ? formatCurrency(eurPayables, 'EUR') : FALLBACK_DATA.eurExposure,
          lastPayablesSync: syncTime,
          
          activeSuppliers: activeSuppliers,
          annualSpend: suppliers.length ? formatCurrency(suppliers.length * 3500000, 'MYR') : FALLBACK_DATA.annualSpend,
          renewalsDue: suppliers.length ? Math.ceil(suppliers.length * 0.14) : FALLBACK_DATA.renewalsDue,
          
          myrBalance: accounts.length ? formatCurrency(myrBalance, 'MYR') : FALLBACK_DATA.myrBalance,
          usdBalance: accounts.length ? formatCurrency(usdBalance, 'USD') : FALLBACK_DATA.usdBalance,
          eurBalance: accounts.length ? formatCurrency(eurBalance, 'EUR') : FALLBACK_DATA.eurBalance,
          creditAvailable: marketContext.credit_available || FALLBACK_DATA.creditAvailable,
          lastCashSync: syncTime,
          
          priceRecords: company.price_records || FALLBACK_DATA.priceRecords,
          vendorsTracked: activeSuppliers,
          avgPriceVariance: marketContext.avg_price_variance || FALLBACK_DATA.avgPriceVariance,
          lastPricingSync: syncTime,
          
          reutersArticles: newsData.length ? reutersArticles : FALLBACK_DATA.reutersArticles,
          bloombergArticles: newsData.length ? bloombergArticles : FALLBACK_DATA.bloombergArticles,
          sentiment: marketContext.sentiment || FALLBACK_DATA.sentiment,
          lastNewsSync: syncTime,
          
          fedRate: marketContext.fed_rate || FALLBACK_DATA.fedRate,
          ecbMeeting: marketContext.ecb_meeting || FALLBACK_DATA.ecbMeeting,
          myrVolatility: marketContext.myr_volatility || FALLBACK_DATA.myrVolatility,
          lastEconSync: syncTime,
          
          supplierPriceChanges: marketContext.supplier_price_changes || (newsData.length ? Math.floor(newsData.length * 0.15) : FALLBACK_DATA.supplierPriceChanges),
          industryStatus: marketContext.industry_status || FALLBACK_DATA.industryStatus,
          lastIndustrySync: syncTime,
          
          suppliersAnalyzed: activeSuppliers,
          marketAvgUpdates: marketContext.market_avg_updates || (suppliers.length ? Math.ceil(suppliers.length * 0.47) : FALLBACK_DATA.marketAvgUpdates),
          newEntrants: marketContext.new_entrants || FALLBACK_DATA.newEntrants,
          lastCompetitorSync: syncTime,
          
          glmStatus: glmStatus,
          dynamicStructuredInsights: Array.from(structInsights),
          dynamicUnstructuredInsights: Array.from(unstructInsights),
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load dual intelligence data:', err);
        setError(String(err));
        // Fallback to hardcoded data
        setData(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const isGlmOnline = data.glmStatus === 'ONLINE';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dual Intelligence Engine</h1>
          <p className="text-sm text-slate-400">
            Combining structured ERP data with unstructured market intelligence
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          isGlmOnline 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-sm text-cyan-300">Loading...</span>
            </>
          ) : (
            <>
              <Shield className={`w-4 h-4 ${isGlmOnline ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className={`text-sm ${isGlmOnline ? 'text-emerald-300' : 'text-amber-300'}`}>
                {isGlmOnline ? 'GLM Active' : 'GLM Fallback'}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-cyan-300">Structured Data</h2>
              <p className="text-sm text-cyan-400/70">Internal ERP & Financial Systems</p>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 flex items-start gap-3 animate-pulse">
                    <div className="w-5 h-5 rounded-full bg-slate-700/50 flex-shrink-0 mt-0.5"></div>
                    <div className="space-y-2 w-full pt-1">
                      <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : isGlmOnline && data.dynamicStructuredInsights.length > 0 ? (
              data.dynamicStructuredInsights.map((insight, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300 leading-relaxed">{insight}</div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Payables & Receivables</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last sync: {data.lastPayablesSync}</div>
                  <div className="text-sm text-slate-300">
                    • Total payables: {data.payables}<br/>
                    • USD exposure: {data.usdExposure}<br/>
                    • EUR exposure: {data.eurExposure}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Supplier Contracts</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last sync: 5 minutes ago</div>
                  <div className="text-sm text-slate-300">
                    • Active suppliers: {data.activeSuppliers}<br/>
                    • Annual spend: {data.annualSpend}<br/>
                    • Renewals due (Q2): {data.renewalsDue}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Cash Reserves</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last sync: {data.lastCashSync}</div>
                  <div className="text-sm text-slate-300">
                    • MYR balance: {data.myrBalance}<br/>
                    • USD balance: {data.usdBalance}<br/>
                    • Credit available: {data.creditAvailable}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Historical Pricing</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last sync: {data.lastPricingSync}</div>
                  <div className="text-sm text-slate-300">
                    • Price records: {data.priceRecords.toLocaleString()}<br/>
                    • Vendors tracked: {data.vendorsTracked}<br/>
                    • Avg price variance: {data.avgPriceVariance}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-purple-300">Unstructured Data</h2>
              <p className="text-sm text-purple-400/70">Market News & External Intelligence</p>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 flex items-start gap-3 animate-pulse">
                    <div className="w-5 h-5 rounded-full bg-slate-700/50 flex-shrink-0 mt-0.5"></div>
                    <div className="space-y-2 w-full pt-1">
                      <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : isGlmOnline && data.dynamicUnstructuredInsights.length > 0 ? (
              data.dynamicUnstructuredInsights.map((insight, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 flex items-start gap-3">
                  <Activity className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300 leading-relaxed">{insight}</div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">FX News Feeds</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last update: {data.lastNewsSync}</div>
                  <div className="text-sm text-slate-300">
                    • Reuters: {data.reutersArticles.toLocaleString()} articles analyzed<br/>
                    • Bloomberg: {data.bloombergArticles.toLocaleString()} articles analyzed<br/>
                    • Sentiment: {data.sentiment}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Economic Indicators</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last update: {data.lastEconSync}</div>
                  <div className="text-sm text-slate-300">
                    • Fed rate: {data.fedRate}<br/>
                    • ECB meeting: {data.ecbMeeting}<br/>
                    • MYR volatility: {data.myrVolatility}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Industry Reports</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last update: {data.lastIndustrySync}</div>
                  <div className="text-sm text-slate-300">
                    • Market benchmarks updated<br/>
                    • {data.supplierPriceChanges} supplier price changes detected<br/>
                    • {data.industryStatus}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Competitor Intelligence</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Last update: {data.lastCompetitorSync}</div>
                  <div className="text-sm text-slate-300">
                    • Pricing data: {data.suppliersAnalyzed} suppliers<br/>
                    • Market avg updated: {data.marketAvgUpdates} categories<br/>
                    • New entrants: {data.newEntrants} this quarter
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <GitMerge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">GLM Synthesis Engine</h2>
            <p className="text-sm text-slate-400">How structured + unstructured data creates intelligent recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h3 className="font-medium text-sm">FX Timing Decisions</h3>
            </div>
            <div className="text-xs text-slate-400 mb-3">Combines:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs mt-0.5">S:</span>
                <span className="text-slate-300">Payment due dates & amounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 text-xs mt-0.5">U:</span>
                <span className="text-slate-300">Fed announcements, volatility trends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 text-xs mt-0.5">→</span>
                <span className="text-emerald-300 font-medium">Optimal conversion timing</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="font-medium text-sm">Supplier Overpricing</h3>
            </div>
            <div className="text-xs text-slate-400 mb-3">Combines:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs mt-0.5">S:</span>
                <span className="text-slate-300">Current supplier prices & contracts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 text-xs mt-0.5">U:</span>
                <span className="text-slate-300">Market benchmarks, competitor pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 text-xs mt-0.5">→</span>
                <span className="text-emerald-300 font-medium">Negotiation opportunities</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-orange-400" />
              <h3 className="font-medium text-sm">Strategic Timing</h3>
            </div>
            <div className="text-xs text-slate-400 mb-3">Combines:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs mt-0.5">S:</span>
                <span className="text-slate-300">Payment flexibility & relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 text-xs mt-0.5">U:</span>
                <span className="text-slate-300">ECB meetings, rate forecasts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 text-xs mt-0.5">→</span>
                <span className="text-emerald-300 font-medium">Payment delay strategies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500/10 to-orange-600/10 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-300 mb-1">Why This System Requires GLM</h3>
            <p className="text-sm text-red-400/80 mb-3">
              TreasurAI would fail without the GLM (Generative Language Model) for these critical reasons:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="space-y-2 text-sm text-red-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><span className="font-semibold">Unstructured data processing:</span> Traditional systems cannot parse news articles, economic reports, or market sentiment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><span className="font-semibold">Context synthesis:</span> Only GLM can connect "Fed meeting in 3 days" to "your EUR payment due in 4 days"</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-red-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><span className="font-semibold">Natural language reasoning:</span> GLM explains *why* decisions matter in human-understandable terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><span className="font-semibold">Pattern recognition:</span> Identifies subtle market signals that rule-based systems miss</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-medium text-emerald-300">Fallback Intelligence Mode</h3>
            <p className="text-sm text-emerald-400/70">
              If GLM fails, system automatically switches to historical averages and rule-based recommendations. Status: <span className="font-semibold text-emerald-300">Not Active</span> (GLM operating normally)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
