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
  Area,
  ComposedChart,
} from 'recharts';
import { AlertTriangle, TrendingUp, DollarSign, X, ArrowRight, Clock, Target } from 'lucide-react';

export function CashFlowOverview() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const cashFlowData = [
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

  const aiMarkers = [
    {
      day: 4,
      type: 'convert',
      title: 'Convert USD → MYR now',
      savings: 'RM 2.14M',
      counterparty: 'Multiple USD payables',
      amount: 'RM 19.82M',
      currency: 'USD',
      dueDate: 'Apr 24-28',
      reasoning: 'Fed rate hike expected. USD likely to strengthen 2-3% over next 45 days.',
      icon: DollarSign,
      color: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.3)',
    },
    {
      day: 8,
      type: 'delay',
      title: 'Delay EUR payment 4 days',
      savings: 'RM 340K',
      counterparty: 'EuroWind GmbH',
      amount: 'RM 910K',
      currency: 'EUR',
      dueDate: 'Apr 28',
      reasoning: 'ECB meeting April 25. Historical pattern suggests 0.8% EUR weakening post-meeting.',
      icon: Clock,
      color: '#84cc16',
      glowColor: 'rgba(132, 204, 22, 0.3)',
    },
    {
      day: 15,
      type: 'negotiate',
      title: 'Renegotiate supplier price',
      savings: 'RM 3.2M',
      counterparty: 'Vendor Sigma',
      amount: 'RM 42M/year',
      currency: 'MYR',
      dueDate: 'Ongoing',
      reasoning: 'Paying 8.6% above market average. Industry overcapacity provides leverage.',
      icon: Target,
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.3)',
    },
    {
      day: 10,
      type: 'hedge',
      title: 'Consider EUR hedge',
      savings: 'Avoid RM 1.9M risk',
      counterparty: 'EUR exposure',
      amount: 'RM 2.4M',
      currency: 'EUR',
      dueDate: 'Next 30 days',
      reasoning: 'Elevated EUR volatility detected. Hedging 50% provides downside protection.',
      icon: TrendingUp,
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.3)',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Cash Flow Overview</h1>
          <p className="text-sm text-slate-400">
            30-day timeline with AI-powered decision points
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300">Decision Hub</span>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white mb-4">Cash Flow Timeline</h2>
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
              <span className="text-slate-400">Net Cash Position</span>
            </div>
          </div>
        </div>

        <div className="relative h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashFlowData}>
              <defs>
                <linearGradient id="riskZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="safeZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
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

              {/* Risk zones */}
              <Area type="monotone" dataKey="net" stroke="none" fill="url(#riskZone)" />

              <Line
                type="monotone"
                dataKey="payables"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="receivables"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#eab308"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#eab308' }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* AI Decision Markers */}
          {aiMarkers.map((marker) => {
            const xPosition = (marker.day / 20) * 100;
            return (
              <button
                key={marker.day}
                onClick={() => setSelectedMarker(marker)}
                className="absolute group cursor-pointer"
                style={{
                  left: `${xPosition}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125"
                  style={{
                    backgroundColor: marker.color,
                    boxShadow: `0 0 20px ${marker.glowColor}, 0 0 40px ${marker.glowColor}`,
                  }}
                >
                  <marker.icon className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMarker && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: selectedMarker.color + '20' }}
              >
                <selectedMarker.icon className="w-6 h-6" style={{ color: selectedMarker.color }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedMarker.title}</h3>
                <p className="text-sm text-slate-400">{selectedMarker.counterparty}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Estimated Savings</div>
              <div className="text-lg font-mono font-bold text-emerald-400">{selectedMarker.savings}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Amount</div>
              <div className="text-lg font-mono font-bold text-white">{selectedMarker.amount}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Currency</div>
              <div className="text-lg font-semibold text-white">{selectedMarker.currency}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Due Date</div>
              <div className="text-lg font-semibold text-white">{selectedMarker.dueDate}</div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">AI Reasoning</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{selectedMarker.reasoning}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-6 py-2.5 rounded-lg font-medium text-white transition-all hover:scale-105"
              style={{ backgroundColor: selectedMarker.color }}
            >
              Execute Decision
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
            <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors">
              View Full Analysis
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-xs text-red-400 font-medium">HIGH RISK EXPOSURE</div>
              <div className="text-sm text-red-400/70">Next 7 days</div>
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-red-400">RM 38.2M</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-medium">POTENTIAL SAVINGS</div>
              <div className="text-sm text-emerald-400/70">From AI actions</div>
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">RM 7.6M</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-xs text-yellow-400 font-medium">ACTIONS REQUIRED</div>
              <div className="text-sm text-yellow-400/70">Urgent decisions</div>
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-yellow-400">4</div>
        </div>
      </div>
    </div>
  );
}
