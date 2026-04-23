import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  MessageSquare,
  Calculator,
  DollarSign,
  Layers,
  Settings,
  AlertCircle
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const coreItems = [
    { id: 'dashboard', label: 'Decision Feed', icon: LayoutDashboard, badge: 4 },
    { id: 'simulator', label: 'ROI Simulator', icon: TrendingUp },
    { id: 'intelligence', label: 'Dual Intelligence', icon: Brain },
    { id: 'negotiation', label: 'Negotiation AI', icon: MessageSquare },
  ];

  const analyticsItems = [
    { id: 'scenario', label: 'Scenario Mode', icon: Layers },
    { id: 'impact', label: 'Impact Calculator', icon: Calculator },
  ];

  const systemItems = [
    { id: 'fallback', label: 'Fallback Engine', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d1117] border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Treasur AI</h1>
            <p className="text-xs text-slate-400">v2.0</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-3">
          <div>
            <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Core
            </h3>
            {coreItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeView === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-cyan-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div>
            <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Analytics
            </h3>
            {analyticsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeView === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              System
            </h3>
            {systemItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeView === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">GLM Status</span>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500">Last sync: 14s ago</p>
        </div>
      </div>
    </aside>
  );
}
