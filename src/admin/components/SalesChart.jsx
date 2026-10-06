import React, { useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';

export default function SalesChart({ data = [], activeTab = 'daily', onTabChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Normalize data values
  const turnoverValues = data.map(d => Number(d.turnover) || 0);
  const maxTurnover = Math.max(...turnoverValues, 1000);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart2 size={18} className="text-slate-700" />
            <h3 className="text-base font-semibold text-slate-900">Sales Overview</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Turnover performance over selected time window</p>
        </div>

        {/* View Switcher: Daily | Weekly | Monthly */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(tab)}
              className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="mt-6">
        <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 relative">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              No sales recorded for this period
            </div>
          ) : (
            data.map((item, idx) => {
              const val = Number(item.turnover) || 0;
              const heightPct = Math.max(6, Math.round((val / maxTurnover) * 100));
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-14 bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap z-20 pointer-events-none">
                      <div className="font-semibold">₹{val.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-300">{item.orders || 0} orders • {item.day || item.label || item.date}</div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[42px] rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-amber-500 shadow-sm'
                        : 'bg-slate-700 hover:bg-slate-800'
                    }`}
                  />
                  {/* Label */}
                  <div className="mt-2 text-[11px] font-medium text-slate-600 truncate max-w-full">
                    {item.day || item.label || item.date}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
