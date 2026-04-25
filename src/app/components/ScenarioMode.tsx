import { useState } from 'react';
import { Play, AlertTriangle, TrendingUp, Zap, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { runScenarioSimulation, type ScenarioName } from '../services/api';

export function ScenarioMode() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const scenarios = [
    {
      id: 'normal',
      name: 'Normal Market Conditions',
      description: 'Stable FX rates, standard supplier pricing, no major events',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/20',
      apiName: 'Normal Market'
    },
    {
      id: 'oil-crisis',
      name: 'Oil Price Crisis',
      description: 'Sudden 40% oil price spike, MYR weakening, supplier costs rising',
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/5',
      borderColor: 'border-red-500/20',
      apiName: 'Oil Crisis'
    },
    {
      id: 'supplier-distress',
      name: 'Supplier Default Risk',
      description: 'Major supplier signals financial distress, supply chain risk',
      icon: TrendingUp,
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/5',
      borderColor: 'border-orange-500/20',
      apiName: 'Supplier Default Risk'
    },
    {
      id: 'fed-rate-hike',
      name: 'Emergency Rate Drop',
      description: 'Unexpected 0.75% rate decrease, USD weakening rapidly',
      icon: Zap,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/5',
      borderColor: 'border-yellow-500/20',
      apiName: 'Interest Rate Drop'
    },
  ];

  const handleRunScenario = async (scenario: typeof scenarios[0]) => {
    setActiveScenario(scenario.id);
    setIsRunning(true);
    setResult(null);
    try {
      const data = await runScenarioSimulation(scenario.apiName as any);
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        error: true,
        metadata: { is_fallback: true },
        glm_decision: { decisions: [] }
      });
    } finally {
      setIsRunning(false);
    }
  };

  const activeData = scenarios.find(s => s.id === activeScenario);

  // Parse results dynamically
  const isFallback = result?.metadata?.is_fallback || result?.glm_decision?.metadata?.is_fallback || false;
  const decisions = result?.glm_decision?.decisions || [];
  
  const urgentActions = decisions.filter((d: any) => 
    d.risk_level?.toUpperCase() === 'HIGH' || 
    d.risk_level?.toUpperCase() === 'CRITICAL' ||
    d.priority?.toLowerCase() === 'high' ||
    d.priority?.toLowerCase() === 'critical'
  ).length;

  const totalSavings = decisions.reduce((sum: number, d: any) => {
    return sum + (Number(d.estimated_savings) || 0);
  }, 0);

  const formatSavings = (amount: number) => {
    if (amount >= 1000000) return `RM ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `RM ${(amount / 1000).toFixed(0)}K`;
    return `RM ${amount.toLocaleString()}`;
  };

  const getPriorityBadge = (decision: any) => {
    const risk = decision.risk_level?.toUpperCase() || '';
    const prio = decision.priority?.toUpperCase() || '';
    if (risk === 'CRITICAL' || prio === 'CRITICAL') return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">CRITICAL</span>;
    if (risk === 'HIGH' || prio === 'HIGH') return <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded border border-orange-500/20">HIGH</span>;
    if (risk === 'LOW' || prio === 'LOW') return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">LOW</span>;
    return <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">MEDIUM</span>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Scenario Simulation Mode</h1>
          <p className="text-sm text-slate-400">
            Inject hypothetical "What-If" market scenarios into the GLM engine to test system resilience
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Play className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">GLM Injection Testing</span>
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
              onClick={() => handleRunScenario(scenario)}
              disabled={isRunning}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeScenario === scenario.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRunning && activeScenario === scenario.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Scenario
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {activeScenario && activeData && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Simulation Results: {activeData.name}</h2>
              <p className="text-sm text-slate-400">
                {isRunning ? "GLM is actively analyzing this scenario..." : "Analysis complete"}
              </p>
            </div>
            {!isRunning && (
              <button
                onClick={() => {
                  setActiveScenario(null);
                  setResult(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                Clear Results
              </button>
            )}
          </div>

          {isRunning ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
              <div className="text-slate-300 font-medium">Injecting "{activeData.name}" into GLM Engine...</div>
              <div className="text-sm text-slate-500 mt-2">Re-evaluating all ERP data under simulated crisis conditions</div>
            </div>
          ) : result ? (
            <>
              {isFallback && (
                <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-yellow-400">Deterministic Fallback Active</div>
                    <div className="text-xs text-yellow-500/80 mt-1">GLM API was unavailable. Recommendations generated using predefined scenario simulation rules.</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Total Recommendations</div>
                  <div className="text-3xl font-mono font-bold text-cyan-400">
                    {decisions.length}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Urgent Actions</div>
                  <div className="text-3xl font-mono font-bold text-red-400">
                    {urgentActions}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Potential Preserved Cash</div>
                  <div className="text-3xl font-mono font-bold text-emerald-400">
                    {formatSavings(totalSavings)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">AI Defenses & Mitigations</h3>
                {decisions.length === 0 ? (
                  <div className="text-sm text-slate-500 p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                    No decisions were generated.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {decisions.map((decision: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm text-slate-200">
                                {decision.title || decision.action?.replace(/_/g, ' ')}
                              </h4>
                              {getPriorityBadge(decision)}
                            </div>
                            <p className="text-sm text-cyan-300 font-medium">{decision.action}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-emerald-400">{formatSavings(decision.estimated_savings || 0)}</div>
                            <div className="text-xs text-slate-500 mt-1">Conf: {(decision.confidence * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                        {decision.reasoning && (
                          <div className="text-sm text-slate-400 border-t border-slate-800 pt-2 mt-2">
                            {decision.reasoning}
                          </div>
                        )}
                        {decision.reasoning_chain && decision.reasoning_chain.length > 0 && (
                          <div className="mt-2 pl-3 border-l-2 border-slate-700">
                            {decision.reasoning_chain.map((chain: string, cIdx: number) => (
                              <div key={cIdx} className="text-xs text-slate-500">• {chain}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {!activeScenario && (
        <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Play className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">Select a scenario above to inject it into the live GLM engine</p>
        </div>
      )}
    </div>
  );
}
