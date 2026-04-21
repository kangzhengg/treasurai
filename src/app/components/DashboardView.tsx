import { MetricsGrid } from './MetricsGrid';
import { DecisionFeed } from './DecisionFeed';
import { CashFlowChart } from './CashFlowChart';

export function DashboardView() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Decision Feed</h1>
        <p className="text-sm text-slate-400">
          AI-powered treasury recommendations and insights
        </p>
      </div>

      <MetricsGrid />
      <DecisionFeed />
      <CashFlowChart />
    </div>
  );
}
