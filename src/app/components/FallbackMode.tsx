import { useEffect, useMemo, useState } from 'react';
import { Shield, Activity, AlertCircle, CheckCircle2, Database, Wifi, Clock, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { fetchFallbackEngineStatus, setFallbackEngineSimulation, type FallbackBehaviorDto, type FallbackEngineStatusResponse } from '../services/api';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon className={className} />;
};

function formatAge(seconds: number | null | undefined) {
  if (seconds == null) return '—';
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ago`;
}

export function FallbackMode() {
  const [data, setData] = useState<FallbackEngineStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSim, setIsUpdatingSim] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classes = useMemo(() => {
    const colorClass: Record<string, { bg: string; text: string }> = {
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    };
    return (c?: string) => colorClass[c || ''] || { bg: 'bg-slate-500/10', text: 'text-slate-300' };
  }, []);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await fetchFallbackEngineStatus({ includeGlmDecisions: false });
      setData(status);
    } catch (e: any) {
      setError(e?.message || 'Failed to load status');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = window.setInterval(load, 15000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glmActive = data?.glm_active ?? true;
  const fallbackBehaviors: FallbackBehaviorDto[] = data?.fallbackBehaviors ?? [];
  const systemStatus = data?.systemStatus;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Live System Monitoring</h1>
          <p className="text-sm text-slate-400">
            Real-time health metrics, failover status, and system stabilization insights
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className={`border rounded-2xl p-6 transition-all ${
        glmActive
          ? 'bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/30'
          : 'bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              glmActive ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              {glmActive ? (
                <Shield className="w-8 h-8 text-emerald-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                GLM Engine Status: {glmActive ? 'ACTIVE' : 'FALLBACK MODE ACTIVATED'}
              </h2>
              <p className={`text-sm ${glmActive ? 'text-emerald-400' : 'text-red-400'}`}>
                {glmActive
                  ? 'All AI features operating normally'
                  : 'System running on historical data and rule-based logic'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {glmActive ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-300">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-sm font-medium text-red-300">Degraded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-4">System Health Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">API Response Time</span>
              </div>
              {systemStatus?.apiResponseTime.status === 'healthy' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">194 ms</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((systemStatus?.apiResponseTime.value_ms ?? 0) / (systemStatus?.apiResponseTime.threshold_ms ?? 200)) * 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-slate-500">
                &lt;{systemStatus?.apiResponseTime.threshold_ms ?? 200}ms
              </span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">ERP Sync Status</span>
              </div>
              {systemStatus?.erpSync.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {systemStatus?.erpSync.connected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-xs text-slate-500">
              Last sync: {formatAge(systemStatus?.erpSync.last_sync_seconds)}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Data Freshness</span>
              </div>
              {systemStatus?.dataFreshness.status === 'healthy' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {formatAge(systemStatus?.dataFreshness.freshness_seconds)}
            </div>
            <div className="text-xs text-slate-500">
              Updated: {formatAge(systemStatus?.dataFreshness.freshness_seconds)}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">GLM Engine</span>
              </div>
              {glmActive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 ${glmActive ? 'text-white' : 'text-red-400'}`}>
              {glmActive ? 'Active' : 'Failed'}
            </div>
            <div className="text-xs text-slate-500">
              Mode: {systemStatus?.glmEngine.mode ?? (glmActive ? 'ONLINE' : 'FALLBACK')}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-4">Fallback Behavior Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fallbackBehaviors.map((behavior, idx) => (
            <div
              key={behavior.id || idx}
              className={`border rounded-xl p-5 transition-all ${
                glmActive
                  ? 'bg-slate-900/30 border-slate-800'
                  : 'bg-slate-900/50 border-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  glmActive ? classes(behavior.color).bg : 'bg-amber-500/10'
                }`}>
                  {glmActive ? (
                    <IconRenderer name={behavior.icon} className={`w-5 h-5 ${classes(behavior.color).text}`} />
                  ) : (
                    <IconRenderer name={behavior.icon} className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{behavior.title}</h4>
                  {glmActive ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-sm text-emerald-300">Active Mode</span>
                      </div>
                      <p className="text-sm text-slate-400">{behavior.activeMode}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <span className="text-sm text-amber-300">Fallback Mode</span>
                      </div>
                      <p className="text-sm text-amber-400/80 font-medium">{behavior.fallbackMode}</p>
                    </div>
                  )}
                </div>
              </div>

              {!glmActive && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {behavior.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {data?.glmDecisions && data.glmDecisions.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-3">Latest GLM Decisions (diagnostic)</h3>
          <div className="space-y-3">
            {data.glmDecisions.map((d, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-100 truncate">
                      {d.action || 'Decision'} {d.currency_pair ? `(${d.currency_pair})` : ''}
                    </div>
                    {d.reasoning && <div className="text-xs text-slate-400 mt-1">{d.reasoning}</div>}
                  </div>
                  <div className="text-right text-xs text-slate-400 whitespace-nowrap">
                    {d.risk_level ? <div>Risk: {d.risk_level}</div> : null}
                    {typeof d.confidence === 'number' ? <div>Conf: {(d.confidence * 100).toFixed(0)}%</div> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!glmActive && (
        <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-300 mb-2">Operating in Fallback Mode</h3>
              <p className="text-sm text-amber-400/80 mb-3 leading-relaxed">
                The GLM engine is currently unavailable. TreasurAI has automatically switched to fallback mode, using historical data and rule-based logic. While core functionality remains operational, recommendations may be less accurate and contextual intelligence is limited.
              </p>
              <ul className="space-y-1 text-sm text-amber-300">
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>Recommendations based on 90-day historical averages</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>No real-time market news integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>Limited scenario simulation capabilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>Static negotiation strategies only</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
