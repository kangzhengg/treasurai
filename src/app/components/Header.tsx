import { Bell, User, Shield, Wifi, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  onToggleIntelligence: () => void;
}

export function Header({ activeView, onToggleIntelligence }: HeaderProps) {
  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Decision Feed', subtitle: 'AI-powered treasury recommendations' },
    simulator: { title: 'ROI Simulator', subtitle: 'Compare trade-offs & optimize decisions' },
    intelligence: { title: 'Dual Intelligence Engine', subtitle: 'Structured + Unstructured data analysis' },
    negotiation: { title: 'Negotiation Generator', subtitle: 'Smart supplier negotiation strategies' },
    scenario: { title: 'Scenario Simulation', subtitle: 'Test decisions before committing' },
    impact: { title: 'Impact Calculator', subtitle: 'Quantify savings & project value' },
    fallback: { title: 'Live System Monitoring', subtitle: 'Real-time health metrics, failover status, and system stabilization insights' },
    settings: { title: 'AI Configuration', subtitle: 'System settings & preferences' },
  };

  const currentView =
    viewTitles[activeView] ??
    viewTitles.dashboard ?? {
      title: 'Decision Feed',
      subtitle: 'AI-powered treasury recommendations',
    };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0d1117]/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-medium">{currentView.title}</h2>
        <p className="text-xs text-slate-400">{currentView.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleIntelligence}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/20 transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs font-medium">Live Intel</span>
        </button>

        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">GLM Engine</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            <Wifi className="w-3 h-3" />
            <span className="text-xs font-medium">ACTIVE</span>
          </div>
        </div>

        <button className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
        </button>

        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-slate-800/50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm">Bloomify</span>
        </button>
      </div>
    </header>
  );
}
