import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
} from 'recharts';
import { Info, Loader2 } from 'lucide-react';
import { type RecommendationDto } from '../services/api';

interface CashFlowChartProps {
  loading?: boolean;
  selectedDecision: RecommendationDto | null;
  showAllComparison: boolean;
  allDecisions: RecommendationDto[];
  onToggleAllComparison: () => void;
}

export function CashFlowChart({ 
  loading, 
  selectedDecision, 
  showAllComparison, 
  allDecisions, 
  onToggleAllComparison 
}: CashFlowChartProps) {

  // Static original data (20 days) as requested
  const originalData = [
    { date: 'Apr 21', payables: 8.2, receivables: 12.4, net: 4.2 },
    { date: 'Apr 22', payables: 9.1, receivables: 11.8, net: 2.7 },
    { date: 'Apr 23', payables: 12.4, receivables: 10.2, net: -2.2 },
    { date: 'Apr 24', payables: 15.8, receivables: 9.8, net: -6.0 },
    { date: 'Apr 25', payables: 18.2, receivables: 14.5, net: -3.7 },
    { date: 'Apr 26', payables: 14.6, receivables: 16.2, net: 1.6 },
    { date: 'Apr 27', payables: 11.3, receivables: 15.8, net: 4.5 },
    { date: 'Apr 28', payables: 22.4, receivables: 13.2, net: -9.2 },
    { date: 'Apr 29', payables: 19.8, receivables: 18.4, net: -1.4 },
    { date: 'Apr 30', payables: 16.2, receivables: 22.1, net: 5.9 },
    { date: 'May 1', payables: 13.8, receivables: 19.6, net: 5.8 },
    { date: 'May 2', payables: 11.4, receivables: 17.2, net: 5.8 },
    { date: 'May 3', payables: 14.2, receivables: 16.8, net: 2.6 },
    { date: 'May 4', payables: 17.6, receivables: 15.4, net: -2.2 },
    { date: 'May 5', payables: 25.8, receivables: 18.2, net: -7.6 },
    { date: 'May 6', payables: 21.4, receivables: 21.8, net: 0.4 },
    { date: 'May 7', payables: 18.2, receivables: 24.6, net: 6.4 },
    { date: 'May 8', payables: 15.8, receivables: 22.4, net: 6.6 },
    { date: 'May 9', payables: 19.4, receivables: 20.8, net: 1.4 },
    { date: 'May 10', payables: 22.6, receivables: 19.2, net: -3.4 },
  ];

  // Compute which savings to apply
  const savings = useMemo(() => {
    if (selectedDecision && !showAllComparison) {
      return selectedDecision.estimated_savings;
    }
    if (showAllComparison && allDecisions.length > 0) {
      return allDecisions.reduce((sum, d) => sum + d.estimated_savings, 0);
    }
    return 0;
  }, [selectedDecision, showAllComparison, allDecisions]);

  const isComparing = selectedDecision !== null || showAllComparison;

  // Build optimized data array
  const optimizedData = useMemo(() => {
    if (!isComparing) return null;
    // The instructions say: "shifting the curve upward by a (small) amount proportional to the savings"
    // To make RM savings (like 12500) visible on a chart where units are Millions (M),
    // we convert the RM savings to M.
    const savingsInM = savings / 1000000;
    const dailySavings = savingsInM / originalData.length;
    
    return originalData.map((day, index) => ({
      ...day,
      // Cumulative shift to show growth over time (compounding impact on balance)
      net: day.net + (dailySavings * (index + 1)),
    }));
  }, [isComparing, savings, originalData]);

  // Tooltip that shows original + optimized net when comparing
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const date = payload[0].payload.date;
    const originalNet = payload[0].value;
    const secondPayload = payload.length > 1 ? payload[1] : null;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl min-w-[180px]">
        <p className="text-xs text-slate-400 mb-2 font-medium">{date}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-yellow-400">Original Net:</span>
            <span className={`text-sm font-mono font-semibold ${originalNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              RM {originalNet.toFixed(2)}M
            </span>
          </div>
          {secondPayload && (
            <div className="flex justify-between gap-4">
              <span className="text-xs text-cyan-400">Optimized Net:</span>
              <span className={`text-sm font-mono font-semibold ${secondPayload.value >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                RM {secondPayload.value.toFixed(2)}M
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Calculating cash flow projections...</p>
      </div>
    );
  }

  return (
    <div id="cash-flow-chart" className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white mb-1">30-Day Cash Flow Projection</h2>
          <p className="text-sm text-slate-400">
            {selectedDecision 
              ? `Showing impact of: ${selectedDecision.title}`
              : showAllComparison 
                ? 'Comparing original vs. all AI-optimized projections' 
                : 'Current projected cash flow'}
          </p>
        </div>
        
        {!selectedDecision && (
          <button
            onClick={onToggleAllComparison}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showAllComparison 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {showAllComparison ? 'Hide Comparison' : 'Show Comparison'}
          </button>
        )}

        {selectedDecision && (
          <button
            onClick={onToggleAllComparison}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Show All Decisions
          </button>
        )}
      </div>

      {isComparing && (
        <div className="mb-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-cyan-300 mb-1">
                {selectedDecision ? 'Single Decision Impact' : 'Combined AI Impact'}
              </h4>
              <p className="text-sm text-cyan-400/80 leading-relaxed">
                The dashed line shows your current projected cash flow. The solid cyan line shows optimized projections after implementing 
                {selectedDecision ? ' this recommendation.' : ' all recommendations.'} 
                Estimated improvement: <span className="font-mono font-bold text-emerald-400">RM {savings.toLocaleString()}</span> over 30 days.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-yellow-500"></div>
            <span className="text-slate-400">Original Balance</span>
          </div>
          {isComparing && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-500"></div>
              <span className="text-slate-400">Optimized Balance</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={originalData}>
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
              dataKey="net" 
              stroke="#eab308" 
              strokeWidth={2.5} 
              dot={false} 
              strokeDasharray={isComparing ? "5 5" : "0"} 
              opacity={isComparing ? 0.6 : 1} 
              name="Original Balance" 
            />

            {optimizedData && (
              <Line 
                data={optimizedData} 
                type="monotone" 
                dataKey="net" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                dot={false} 
                name="Optimized Balance" 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
