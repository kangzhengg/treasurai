import { useState } from 'react';
import { Play, AlertTriangle, TrendingUp, Zap, CheckCircle2, XCircle } from 'lucide-react';

export function ScenarioMode() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const scenarios = [
    {
      id: 'normal',
      name: 'Normal Market Conditions',
      description: 'Stable FX rates, standard supplier pricing, no major events',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/20',
      results: {
        recommendations: 3,
        urgentActions: 0,
        potentialSavings: 'RM 840K',
        decisions: [
          { title: 'Standard FX monitoring', action: 'Continue current strategy', priority: 'low' },
          { title: 'Routine payment processing', action: 'Process as scheduled', priority: 'low' },
          { title: 'Quarterly supplier review', action: 'Schedule review next month', priority: 'low' },
        ],
      },
    },
    {
      id: 'oil-crisis',
      name: 'Oil Price Crisis',
      description: 'Sudden 40% oil price spike, MYR weakening, supplier costs rising',
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/5',
      borderColor: 'border-red-500/20',
      results: {
        recommendations: 8,
        urgentActions: 4,
        potentialSavings: 'RM 8.2M',
        decisions: [
          { title: 'URGENT: Hedge USD exposure immediately', action: 'Convert 75% of USD payables now', priority: 'critical' },
          { title: 'Accelerate EUR payments', action: 'Pay early to lock rates', priority: 'high' },
          { title: 'Renegotiate energy-linked contracts', action: 'Start negotiations with 3 suppliers', priority: 'high' },
          { title: 'Activate hedging strategy', action: 'Implement full hedging on SGD/USD', priority: 'high' },
          { title: 'Review cash reserves', action: 'Increase reserves by 15%', priority: 'medium' },
        ],
      },
    },
    {
      id: 'supplier-overcharge',
      name: 'Supplier Overcharging Detected',
      description: 'Multiple suppliers charging 8-15% above market average',
      icon: TrendingUp,
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/5',
      borderColor: 'border-orange-500/20',
      results: {
        recommendations: 5,
        urgentActions: 2,
        potentialSavings: 'RM 24.6M',
        decisions: [
          { title: 'Renegotiate Vendor Sigma pricing', action: 'Target 8-10% reduction', priority: 'high' },
          { title: 'Renegotiate TechParts Ltd', action: 'Target 12% reduction', priority: 'high' },
          { title: 'Source alternative suppliers', action: 'Identify 2-3 competitors', priority: 'medium' },
          { title: 'Leverage bulk purchasing', action: 'Consolidate orders for better rates', priority: 'medium' },
          { title: 'Contract renewal strategy', action: 'Time renewals with market weakness', priority: 'low' },
        ],
      },
    },
    {
      id: 'fed-rate-hike',
      name: 'Fed Emergency Rate Hike',
      description: 'Unexpected 0.75% Fed rate increase, USD surging',
      icon: Zap,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/5',
      borderColor: 'border-yellow-500/20',
      results: {
        recommendations: 6,
        urgentActions: 3,
        potentialSavings: 'RM 5.4M',
        decisions: [
          { title: 'Immediate USD conversion', action: 'Convert all due-in-30-days USD payables', priority: 'critical' },
          { title: 'Delay USD receivables collection', action: 'Extend terms where possible', priority: 'high' },
          { title: 'Activate emergency hedging', action: 'Hedge 90% of USD exposure', priority: 'high' },
          { title: 'Review credit lines', action: 'Secure additional MYR credit', priority: 'medium' },
        ],
      },
    },
  ];

  const handleRunScenario = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const activeData = scenarios.find(s => s.id === activeScenario);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Scenario Simulation Mode</h1>
          <p className="text-sm text-slate-400">
            Test AI decisions under different market conditions before committing
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Play className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Testing Environment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`bg-slate-900/50 backdrop-blur-sm border ${scenario.borderColor} rounded-xl p-5 hover:border-slate-600 transition-all`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${scenario.bgColor} flex items-center justify-center flex-shrink-0`}>
                <scenario.icon className={`w-6 h-6 ${scenario.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{scenario.name}</h3>
                <p className="text-sm text-slate-400">{scenario.description}</p>
              </div>
            </div>

            <button
              onClick={() => handleRunScenario(scenario.id)}
              disabled={isRunning}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeScenario === scenario.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Play className="w-4 h-4" />
              {activeScenario === scenario.id ? 'Running...' : 'Run Scenario'}
            </button>
          </div>
        ))}
      </div>

      {activeScenario && !isRunning && activeData && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Scenario Results: {activeData.name}</h2>
              <p className="text-sm text-slate-400">GLM analysis complete</p>
            </div>
            <button
              onClick={() => setActiveScenario(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              Clear Results
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Total Recommendations</div>
              <div className="text-3xl font-mono font-bold text-cyan-400">{activeData.results.recommendations}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Urgent Actions</div>
              <div className="text-3xl font-mono font-bold text-red-400">{activeData.results.urgentActions}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Potential Savings</div>
              <div className="text-3xl font-mono font-bold text-emerald-400">{activeData.results.potentialSavings}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">AI Recommendations</h3>
            <div className="space-y-2">
              {activeData.results.decisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{decision.title}</h4>
                        {decision.priority === 'critical' && (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">
                            CRITICAL
                          </span>
                        )}
                        {decision.priority === 'high' && (
                          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded border border-orange-500/20">
                            HIGH
                          </span>
                        )}
                        {decision.priority === 'medium' && (
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">
                            MEDIUM
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{decision.action}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!activeScenario && (
        <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Play className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">Select a scenario above to run simulation</p>
        </div>
      )}
    </div>
  );
}
