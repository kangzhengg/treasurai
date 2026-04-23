import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  ArrowRight,
  Brain,
  Zap,
  X
} from 'lucide-react';
import { fetchRecommendations, type RecommendationDto, type ScenarioName } from '../services/api';

interface DecisionFeedProps {
  scenario: ScenarioName;
}

export function DecisionFeed({ scenario }: DecisionFeedProps) {
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [decisions, setDecisions] = useState<RecommendationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchRecommendations(scenario);
        if (!mounted) return;
        setDecisions(data.recommendations);
        setIsFallback(data.fallback);
      } catch {
        if (!mounted) return;
        setDecisions([]);
        setIsFallback(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [scenario]);

  const totalImpact = useMemo(
    () => decisions.reduce((sum, decision) => sum + decision.impact_amount, 0),
    [decisions]
  );

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

      {isFallback && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
          FALLBACK MODE: Using 90-day historical averages.
        </div>
      )}
      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-400">Generating recommendations...</div>}
        {decisions.map((decision) => (
          <div key={decision.id}>
            <div
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
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
                        {decision.news_signal}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-lg font-semibold text-emerald-400">
                        Save RM {decision.impact_amount.toLocaleString()}
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

                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="text-cyan-300 font-medium">News signal:</span> {decision.news_signal}
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <h5 className="text-sm font-medium text-purple-300">AI Logic & Reasoning</h5>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {isFallback ? 'Statistically probable based on past 3 years.' : decision.logic}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Risk level: {decision.risk_level}</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    GLM Confidence: {decision.confidence}
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
            <p className="text-sm text-cyan-400/70">{decisions.length} actions ready for immediate execution</p>
          </div>
          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors">
            Potential RM {totalImpact.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
