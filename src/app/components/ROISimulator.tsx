import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { fetchROIScenarioOptions, fetchROIScenarios, executeFXStrategy, type ROIOption, type ROIScenario } from '../services/api';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon className={className} />;
};

export function ROISimulator() {
  const [scenarios, setScenarios] = useState<ROIScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [options, setOptions] = useState<ROIOption[]>([]);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [executing, setExecuting] = useState<string | null>(null);
  const [executed, setExecuted] = useState<string | null>(null);

  // Fetch all scenarios dynamically
  useEffect(() => {
    async function loadScenarios() {
      setIsLoadingScenarios(true);
      try {
        const data = await fetchROIScenarios();
        setScenarios(data);
        if (data.length > 0 && !selectedScenarioId) {
          setSelectedScenarioId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
      } finally {
        setIsLoadingScenarios(false);
      }
    }
    loadScenarios();
  }, []);

  // Fetch options for the active scenario
  const activeScenarioId = selectedScenarioId || (scenarios.length > 0 ? scenarios[0].id : null);

  useEffect(() => {
    if (!activeScenarioId) return;

    async function loadOptions() {
      setIsLoadingOptions(true);
      try {
        const data = await fetchROIScenarioOptions(activeScenarioId!);
        setOptions(data);
      } catch (error) {
        console.error("Failed to fetch ROI options:", error);
        setOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    loadOptions();
  }, [activeScenarioId]);

  const activeScenario = scenarios.find(s => s.id === activeScenarioId);

  const handleExecute = async (option: ROIOption) => {
    setExecuting(option.name);
    try {
      if (option.strategy) {
        await executeFXStrategy(option.strategy, {
          scenario: 'NORMAL',
          amount: 1000000,
          currency: 'USD'
        });
      }
      setExecuted(option.name);
      setTimeout(() => setExecuted(null), 3000);
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setExecuting(null);
    }
  };

  if (isLoadingScenarios && scenarios.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Trade-off & ROI Simulator</h1>
          <p className="text-sm text-slate-400">
            Compare decision options and optimize your strategy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">Dynamic AI Scenarios</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Compare Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenarioId(s.id)}
              className={`p-4 rounded-lg border transition-all text-left ${
                activeScenarioId === s.id
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <IconRenderer name={s.icon} className="w-5 h-5 mb-2" />
              <div className="font-medium text-sm">{s.title}</div>
              <div className="text-xs opacity-70">{s.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {isLoadingOptions && (
          <div className="absolute inset-0 z-10 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <span className="text-sm text-slate-300 font-medium">Analyzing Scenario...</span>
            </div>
          </div>
        )}

        <h2 className="text-lg font-medium mb-4">{activeScenario?.title || 'Strategy Simulation'} - Compare Options</h2>
        
        {options.length === 0 && !isLoadingOptions ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-slate-800 rounded-xl">
            <AlertCircle className="w-10 h-10 text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">No AI data available for this scenario</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((option, idx) => (
              <div
                key={idx}
                className={`bg-slate-900/50 backdrop-blur-sm border rounded-xl p-5 transition-all flex flex-col ${
                  option.recommended
                    ? 'border-emerald-500/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium mb-1">{option.name}</h3>
                    {option.recommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                        <Shield className="w-3 h-3" />
                        AI Recommended
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4 flex-grow">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Total Cost</div>
                    <div className="text-2xl font-mono font-bold text-white">{option.cost}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Risk Level</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-full rounded-full ${
                              level <= option.riskLevel
                                ? option.riskLevel === 1
                                  ? 'bg-yellow-500'
                                  : option.riskLevel === 2
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{option.risk}</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1">Savings</div>
                      <div className={`font-mono font-bold ${
                        option.savings.startsWith('-') ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {option.savingsPercent}
                      </div>
                      <div className="text-xs font-mono text-slate-400">{option.savings}</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <div className="text-xs text-slate-400 mb-2">Key Details:</div>
                    <ul className="space-y-1.5">
                      {option.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleExecute(option)}
                    disabled={!!executing || !!executed}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      executed === option.name
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : option.recommended
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {executing === option.name ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Executing...
                      </>
                    ) : executed === option.name ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Executed Successfully
                      </>
                    ) : (
                      'Execute This Option'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

