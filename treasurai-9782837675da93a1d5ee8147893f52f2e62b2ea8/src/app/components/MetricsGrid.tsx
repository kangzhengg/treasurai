import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

export function MetricsGrid() {
  const metrics = [
    {
      label: 'Potential Savings',
      value: 'RM 47.2M',
      change: '+12.5%',
      trend: 'up',
      subtitle: 'vs last quarter',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Decisions Pending',
      value: '4,714',
      change: '+234',
      trend: 'up',
      subtitle: 'requiring action',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      label: 'ROI Impact',
      value: 'RM 8.9M',
      change: '+8.2%',
      trend: 'up',
      subtitle: 'this month',
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      label: 'Success Rate',
      value: '91.3%',
      change: '+2.1%',
      trend: 'up',
      subtitle: 'AI accuracy',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              {metric.label}
            </span>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.gradient} opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center`}>
              {metric.trend === 'up' ? (
                <TrendingUp className={`w-5 h-5 bg-gradient-to-br ${metric.gradient} bg-clip-text text-transparent`} />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className={`text-3xl font-mono font-bold bg-gradient-to-br ${metric.gradient} bg-clip-text text-transparent`}>
              {metric.value}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-mono font-medium ${
                metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {metric.change}
              </span>
              <span className="text-xs text-slate-500">{metric.subtitle}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
