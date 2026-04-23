import { useState } from 'react';
import { MetricsGrid } from './MetricsGrid';
import { DecisionFeed } from './DecisionFeed';
import { CashFlowChart } from './CashFlowChart';
import type { ScenarioName } from '../services/api';

export function DashboardView() {
  const [scenario, setScenario] = useState<ScenarioName>('Normal Market');

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

      <MetricsGrid />
      <DecisionFeed scenario={scenario} />
      <CashFlowChart />
    </div>
  );
}
