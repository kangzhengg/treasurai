import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Clock, Shield } from 'lucide-react';

export function ROISimulator() {
  const [scenario, setScenario] = useState('fx-hedge');

  const scenarios = {
    'fx-hedge': {
      title: 'FX Hedge USD/MYR',
      options: [
        {
          name: 'Convert Now',
          cost: 'RM 19.824M',
          risk: 'Low',
          riskLevel: 1,
          savings: 'RM 0',
          savingsPercent: '0%',
          details: ['Lock in current rate: 4.72', 'Immediate execution', 'No exposure to rate changes'],
          recommended: false,
        },
        {
          name: 'Wait 1 Week',
          cost: 'RM 20.112M',
          risk: 'Medium',
          riskLevel: 2,
          savings: '-RM 288K',
          savingsPercent: '-1.5%',
          details: ['Potential rate: 4.79', 'Fed meeting expected', 'USD likely to strengthen'],
          recommended: false,
        },
        {
          name: 'Hedge 50%',
          cost: 'RM 19.896M',
          risk: 'Low-Medium',
          riskLevel: 1.5,
          savings: '-RM 72K',
          savingsPercent: '-0.4%',
          details: ['Lock 50% at 4.72', 'Maintain 50% flexibility', 'Balanced approach'],
          recommended: true,
        },
      ],
    },
    'supplier-negotiation': {
      title: 'Vendor Sigma Negotiation',
      options: [
        {
          name: 'Accept Current Price',
          cost: 'RM 42M/year',
          risk: 'None',
          riskLevel: 0,
          savings: 'RM 0',
          savingsPercent: '0%',
          details: ['Current: RM 152/unit', 'No negotiation needed', 'Status quo maintained'],
          recommended: false,
        },
        {
          name: 'Negotiate 5% Discount',
          cost: 'RM 39.9M/year',
          risk: 'Low',
          riskLevel: 1,
          savings: 'RM 2.1M',
          savingsPercent: '5%',
          details: ['Target: RM 144.40/unit', 'Conservative ask', '85% success probability'],
          recommended: false,
        },
        {
          name: 'Negotiate 8% + Bulk Terms',
          cost: 'RM 38.64M/year',
          risk: 'Medium',
          riskLevel: 2,
          savings: 'RM 3.36M',
          savingsPercent: '8%',
          details: ['Target: RM 139.84/unit', 'Leverage bulk purchase', '68% success probability'],
          recommended: true,
        },
      ],
    },
    'payment-timing': {
      title: 'EUR Payment Timing',
      options: [
        {
          name: 'Pay Today',
          cost: 'RM 910K',
          risk: 'None',
          riskLevel: 0,
          savings: 'RM 0',
          savingsPercent: '0%',
          details: ['Current rate: 5.06', 'Immediate payment', 'No timing risk'],
          recommended: false,
        },
        {
          name: 'Delay 4 Days (Post-ECB)',
          cost: 'RM 902.7K',
          risk: 'Low',
          riskLevel: 1,
          savings: 'RM 7.3K',
          savingsPercent: '0.8%',
          details: ['Expected rate: 5.02', 'Await ECB meeting', 'Supplier relationship: Strong'],
          recommended: true,
        },
        {
          name: 'Delay 2 Weeks',
          cost: 'RM 918.2K',
          risk: 'High',
          riskLevel: 3,
          savings: '-RM 8.2K',
          savingsPercent: '-0.9%',
          details: ['Rate uncertainty high', 'Supplier may object', 'Not recommended'],
          recommended: false,
        },
      ],
    },
  };

  const current = scenarios[scenario as keyof typeof scenarios];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Trade-off & ROI Simulator</h1>
          <p className="text-sm text-slate-400">
            Compare decision options and optimize your strategy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">Scenario:</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Compare Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setScenario('fx-hedge')}
            className={`p-4 rounded-lg border transition-all text-left ${
              scenario === 'fx-hedge'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <DollarSign className="w-5 h-5 mb-2" />
            <div className="font-medium text-sm">FX Hedge Decision</div>
            <div className="text-xs opacity-70">USD/MYR exposure</div>
          </button>
          <button
            onClick={() => setScenario('supplier-negotiation')}
            className={`p-4 rounded-lg border transition-all text-left ${
              scenario === 'supplier-negotiation'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <TrendingDown className="w-5 h-5 mb-2" />
            <div className="font-medium text-sm">Supplier Negotiation</div>
            <div className="text-xs opacity-70">Vendor Sigma pricing</div>
          </button>
          <button
            onClick={() => setScenario('payment-timing')}
            className={`p-4 rounded-lg border transition-all text-left ${
              scenario === 'payment-timing'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <Clock className="w-5 h-5 mb-2" />
            <div className="font-medium text-sm">Payment Timing</div>
            <div className="text-xs opacity-70">EUR payment strategy</div>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">{current.title} - Compare Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {current.options.map((option, idx) => (
            <div
              key={idx}
              className={`bg-slate-900/50 backdrop-blur-sm border rounded-xl p-5 transition-all ${
                option.recommended
                  ? 'border-emerald-500/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium mb-1">{option.name}</h3>
                  {option.recommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                      <Shield className="w-3 h-3" />
                      AI Recommended
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Total Cost</div>
                  <div className="text-2xl font-mono font-bold text-white">{option.cost}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Risk Level</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-2 w-full rounded-full ${
                            level <= option.riskLevel
                              ? option.riskLevel <= 1
                                ? 'bg-emerald-500'
                                : option.riskLevel <= 2
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{option.risk}</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 mb-1">Savings</div>
                    <div className={`font-mono font-bold ${
                      option.savings.startsWith('-') ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {option.savingsPercent}
                    </div>
                    <div className="text-xs font-mono text-slate-400">{option.savings}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-400 mb-2">Key Details:</div>
                <ul className="space-y-1.5">
                  {option.details.map((detail, detailIdx) => (
                    <li key={detailIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                option.recommended
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}>
                {option.recommended ? 'Execute This Option' : 'Select This Option'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-cyan-300 mb-1">GLM Recommendation</h3>
            <p className="text-sm text-cyan-400/80 leading-relaxed">
              Based on market analysis, internal data, and historical patterns, the recommended option balances cost optimization with risk management. The AI has analyzed 847 similar scenarios with 91% accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
