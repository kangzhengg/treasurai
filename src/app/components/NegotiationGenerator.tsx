import { useState } from 'react';
import { Target, TrendingDown, MessageSquare, Lightbulb, Copy, CheckCircle2 } from 'lucide-react';

export function NegotiationGenerator() {
  const [selectedSupplier, setSelectedSupplier] = useState('vendor-sigma');
  const [copied, setCopied] = useState(false);

  const suppliers = {
    'vendor-sigma': {
      name: 'Vendor Sigma',
      currentPrice: 'RM 152/unit',
      marketAverage: 'RM 140/unit',
      overpayment: '8.6%',
      annualSpend: 'RM 42M',
      potentialSavings: 'RM 3.6M',
      relationship: '4 years',
      contractRenewal: 'June 2026',
      marketPosition: 'Weakening',
      negotiationStrategy: {
        opening: 'Request 10% reduction (to RM 136.80/unit)',
        target: '8% reduction (to RM 139.84/unit)',
        fallback: '6% reduction (to RM 142.88/unit)',
        leverage: [
          'Market average is RM 140/unit - you are paying 8.6% premium',
          'Industry overcapacity driving competitor prices down 5-8%',
          'Contract renewal approaching - good timing for renegotiation',
          'Annual volume of 276K units gives bulk purchase leverage',
          'Vendor Sigma market position weakening per industry reports',
        ],
        approach: [
          'Start with collaborative tone - emphasize long-term partnership',
          'Present market data showing 8.6% premium vs competitors',
          'Highlight annual volume (276K units) as leverage for better pricing',
          'Mention industry pricing trends (5-8% decrease in Q1 2026)',
          'Reference contract renewal as natural checkpoint for adjustment',
          'Propose bulk commitment for better rates',
        ],
        script: `Subject: Partnership Discussion - Pricing Review for Contract Renewal

Dear Vendor Sigma Team,

As we approach our contract renewal in June 2026, I wanted to open a discussion about our pricing structure.

We value our 4-year partnership and the quality of service you've provided. Our annual volume has grown to 276,000 units, representing RM 42M in business.

However, recent market analysis shows we're currently at RM 152/unit while the market average is RM 140/unit. Industry reports indicate competitor pricing has decreased 5-8% in Q1 2026 due to overcapacity.

We'd like to discuss adjusting our pricing to RM 136.80/unit (10% reduction), which would:
- Align closer to market rates
- Reflect our increased volume and bulk commitment
- Strengthen our long-term partnership

I'm confident we can find a mutually beneficial solution. When would be a good time to discuss?

Best regards`,
      },
    },
    'techparts-ltd': {
      name: 'TechParts Ltd',
      currentPrice: 'RM 89/unit',
      marketAverage: 'RM 78/unit',
      overpayment: '14.1%',
      annualSpend: 'RM 18.5M',
      potentialSavings: 'RM 2.6M',
      relationship: '2 years',
      contractRenewal: 'August 2026',
      marketPosition: 'Stable',
      negotiationStrategy: {
        opening: 'Request 15% reduction (to RM 75.65/unit)',
        target: '12% reduction (to RM 78.32/unit)',
        fallback: '10% reduction (to RM 80.10/unit)',
        leverage: [
          'Market average is RM 78/unit - current 14.1% premium is significant',
          'Multiple alternative suppliers identified at RM 76-79/unit',
          'Annual spend of RM 18.5M provides negotiation leverage',
          'Quality issues reported in Q4 2025 - service level concerns',
        ],
        approach: [
          'Lead with market data showing significant overpayment',
          'Mention quality concerns from Q4 2025 as additional leverage',
          'Reference alternative supplier quotes (if obtained)',
          'Emphasize willingness to continue relationship if pricing adjusts',
          'Propose volume commitment for better rates',
        ],
        script: `Subject: Pricing Discussion - Market Alignment Request

Dear TechParts Ltd,

I'm writing to discuss our current pricing structure ahead of our August 2026 contract renewal.

We've been partners for 2 years with annual spend of RM 18.5M. However, recent market analysis shows a significant gap:
- Our current price: RM 89/unit
- Market average: RM 78/unit
- Premium: 14.1%

Additionally, we've received quotes from alternative suppliers in the RM 76-79/unit range. We also had quality concerns in Q4 2025 that impacted our operations.

We value our partnership and would like to continue, but need pricing that reflects market conditions. We're proposing RM 75.65/unit (15% reduction) given:
- Market alignment
- Service level adjustments
- Volume commitment

Can we schedule a call to discuss?

Best regards`,
      },
    },
  };

  const current = suppliers[selectedSupplier as keyof typeof suppliers];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.negotiationStrategy.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Smart Negotiation Generator</h1>
          <p className="text-sm text-slate-400">
            AI-powered supplier negotiation strategies and talking points
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <Target className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-300">Negotiation Mode</span>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Select Supplier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(suppliers).map(([key, supplier]) => (
            <button
              key={key}
              onClick={() => setSelectedSupplier(key)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedSupplier === key
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium">{supplier.name}</div>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">
                  {supplier.overpayment} over market
                </span>
              </div>
              <div className="text-sm text-slate-400">
                Current: {supplier.currentPrice} | Market: {supplier.marketAverage}
              </div>
              <div className="text-sm font-medium text-emerald-400 mt-1">
                Potential savings: {supplier.potentialSavings}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 mb-1">Current Price</div>
          <div className="text-2xl font-mono font-bold text-white mb-1">{current.currentPrice}</div>
          <div className="text-xs font-mono text-red-400">vs market: {current.marketAverage}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 mb-1">Overpayment</div>
          <div className="text-2xl font-mono font-bold text-red-400 mb-1">{current.overpayment}</div>
          <div className="text-xs font-mono text-slate-400">Annual: {current.annualSpend}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 mb-1">Potential Savings</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">{current.potentialSavings}</div>
          <div className="text-xs text-slate-400">If 8% reduction achieved</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Negotiation Strategy</h2>
            <p className="text-sm text-slate-400">Generated by GLM based on market data and relationship analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/20">
            <div className="text-xs text-emerald-400 font-medium mb-2">OPENING ASK</div>
            <div className="font-medium text-slate-200">{current.negotiationStrategy.opening}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="text-xs text-cyan-400 font-medium mb-2">TARGET</div>
            <div className="font-medium text-slate-200">{current.negotiationStrategy.target}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-xs text-yellow-400 font-medium mb-2">FALLBACK</div>
            <div className="font-medium text-slate-200">{current.negotiationStrategy.fallback}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              Leverage Points
            </h3>
            <ul className="space-y-2">
              {current.negotiationStrategy.leverage.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Recommended Approach
            </h3>
            <ol className="space-y-2">
              {current.negotiationStrategy.approach.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-purple-400 font-medium">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Email Template
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Template
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {current.negotiationStrategy.script}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-300 mb-1">Success Probability</h3>
            <p className="text-sm text-orange-400/80">
              Based on market conditions, supplier position, and relationship strength, GLM estimates a <span className="font-semibold text-orange-300">68-78% probability</span> of achieving target reduction. Best timing: 2-3 months before contract renewal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
