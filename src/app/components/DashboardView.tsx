import { useState, useEffect, useMemo } from 'react';
import { MetricsGrid } from './MetricsGrid';
import { DecisionFeed } from './DecisionFeed';
import { CashFlowChart } from './CashFlowChart';
import { fetchDashboard, type RecommendationDto, type ScenarioName, type MappedDashboardData } from '../services/api';

export function DashboardView() {
  const [scenario, setScenario] = useState<ScenarioName>('Normal Market');
  const [data, setData] = useState<MappedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chart control 
  const [selectedDecisionId, setSelectedDecisionId] = useState<number | null>(null);
  const [showAllComparison, setShowAllComparison] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setSelectedDecisionId(null);
      setShowAllComparison(false);
      try {
        const result = await fetchDashboard(scenario);
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [scenario]);

  const decisions = data?.decisions || [];
  
  // Derive the selected decision object 
  const selectedDecision = useMemo(
    () => decisions.find((d: RecommendationDto) => d.id === selectedDecisionId) || null,
    [decisions, selectedDecisionId]
  );

  const currentSuccessRate = decisions.length 
    ? (decisions.reduce((sum: number, d: RecommendationDto) => sum + parseFloat(d.confidence), 0) / decisions.length)
    : 0;

  // When the user clicks "Show Changes" on a recommendation 
  const handleShowChanges = (id: number) => {
    setSelectedDecisionId(id);
    setShowAllComparison(false);
    setTimeout(() => {
      document.getElementById('cash-flow-chart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Toggle all comparison from the chart itself 
  const handleToggleAllComparison = () => {
    setShowAllComparison(prev => !prev);
    setSelectedDecisionId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Decision Feed</h1>
          <p className="text-sm text-slate-400">
            AI-powered treasury recommendations and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Scenario</span>
          <select
            value={scenario}
            onChange={(event) => setScenario(event.target.value as ScenarioName)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="Normal Market">Normal Market</option>
            <option value="Oil Crisis">Oil Crisis</option>
            <option value="Interest Rate Drop">Interest Rate Drop</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          Error: {error}
        </div>
      )}

      <MetricsGrid 
        summary={data?.summary} 
        comparison={data?.comparison}
        projections={data?.projections}
        currentSuccessRate={currentSuccessRate}
        loading={loading}
      />
      
      <DecisionFeed 
        decisions={decisions}
        isFallback={data?.isFallback}
        loading={loading}
        onShowChanges={handleShowChanges}
        selectedDecisionId={selectedDecisionId}
      />
      
      <CashFlowChart 
        selectedDecision={selectedDecision}
        allDecisions={decisions}
        showAllComparison={showAllComparison}
        onToggleAllComparison={handleToggleAllComparison}
        loading={loading}
      />
    </div>
  );
}
