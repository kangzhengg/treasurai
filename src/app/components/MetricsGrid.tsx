import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsGridProps {
  summary?: {
    total_annual_projected_savings: number;
    active_decisions_count: number;
    risk_status: string;
  };
  comparison?: {
    previous_savings: number;
    previous_decisions_count: number;
    previous_monthly_savings: number;
    previous_success_rate: number;
  };
  projections?: {
    monthly_savings: number;
    yearly_savings: number;
    roi_percentage: number;
  };
  currentSuccessRate?: number;
  loading?: boolean;
}

export function MetricsGrid({ summary, comparison, projections, currentSuccessRate = 0, loading }: MetricsGridProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `RM ${(val / 1000).toFixed(1)}K`;
    return `RM ${val.toFixed(0)}`;
  };

  // Helper to compute change percentage
  const calcChangePercent = (current: number, previous: number) => {
    if (!previous || previous === 0) return current > 0 ? '+100%' : '0%';
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  };

  const previousSuccessRate = comparison?.previous_success_rate ?? 0;
  const successRateChange = calcChangePercent(currentSuccessRate, previousSuccessRate);

  // Compute changes
  const savingsChange = comparison 
    ? calcChangePercent(summary?.total_annual_projected_savings || 0, comparison.previous_savings) 
    : '---';
    
  const decisionsDiff = (summary?.active_decisions_count || 0) - (comparison?.previous_decisions_count || 0);
  const decisionsChange = comparison 
    ? `${decisionsDiff >= 0 ? '+' : ''}${decisionsDiff}` 
    : '---';
    
  const roiChange = comparison 
    ? calcChangePercent(projections?.monthly_savings || 0, comparison.previous_monthly_savings) 
    : '---';

  const metrics = [
    {
      label: 'Potential Savings',
      value: loading ? '...' : formatCurrency(summary?.total_annual_projected_savings || 0),
      change: savingsChange,
      trend: (summary?.total_annual_projected_savings || 0) >= (comparison?.previous_savings || 0) ? 'up' : 'down',
      subtitle: 'vs last quarter',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Decisions Pending',
      value: loading ? '...' : (summary?.active_decisions_count || 0).toString(),
      change: decisionsChange,
      trend: (summary?.active_decisions_count || 0) >= (comparison?.previous_decisions_count || 0) ? 'up' : 'down',
      subtitle: 'requiring action',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      label: 'ROI Impact',
      value: loading ? '...' : formatCurrency(projections?.monthly_savings || 0),
      change: roiChange,
      trend: (projections?.monthly_savings || 0) >= (comparison?.previous_monthly_savings || 0) ? 'up' : 'down',
      subtitle: 'this month',
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      label: 'Success Rate',
      value: loading ? '...' : `${currentSuccessRate.toFixed(1)}%`,
      change: successRateChange,
      trend: currentSuccessRate >= previousSuccessRate ? 'up' : 'down',
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
                <TrendingUp className="w-5 h-5 text-cyan-400" />
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
