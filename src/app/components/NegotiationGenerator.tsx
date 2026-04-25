import { useState, useEffect } from 'react';
import { Target, TrendingDown, MessageSquare, Lightbulb, Copy, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { fetchDashboard, fetchSupplierNegotiation, type NegotiationStrategyData } from '../services/api';

export function NegotiationGenerator() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [supplierList, setSupplierList] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState<NegotiationStrategyData | null>(null);
  const [source, setSource] = useState<string>("STATIC");

  useEffect(() => {
    async function loadSuppliers() {
      try {
        setLoadingSuppliers(true);
        const dash = await fetchDashboard("Normal Market");
        let reg = dash.raw.latest_analysis?.company_data?.supplier_registry || [];
        if (reg.length === 0) reg = dash.raw.latest_analysis?.company_data?.suppliers || [];
        
        // Fallback if empty to ensure UI has data to demonstrate
        if (reg.length === 0) {
          reg = [
            { id: 'vendor-sigma', name: 'Vendor Sigma', category: 'Raw Materials', price: 152, quantity: 276000, relationship: 'STRATEGIC' },
            { id: 'techparts-ltd', name: 'TechParts Ltd', category: 'Electronics', price: 89, quantity: 200000, relationship: 'TRANSACTIONAL' }
          ];
        }
        
        // Map missing IDs
        reg = reg.map((s: any, i: number) => ({...s, id: s.id || `supp-${i}`}));
        setSupplierList(reg);
        
        if (reg.length > 0) {
          handleSelect(reg[0]);
        }
      } catch (err) {
        console.error("Failed to load suppliers", err);
      } finally {
        setLoadingSuppliers(false);
      }
    }
    loadSuppliers();
  }, []);

  const handleSelect = async (supplier: any) => {
    setSelectedSupplierId(supplier.id);
    setLoadingStrategy(true);
    setCurrentStrategy(null);
    try {
      const result = await fetchSupplierNegotiation({
        supplier: supplier.name,
        current_price: supplier.price || supplier.current_price || 100,
        quantity: supplier.quantity || supplier.annual_volume || 10000,
        category: supplier.category || 'General',
        relationship: supplier.relationship || 'TRANSACTIONAL'
      });
      setCurrentStrategy(result.data);
      setSource(result.source);
    } catch (err) {
      console.error("Failed to load strategy", err);
    } finally {
      setLoadingStrategy(false);
    }
  };

  const handleCopy = () => {
    if (!currentStrategy) return;
    navigator.clipboard.writeText(currentStrategy.negotiationStrategy.script);
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
        {loadingSuppliers ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {supplierList.map((supplier) => (
              <button
                key={supplier.id}
                onClick={() => handleSelect(supplier)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  selectedSupplierId === supplier.id
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium truncate pr-2">{supplier.name}</div>
                  <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 text-xs rounded border border-slate-500/20 whitespace-nowrap">
                    {supplier.category || 'General'}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  Vol: {(supplier.quantity || supplier.annual_volume || 0).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {loadingStrategy ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-xl border border-slate-800">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <div className="text-slate-300 font-medium">Generating Custom AI Negotiation Strategy...</div>
          <div className="text-sm text-slate-500 mt-2">Analyzing market benchmarks and relationship history</div>
        </div>
      ) : currentStrategy ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="text-xs text-slate-400 mb-1">Current Price</div>
              <div className="text-2xl font-mono font-bold text-white mb-1">{currentStrategy.currentPrice}</div>
              <div className="text-xs font-mono text-red-400">vs market: {currentStrategy.marketAverage}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="text-xs text-slate-400 mb-1">Overpayment</div>
              <div className="text-2xl font-mono font-bold text-red-400 mb-1">{currentStrategy.overpayment}</div>
              <div className="text-xs font-mono text-slate-400">Annual: {currentStrategy.annualSpend}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="text-xs text-slate-400 mb-1">Potential Savings</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">{currentStrategy.potentialSavings}</div>
              <div className="text-xs text-slate-400">If target reduction achieved</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${source === 'GLM' ? 'bg-cyan-500/20' : 'bg-slate-500/20'}`}>
                  <Lightbulb className={`w-5 h-5 ${source === 'GLM' ? 'text-cyan-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Negotiation Strategy</h2>
                  <p className="text-sm text-slate-400">
                    {source === 'GLM' 
                      ? "Generated dynamically by GLM reasoning engine" 
                      : "Generated by deterministic simulation rules (GLM Fallback Mode)"}
                  </p>
                </div>
              </div>
              {source !== 'GLM' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <ShieldAlert className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-400 font-medium">Fallback Active</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/20">
                <div className="text-xs text-emerald-400 font-medium mb-2">OPENING ASK</div>
                <div className="font-medium text-slate-200">{currentStrategy.negotiationStrategy.opening}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/20">
                <div className="text-xs text-cyan-400 font-medium mb-2">TARGET</div>
                <div className="font-medium text-slate-200">{currentStrategy.negotiationStrategy.target}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-yellow-500/20">
                <div className="text-xs text-yellow-400 font-medium mb-2">FALLBACK</div>
                <div className="font-medium text-slate-200">{currentStrategy.negotiationStrategy.fallback}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                  Leverage Points
                </h3>
                <ul className="space-y-2">
                  {(currentStrategy.negotiationStrategy.leverage || []).map((point, idx) => (
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
                  {(currentStrategy.negotiationStrategy.approach || []).map((step, idx) => (
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
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                    {currentStrategy.negotiationStrategy.script}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
