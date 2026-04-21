import { DollarSign, TrendingUp, Calendar, Target, Zap } from 'lucide-react';

export function ImpactCalculator() {
  const decisions = [
    {
      id: 1,
      title: 'FX Hedge MYR/USD Conversion',
      date: 'April 15, 2026',
      actualSavings: 'RM 2.14M',
      status: 'completed',
      timeline: 'Executed on time',
    },
    {
      id: 2,
      title: 'Vendor Sigma Price Negotiation',
      date: 'March 28, 2026',
      actualSavings: 'RM 3.2M',
      status: 'completed',
      timeline: 'Completed early',
    },
    {
      id: 3,
      title: 'EUR Payment Delay Strategy',
      date: 'April 10, 2026',
      actualSavings: 'RM 340K',
      status: 'completed',
      timeline: 'Executed as planned',
    },
    {
      id: 4,
      title: 'SGD Hedge Position',
      date: 'March 5, 2026',
      actualSavings: 'RM 1.82M',
      status: 'completed',
      timeline: 'Executed on time',
    },
    {
      id: 5,
      title: 'TechParts Ltd Renegotiation',
      date: 'Pending',
      actualSavings: 'RM 2.6M (projected)',
      status: 'pending',
      timeline: 'Scheduled: May 2026',
    },
  ];

  const monthlyData = [
    { month: 'Jan 2026', savings: 'RM 840K' },
    { month: 'Feb 2026', savings: 'RM 1.2M' },
    { month: 'Mar 2026', savings: 'RM 5.36M' },
    { month: 'Apr 2026', savings: 'RM 2.48M' },
  ];

  const totalExecuted = 7.5; // RM 7.5M
  const totalPending = 2.6; // RM 2.6M
  const projectedYearly = 31.4; // RM 31.4M

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Impact Calculator</h1>
          <p className="text-sm text-slate-400">
            Quantify savings and project annual value from AI decisions
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-300">Financial Impact</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-medium">EXECUTED SAVINGS</div>
              <div className="text-sm text-emerald-400/70">Year to date</div>
            </div>
          </div>
          <div className="text-4xl font-mono font-bold text-emerald-400">RM {totalExecuted}M</div>
          <div className="mt-2 text-sm text-emerald-400/70">From 4 executed decisions</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs text-cyan-400 font-medium">PENDING DECISIONS</div>
              <div className="text-sm text-cyan-400/70">Projected impact</div>
            </div>
          </div>
          <div className="text-4xl font-mono font-bold text-cyan-400">RM {totalPending}M</div>
          <div className="mt-2 text-sm text-cyan-400/70">1 decision in progress</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-purple-400 font-medium">PROJECTED YEARLY</div>
              <div className="text-sm text-purple-400/70">Full year 2026</div>
            </div>
          </div>
          <div className="text-4xl font-mono font-bold text-purple-400">RM {projectedYearly}M</div>
          <div className="mt-2 text-sm text-purple-400/70">Based on decision velocity</div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Monthly Savings Breakdown</h2>
        <div className="space-y-3">
          {monthlyData.map((month, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-24 text-sm text-slate-400">{month.month}</div>
              <div className="flex-1 bg-slate-800 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-end px-4"
                  style={{ width: `${((parseFloat(month.savings.replace(/[^\d.]/g, '')) / 5.36) * 100).toFixed(0)}%` }}
                >
                  <span className="text-sm font-medium text-white">{month.savings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Decision History</h2>
        <div className="space-y-3">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{decision.title}</h3>
                    {decision.status === 'completed' ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {decision.date}
                    </span>
                    <span>{decision.timeline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-mono font-bold ${
                    decision.status === 'completed' ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    {decision.actualSavings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-purple-300 mb-2">ROI Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-purple-400/80 mb-3">
                  Based on current decision velocity and accuracy rate (91%), TreasurAI is on track to deliver:
                </p>
                <ul className="space-y-2 text-sm text-purple-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span><span className="font-semibold">RM 31.4M</span> in annual savings (2026 projection)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span><span className="font-semibold">4 decisions/month</span> average execution rate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span><span className="font-semibold">91% accuracy</span> on recommendations</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-xs text-purple-400 font-medium mb-2">SYSTEM ROI</div>
                <div className="text-3xl font-mono font-bold text-purple-300 mb-1">2,847%</div>
                <p className="text-xs text-purple-400/70">
                  Assuming system cost of RM 1.1M, delivering RM 31.4M in annual value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
