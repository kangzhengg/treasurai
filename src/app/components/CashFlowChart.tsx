import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

export function CashFlowChart() {
  const [showComparison, setShowComparison] = useState(false);

  const originalData = [
    { date: 'Apr 21', payables: 8.2, receivables: 12.4, net: 4.2, day: 1 },
    { date: 'Apr 22', payables: 9.1, receivables: 11.8, net: 2.7, day: 2 },
    { date: 'Apr 23', payables: 12.4, receivables: 10.2, net: -2.2, day: 3 },
    { date: 'Apr 24', payables: 15.8, receivables: 9.8, net: -6.0, day: 4 },
    { date: 'Apr 25', payables: 18.2, receivables: 14.5, net: -3.7, day: 5 },
    { date: 'Apr 26', payables: 14.6, receivables: 16.2, net: 1.6, day: 6 },
    { date: 'Apr 27', payables: 11.3, receivables: 15.8, net: 4.5, day: 7 },
    { date: 'Apr 28', payables: 22.4, receivables: 13.2, net: -9.2, day: 8 },
    { date: 'Apr 29', payables: 19.8, receivables: 18.4, net: -1.4, day: 9 },
    { date: 'Apr 30', payables: 16.2, receivables: 22.1, net: 5.9, day: 10 },
    { date: 'May 1', payables: 13.8, receivables: 19.6, net: 5.8, day: 11 },
    { date: 'May 2', payables: 11.4, receivables: 17.2, net: 5.8, day: 12 },
    { date: 'May 3', payables: 14.2, receivables: 16.8, net: 2.6, day: 13 },
    { date: 'May 4', payables: 17.6, receivables: 15.4, net: -2.2, day: 14 },
    { date: 'May 5', payables: 25.8, receivables: 18.2, net: -7.6, day: 15 },
    { date: 'May 6', payables: 21.4, receivables: 21.8, net: 0.4, day: 16 },
    { date: 'May 7', payables: 18.2, receivables: 24.6, net: 6.4, day: 17 },
    { date: 'May 8', payables: 15.8, receivables: 22.4, net: 6.6, day: 18 },
    { date: 'May 9', payables: 19.4, receivables: 20.8, net: 1.4, day: 19 },
    { date: 'May 10', payables: 22.6, receivables: 19.2, net: -3.4, day: 20 },
  ];

  const optimizedData = [
    { date: 'Apr 21', payables: 8.2, receivables: 12.4, net: 4.2, day: 1 },
    { date: 'Apr 22', payables: 9.1, receivables: 11.8, net: 2.7, day: 2 },
    { date: 'Apr 23', payables: 12.4, receivables: 10.2, net: -2.2, day: 3 },
    { date: 'Apr 24', payables: 13.6, receivables: 9.8, net: -3.8, day: 4 }, // Optimized: delayed USD conversion
    { date: 'Apr 25', payables: 16.0, receivables: 14.5, net: -1.5, day: 5 }, // Better
    { date: 'Apr 26', payables: 14.6, receivables: 16.2, net: 1.6, day: 6 },
    { date: 'Apr 27', payables: 11.3, receivables: 15.8, net: 4.5, day: 7 },
    { date: 'Apr 28', payables: 21.5, receivables: 13.2, net: -8.3, day: 8 }, // Optimized: EUR payment delayed
    { date: 'Apr 29', payables: 19.8, receivables: 18.4, net: -1.4, day: 9 },
    { date: 'Apr 30', payables: 16.2, receivables: 22.1, net: 5.9, day: 10 },
    { date: 'May 1', payables: 13.8, receivables: 19.6, net: 5.8, day: 11 },
    { date: 'May 2', payables: 11.4, receivables: 17.2, net: 5.8, day: 12 },
    { date: 'May 3', payables: 14.2, receivables: 16.8, net: 2.6, day: 13 },
    { date: 'May 4', payables: 17.6, receivables: 15.4, net: -2.2, day: 14 },
    { date: 'May 5', payables: 22.6, receivables: 18.2, net: -4.4, day: 15 }, // Optimized: better negotiation
    { date: 'May 6', payables: 19.2, receivables: 21.8, net: 2.6, day: 16 }, // Better
    { date: 'May 7', payables: 16.8, receivables: 24.6, net: 7.8, day: 17 }, // Better
    { date: 'May 8', payables: 14.2, receivables: 22.4, net: 8.2, day: 18 }, // Better
    { date: 'May 9', payables: 17.8, receivables: 20.8, net: 3.0, day: 19 }, // Better
    { date: 'May 10', payables: 20.4, receivables: 19.2, net: -1.2, day: 20 }, // Better
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const isOptimized = payload.length > 3;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-blue-400">Payables:</span>
              <span className="text-sm font-mono font-semibold text-blue-400">
                RM {payload[0].value}M
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-emerald-400">Receivables:</span>
              <span className="text-sm font-mono font-semibold text-emerald-400">
                RM {payload[1].value}M
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-yellow-400">Net Position:</span>
              <span className={`text-sm font-mono font-semibold ${
                payload[2].value >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                RM {payload[2].value}M
              </span>
            </div>
            {isOptimized && payload[5] && (
              <div className="border-t border-slate-700 pt-1 mt-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-cyan-400">Optimized Net:</span>
                  <span className={`text-sm font-mono font-semibold ${
                    payload[5].value >= 0 ? 'text-cyan-400' : 'text-orange-400'
                  }`}>
                    RM {payload[5].value}M
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="cash-flow-chart" className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white mb-1">30-Day Cash Flow Projection</h2>
          <p className="text-sm text-slate-400">
            {showComparison ? 'Comparing original vs. AI-optimized projections' : 'Current projected cash flow'}
          </p>
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showComparison
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </button>
      </div>

      {showComparison && (
        <div className="mb-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-cyan-300 mb-1">AI Optimization Impact</h4>
              <p className="text-sm text-cyan-400/80 leading-relaxed">
                The dotted lines show your current projected cash flow. The solid cyan line shows optimized projections after implementing AI recommendations (USD conversion, EUR payment timing, supplier negotiation). Estimated improvement: <span className="font-mono font-bold text-emerald-400">RM 7.6M</span> over 30 days.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-slate-400">Payables (Outflow)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            <span className="text-slate-400">Receivables (Inflow)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-yellow-500"></div>
            <span className="text-slate-400">Net Position</span>
          </div>
          {showComparison && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-500"></div>
              <span className="text-slate-400">Optimized Net</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={originalData}>
            <defs>
              <linearGradient id="optimizedGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              tickFormatter={(value) => `RM ${value}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="payables"
              stroke="#3b82f6"
              strokeWidth={showComparison ? 2 : 2.5}
              dot={false}
              strokeDasharray={showComparison ? "5 5" : "0"}
              opacity={showComparison ? 0.5 : 1}
            />
            <Line
              type="monotone"
              dataKey="receivables"
              stroke="#10b981"
              strokeWidth={showComparison ? 2 : 2.5}
              dot={false}
              strokeDasharray={showComparison ? "5 5" : "0"}
              opacity={showComparison ? 0.5 : 1}
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#eab308"
              strokeWidth={showComparison ? 2 : 3}
              dot={false}
              strokeDasharray={showComparison ? "5 5" : "0"}
              opacity={showComparison ? 0.5 : 1}
            />

            {showComparison && (
              <>
                <Line
                  type="monotone"
                  data={optimizedData}
                  dataKey="payables"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={optimizedData}
                  dataKey="receivables"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={optimizedData}
                  dataKey="net"
                  stroke="#06b6d4"
                  strokeWidth={3.5}
                  dot={false}
                  strokeDasharray="0"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {showComparison && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4">
            <div className="text-xs text-red-400 mb-1">Original Risk Exposure</div>
            <div className="text-2xl font-mono font-bold text-red-400">RM 38.2M</div>
            <div className="text-xs text-red-400/70 mt-1">Peak negative position</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-4">
            <div className="text-xs text-cyan-400 mb-1">Optimized Risk</div>
            <div className="text-2xl font-mono font-bold text-cyan-400">RM 28.4M</div>
            <div className="text-xs text-cyan-400/70 mt-1">Reduced by 25.7%</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs text-emerald-400 mb-1">Total Savings</div>
            <div className="text-2xl font-mono font-bold text-emerald-400">RM 7.6M</div>
            <div className="text-xs text-emerald-400/70 mt-1">30-day projection</div>
          </div>
        </div>
      )}
    </div>
  );
}
