import { useState } from 'react';
import { Shield, Activity, AlertCircle, CheckCircle2, Database, Wifi, Clock } from 'lucide-react';

export function FallbackMode() {
  const [glmActive, setGlmActive] = useState(true);

  const systemStatus = {
    apiResponseTime: { value: 124, threshold: 200, status: 'healthy' },
    erpSync: { value: 'Connected', lastSync: '2 min ago', status: 'healthy' },
    dataFreshness: { value: '98.4%', lastUpdate: '14 sec ago', status: 'healthy' },
    glmEngine: { value: glmActive ? 'Active' : 'Failed', uptime: '99.94%', status: glmActive ? 'active' : 'failed' },
  };

  const fallbackBehaviors = [
    {
      title: 'Decision Feed',
      activeMode: 'GLM-powered real-time recommendations',
      fallbackMode: 'Using 90-day rolling averages',
      description: 'Historical pattern matching based on similar market conditions from past 90 days',
      icon: Activity,
      color: 'cyan',
    },
    {
      title: 'Negotiation Engine',
      activeMode: 'Market intelligence + competitive analysis',
      fallbackMode: 'Using historical supplier benchmarks',
      description: 'Static pricing comparisons from last benchmark update (weekly)',
      icon: Database,
      color: 'purple',
    },
    {
      title: 'ROI Simulator',
      activeMode: 'Dynamic scenario modeling with live data',
      fallbackMode: 'Running static scenario models',
      description: 'Pre-computed scenarios based on historical volatility patterns',
      icon: Shield,
      color: 'blue',
    },
    {
      title: 'Alerting System',
      activeMode: 'Context-aware intelligent alerts',
      fallbackMode: 'Threshold-based alerts only',
      description: 'Simple rule-based triggers when metrics exceed defined limits',
      icon: AlertCircle,
      color: 'amber',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Fallback Intelligence Mode</h1>
          <p className="text-sm text-slate-400">
            System reliability and failover behavior
          </p>
        </div>
        <button
          onClick={() => setGlmActive(!glmActive)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
        >
          {glmActive ? 'Simulate GLM Failure' : 'Restore GLM'}
        </button>
      </div>

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
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {systemStatus.apiResponseTime.value}ms
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${(systemStatus.apiResponseTime.value / systemStatus.apiResponseTime.threshold) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-slate-500">
                &lt;{systemStatus.apiResponseTime.threshold}ms
              </span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">ERP Sync Status</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {systemStatus.erpSync.value}
            </div>
            <div className="text-xs text-slate-500">
              Last sync: {systemStatus.erpSync.lastSync}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Data Freshness</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {systemStatus.dataFreshness.value}
            </div>
            <div className="text-xs text-slate-500">
              Updated: {systemStatus.dataFreshness.lastUpdate}
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
              {systemStatus.glmEngine.value}
            </div>
            <div className="text-xs text-slate-500">
              Uptime: {systemStatus.glmEngine.uptime}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-4">Fallback Behavior Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fallbackBehaviors.map((behavior, idx) => (
            <div
              key={idx}
              className={`border rounded-xl p-5 transition-all ${
                glmActive
                  ? 'bg-slate-900/30 border-slate-800'
                  : 'bg-slate-900/50 border-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  glmActive
                    ? `bg-${behavior.color}-500/10`
                    : 'bg-amber-500/10'
                }`}>
                  <behavior.icon className={`w-5 h-5 ${
                    glmActive
                      ? `text-${behavior.color}-400`
                      : 'text-amber-400'
                  }`} />
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
