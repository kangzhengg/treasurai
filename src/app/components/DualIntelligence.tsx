import { Database, Newspaper, Brain, GitMerge, Activity, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export function DualIntelligence() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dual Intelligence Engine</h1>
          <p className="text-sm text-slate-400">
            Combining structured ERP data with unstructured market intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-300">GLM Active</span>
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
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Payables & Receivables</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last sync: 2 minutes ago</div>
              <div className="text-sm text-slate-300">
                • Total payables: RM 89.4M<br/>
                • USD exposure: $4.2M<br/>
                • EUR exposure: €2.4M
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Supplier Contracts</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last sync: 5 minutes ago</div>
              <div className="text-sm text-slate-300">
                • Active suppliers: 127<br/>
                • Annual spend: RM 420M<br/>
                • Renewals due (Q2): 18
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Cash Reserves</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last sync: 1 minute ago</div>
              <div className="text-sm text-slate-300">
                • MYR balance: RM 47.2M<br/>
                • USD balance: $2.1M<br/>
                • Credit available: RM 30M
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Historical Pricing</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last sync: 12 minutes ago</div>
              <div className="text-sm text-slate-300">
                • Price records: 24,847<br/>
                • Vendors tracked: 127<br/>
                • Avg price variance: 8.2%
              </div>
            </div>
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
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">FX News Feeds</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last update: 30 seconds ago</div>
              <div className="text-sm text-slate-300">
                • Reuters: 847 articles analyzed<br/>
                • Bloomberg: 612 articles analyzed<br/>
                • Sentiment: Mixed (Fed uncertainty)
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Economic Indicators</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last update: 3 minutes ago</div>
              <div className="text-sm text-slate-300">
                • Fed rate: 5.25% (watching)<br/>
                • ECB meeting: April 25, 2026<br/>
                • MYR volatility: +12% this week
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Industry Reports</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last update: 15 minutes ago</div>
              <div className="text-sm text-slate-300">
                • Market benchmarks updated<br/>
                • 34 supplier price changes detected<br/>
                • Industry overcapacity trend
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Competitor Intelligence</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400 mb-1">Last update: 8 minutes ago</div>
              <div className="text-sm text-slate-300">
                • Pricing data: 89 suppliers<br/>
                • Market avg updated: 42 categories<br/>
                • New entrants: 3 this quarter
              </div>
            </div>
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
