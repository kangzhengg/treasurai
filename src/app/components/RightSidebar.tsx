import { TrendingUp, TrendingDown, Newspaper } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function RightSidebar() {
  const fxRates = [
    {
      pair: 'USD/MYR',
      rate: 4.7215,
      change: '+0.024',
      changePercent: '+0.51%',
      trend: 'up',
      data: [4.71, 4.715, 4.713, 4.718, 4.720, 4.7215],
    },
    {
      pair: 'EUR/MYR',
      rate: 5.0621,
      change: '-0.012',
      changePercent: '-0.24%',
      trend: 'down',
      data: [5.07, 5.068, 5.065, 5.063, 5.064, 5.0621],
    },
    {
      pair: 'SGD/MYR',
      rate: 3.5142,
      change: '+0.008',
      changePercent: '+0.23%',
      trend: 'up',
      data: [3.510, 3.512, 3.511, 3.513, 3.514, 3.5142],
    },
  ];

  const newsItems = [
    {
      title: 'Fed signals potential rate hike in Q3 2026',
      source: 'Reuters',
      time: '12m ago',
      impact: 'high',
    },
    {
      title: 'Oil prices surge 8% on supply concerns',
      source: 'Bloomberg',
      time: '28m ago',
      impact: 'medium',
    },
    {
      title: 'ECB meeting April 25 - dovish signals expected',
      source: 'Financial Times',
      time: '45m ago',
      impact: 'high',
    },
    {
      title: 'MYR volatility increases 12% this week',
      source: 'Reuters',
      time: '1h ago',
      impact: 'high',
    },
    {
      title: 'Industry overcapacity driving supplier prices down',
      source: 'Industry Report',
      time: '2h ago',
      impact: 'medium',
    },
    {
      title: 'Geopolitical tensions rising in Europe',
      source: 'Bloomberg',
      time: '3h ago',
      impact: 'medium',
    },
  ];

  return (
    <aside className="w-80 bg-[#0d1117] border-l border-slate-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Live Intelligence
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-300">FX Live Rates</h4>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Live
            </div>
          </div>

          <div className="space-y-3">
            {fxRates.map((fx) => (
              <div key={fx.pair} className="bg-slate-900/30 rounded-lg p-3 hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">{fx.pair}</span>
                  <div className="flex items-center gap-1">
                    {fx.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs font-mono ${
                      fx.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {fx.changePercent}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <span className="text-lg font-mono font-semibold text-white">{fx.rate}</span>
                  <div className="h-8 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fx.data.map((val, idx) => ({ value: val, idx }))}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={fx.trend === 'up' ? '#10b981' : '#ef4444'}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-medium text-slate-300">Market News</h4>
          </div>

          <div className="space-y-2">
            {newsItems.map((news, idx) => (
              <button
                key={idx}
                className="w-full bg-slate-900/30 rounded-lg p-3 hover:bg-slate-900/50 transition-colors text-left group"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  {news.impact === 'high' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
                  )}
                  {news.impact === 'medium' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></span>
                  )}
                  <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                    {news.title}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{news.source}</span>
                  <span className="text-slate-600">{news.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
