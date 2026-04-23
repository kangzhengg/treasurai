import { useState } from 'react';
import { Settings, Sliders, Link2, Bell, Users, CheckCircle2, XCircle } from 'lucide-react';

export function SettingsPage() {
  const [riskLevel, setRiskLevel] = useState(65);
  const [permissions, setPermissions] = useState({
    executeTrades: true,
    viewOnly: false,
    adminAccess: true,
  });

  const apiConnections = [
    {
      name: 'SAP ERP',
      status: 'connected',
      lastSync: '2 minutes ago',
      health: 100,
    },
    {
      name: 'Oracle Financials',
      status: 'connected',
      lastSync: '5 minutes ago',
      health: 98,
    },
    {
      name: 'Bloomberg News API',
      status: 'connected',
      lastSync: '30 seconds ago',
      health: 100,
    },
    {
      name: 'Reuters FX Data',
      status: 'connected',
      lastSync: '14 seconds ago',
      health: 100,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Configuration & Settings</h1>
          <p className="text-sm text-slate-400">
            Configure AI behavior, integrations, and system preferences
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">Enterprise Settings</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Risk Calibration</h2>
            <p className="text-sm text-slate-400">Adjust AI recommendation sensitivity</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-300">Hedging Sensitivity Level</span>
              <span className="text-sm font-mono font-semibold text-cyan-400">{riskLevel}%</span>
            </div>

            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={riskLevel}
                onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${riskLevel}%, #1e293b ${riskLevel}%, #1e293b 100%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                {riskLevel < 33 && (
                  <span>
                    <span className="font-semibold text-emerald-400">Conservative:</span> AI will recommend hedging and risk mitigation more frequently. Prioritizes capital preservation over potential gains.
                  </span>
                )}
                {riskLevel >= 33 && riskLevel < 67 && (
                  <span>
                    <span className="font-semibold text-cyan-400">Balanced:</span> AI balances risk and opportunity. Standard recommendation profile suitable for most treasury operations.
                  </span>
                )}
                {riskLevel >= 67 && (
                  <span>
                    <span className="font-semibold text-amber-400">Aggressive:</span> AI prioritizes maximum savings opportunities. Will recommend fewer hedges and more market timing strategies.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">API Gateway</h2>
            <p className="text-sm text-slate-400">External system integrations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apiConnections.map((api, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-white mb-1">{api.name}</h3>
                  <p className="text-xs text-slate-500">Last sync: {api.lastSync}</p>
                </div>
                {api.status === 'connected' ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded border border-red-500/20">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">Disconnected</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Health</span>
                  <span className="font-mono font-semibold text-emerald-400">{api.health}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${api.health}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Threshold Triggers</h2>
            <p className="text-sm text-slate-400">Configure alert thresholds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <label className="text-sm text-slate-300 mb-2 block">
              Notify if savings exceeds
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">RM</span>
              <input
                type="number"
                defaultValue="500000"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <label className="text-sm text-slate-300 mb-2 block">
              Alert if risk level is
            </label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
              <option>LOW or above</option>
              <option>MEDIUM or above</option>
              <option selected>HIGH only</option>
              <option>CRITICAL only</option>
            </select>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <label className="text-sm text-slate-300 mb-2 block">
              Trigger hedge if volatility exceeds
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                defaultValue="15"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <label className="text-sm text-slate-300 mb-2 block">
              Auto-execute decisions below
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">RM</span>
              <input
                type="number"
                defaultValue="50000"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">User Permissions</h2>
            <p className="text-sm text-slate-400">Control system access levels</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div>
              <h4 className="font-medium text-white mb-1">Execute Trades</h4>
              <p className="text-sm text-slate-400">Allow AI to execute recommended actions automatically</p>
            </div>
            <button
              onClick={() => setPermissions({ ...permissions, executeTrades: !permissions.executeTrades })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                permissions.executeTrades ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  permissions.executeTrades ? 'translate-x-6' : ''
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div>
              <h4 className="font-medium text-white mb-1">View Only Mode</h4>
              <p className="text-sm text-slate-400">Disable all execution capabilities, view recommendations only</p>
            </div>
            <button
              onClick={() => setPermissions({ ...permissions, viewOnly: !permissions.viewOnly })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                permissions.viewOnly ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  permissions.viewOnly ? 'translate-x-6' : ''
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div>
              <h4 className="font-medium text-white mb-1">Admin Access</h4>
              <p className="text-sm text-slate-400">Full system access including settings and configuration</p>
            </div>
            <button
              onClick={() => setPermissions({ ...permissions, adminAccess: !permissions.adminAccess })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                permissions.adminAccess ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  permissions.adminAccess ? 'translate-x-6' : ''
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors">
          Reset to Defaults
        </button>
        <button className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
