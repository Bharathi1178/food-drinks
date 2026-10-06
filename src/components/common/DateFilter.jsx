import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateFilter({
  selectedFilter,
  onSelectFilter,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}) {
  const filterOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelectFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              selectedFilter === opt.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {selectedFilter === 'custom' && (
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="date"
            value={customStartDate || ''}
            onChange={(e) => onCustomDateChange('start', e.target.value)}
            className="border-none bg-transparent p-0 text-slate-700 text-xs focus:ring-0 focus:outline-none"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={customEndDate || ''}
            onChange={(e) => onCustomDateChange('end', e.target.value)}
            className="border-none bg-transparent p-0 text-slate-700 text-xs focus:ring-0 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
