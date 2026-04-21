import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Brain,
  FileText,
  TrendingDown,
  X
} from 'lucide-react';

export function DecisionFeed() {
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const decisions = [
    {
      id: 1,
      title: 'FX Hedge MYR/USD - Window closing in 48h',
      description: 'AI recommends hedging 45% of Q3 USD exposure based on current volatility trends and historical data analysis.',
      priority: 'high',
      savings: 'Save RM 2.1M',
      confidence: '94%',
      action: 'Convert now →',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/20',
      xai: {
        newsUsed: ['Fed signals potential rate hike in Q3 2026', 'USD showing strength vs emerging market currencies', 'MYR volatility increased 12% this week'],
        internalData: ['Q3 USD payables: $4.2M due in 48 days', 'Current USD/MYR rate: 4.72', 'Cash reserves: RM 47M available'],
        logic: 'Based on Fed communication patterns and macro indicators, USD is likely to strengthen 2-3% over next 45 days. Converting now locks in favorable rate and avoids potential RM 2.1M increase in costs.',
        dataSource: 'Structured: ERP payables | Unstructured: Reuters, Bloomberg news feeds',
        glmConfidence: '94%',
      }
    },
    {
      id: 2,
      title: 'Delay EUR payment 4 days - Rate move expected post ECB meeting',
      description: 'Historical pattern analysis suggests EUR/MYR rate improvement of 0.8% likely. Delay carries minimal counterparty risk.',
      priority: 'medium',
      savings: 'Save RM 340K',
      confidence: '87%',
      action: 'Schedule delay',
      icon: Clock,
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/5',
      borderColor: 'border-orange-500/20',
      xai: {
        newsUsed: ['ECB meeting scheduled April 25, 2026', 'European inflation data trending down', 'ECB historically signals rate cuts after inflation decreases'],
        internalData: ['EUR payment to EuroWind GmbH: €180K (RM 910K)', 'Payment deadline: April 28 (flexible)', 'Supplier relationship: 8 years, low risk'],
        logic: 'ECB meeting in 4 days likely to signal rate cuts based on inflation trends. Historical data shows EUR typically weakens 0.6-1.2% post-dovish signals. Delaying payment by 4 days has minimal supplier risk.',
        dataSource: 'Structured: Payment schedule | Unstructured: ECB calendar, financial news',
        glmConfidence: '87%',
      }
    },
    {
      id: 3,
      title: 'Renegotiate Vendor Sigma pricing - Opportunity 8.1% in market',
      description: 'Market benchmarking shows 8.1% premium vs comparable suppliers. GLM suggests structured payment to secure better rates.',
      priority: 'high',
      savings: 'Save RM 12.8M',
      confidence: '91%',
      action: 'Start negotiation',
      icon: Target,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/5',
      borderColor: 'border-cyan-500/20',
      xai: {
        newsUsed: ['Vendor Sigma market position weakening', 'Competitor pricing decreased 5-8% in Q1 2026', 'Industry overcapacity driving prices down'],
        internalData: ['Current price: RM 152/unit (annual: RM 42M)', 'Market average: RM 140/unit', 'Annual volume: 276K units', 'Contract renewal: June 2026'],
        logic: 'Market benchmarking shows you are paying 8.6% above market average. With industry overcapacity and competitor pricing pressure, Vendor Sigma is likely to accept 6-8% reduction to retain business. Timing is optimal with contract renewal approaching.',
        dataSource: 'Structured: Procurement data | Unstructured: Industry reports, competitor pricing',
        glmConfidence: '91%',
      }
    },
    {
      id: 4,
      title: 'Consider hedging EUR exposure - Volatility spike forecast',
      description: 'AI detects elevated EUR volatility risk over next 30 days based on Fed communication patterns and macro indicators.',
      priority: 'medium',
      savings: 'Avoid RM 1.9M risk',
      confidence: '78%',
      action: 'Review options',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/5',
      borderColor: 'border-yellow-500/20',
      xai: {
        newsUsed: ['Geopolitical tensions rising in Europe', 'EUR/USD volatility index up 18%', 'Multiple central banks signaling policy uncertainty'],
        internalData: ['Total EUR exposure: €2.4M', 'Unhedged position: 85%', 'Average payment timeline: 60-90 days'],
        logic: 'Historical volatility patterns suggest 2.5-4% EUR fluctuation risk over next 30 days. Hedging 50% of exposure provides downside protection while maintaining upside potential. Cost of hedging: RM 45K vs potential loss RM 1.9M.',
        dataSource: 'Structured: FX exposure report | Unstructured: Volatility indices, news sentiment',
        glmConfidence: '78%',
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Active Recommendations</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
            <option>Priority</option>
            <option>Savings</option>
            <option>Confidence</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {decisions.map((decision) => (
          <div key={decision.id}>
            <div
              className={`bg-slate-900/50 backdrop-blur-sm border ${decision.borderColor} rounded-xl p-5 hover:border-slate-600 transition-all group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${decision.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <decision.icon className={`w-6 h-6 ${decision.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{decision.title}</h3>
                        {decision.priority === 'high' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded border border-red-500/20">
                            HIGH
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {decision.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-lg font-semibold text-emerald-400">
                        {decision.savings}
                      </span>
                      <span className="text-xs text-slate-500">
                        AI confidence: {decision.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => setSelectedDecision(selectedDecision === decision.id ? null : decision.id)}
                      className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      {selectedDecision === decision.id ? 'Hide reasoning' : 'Why this decision?'}
                    </button>
                    <button
                      onClick={() => {
                        const chartElement = document.getElementById('cash-flow-chart');
                        chartElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Show Changes
                    </button>
                    <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      {decision.action}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {selectedDecision === decision.id && (
              <div className="mt-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-300">Explainable AI (XAI)</h4>
                      <p className="text-xs text-purple-400/70">Understanding the recommendation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDecision(null)}
                    className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-purple-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <h5 className="text-sm font-medium text-cyan-300">News Sources Used</h5>
                    </div>
                    <ul className="space-y-2">
                      {decision.xai.newsUsed.map((news, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{news}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <h5 className="text-sm font-medium text-emerald-300">Internal Data</h5>
                    </div>
                    <ul className="space-y-2">
                      {decision.xai.internalData.map((data, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{data}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <h5 className="text-sm font-medium text-purple-300">AI Logic & Reasoning</h5>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{decision.xai.logic}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    <span className="font-medium text-slate-300">Data Sources:</span> {decision.xai.dataSource}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    GLM Confidence: {decision.xai.glmConfidence}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-cyan-300">Quick Wins Available</h3>
            <p className="text-sm text-cyan-400/70">3 low-risk actions ready for immediate execution</p>
          </div>
          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors">
            View all
          </button>
        </div>
      </div>
    </div>
  );
}
