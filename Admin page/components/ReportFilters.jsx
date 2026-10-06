import React from 'react';
import { Calendar } from 'lucide-react';

export const FILTER_PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
  { id: 'last_week', label: 'Last Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'custom', label: 'Custom Date' },
];

export default function ReportFilters({ activeFilter, onFilterChange, selectedDate, onDateChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
      {/* Preset pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onFilterChange(preset.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === preset.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Date picker for custom or single date */}
      <div className="flex items-center space-x-2">
        <Calendar size={15} className="text-slate-500" />
        <input
          type="date"
          value={selectedDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => onDateChange(e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
        />
      </div>
    </div>
  );
}
