import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function SignupDateCalendar({
  customers = [],
  selectedFilter = null, // e.g. '2026-09-25' or '2026-09'
  filterType = 'date', // 'date' | 'month'
  onSelectDate,
  onSelectMonth,
  onClearFilter,
  onClose,
}) {
  // Determine initial calendar year and month from selectedFilter, first customer, or today
  const initialDate = useMemo(() => {
    if (selectedFilter) {
      const parts = selectedFilter.split('-');
      if (parts.length >= 2) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      }
    }
    for (const c of customers) {
      const d = c.created_at ? c.created_at.split('T')[0] : (c.createdAt || '');
      if (d && d.includes('-')) {
        const [y, m] = d.split('-');
        return new Date(Number(y), Number(m) - 1, 1);
      }
    }
    return new Date();
  }, [selectedFilter, customers]);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  // Count signups per date string (YYYY-MM-DD)
  const signupCounts = useMemo(() => {
    const counts = {};
    customers.forEach((c) => {
      const d = c.created_at ? c.created_at.split('T')[0] : (c.createdAt || '');
      if (d && d !== 'N/A') {
        counts[d] = (counts[d] || 0) + 1;
      }
    });
    return counts;
  }, [customers]);

  // Total signups in the currently viewed month
  const monthSignupsCount = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return Object.entries(signupCounts).reduce((acc, [key, count]) => {
      return key.startsWith(prefix) ? acc + count : acc;
    }, 0);
  }, [signupCounts, currentYear, currentMonth]);

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(dateStr);
  };

  const handleFilterMonth = () => {
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    onSelectMonth(monthStr);
  };

  const isCurrentMonthFiltered = filterType === 'month' && selectedFilter === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  return (
    <div className="bg-white rounded-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Signup Date Calendar</h3>
              <p className="text-[11px] text-slate-500">Filter customers by registration date</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <div className="text-xs font-bold text-slate-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {monthSignupsCount} {monthSignupsCount === 1 ? 'signup' : 'signups'} this month
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Quick Month Filter Button */}
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={handleFilterMonth}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              isCurrentMonthFiltered
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <CalendarIcon size={12} />
            <span>Filter all in {MONTH_NAMES[currentMonth]} ({monthSignupsCount})</span>
          </button>
        </div>

        {/* Calendar Days of Week */}
        <div className="px-4 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="px-4 pb-4 grid grid-cols-7 gap-1 text-center">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = signupCounts[dateStr] || 0;
            const isSelected = filterType === 'date' && selectedFilter === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDayClick(day)}
                className={`h-9 rounded-lg flex flex-col items-center justify-center relative transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : count > 0
                    ? 'bg-amber-50 text-slate-900 font-bold hover:bg-amber-100 border border-amber-200'
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                }`}
                title={count > 0 ? `${count} signup${count > 1 ? 's' : ''} on ${dateStr}` : dateStr}
              >
                <span>{day}</span>
                {count > 0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-amber-400' : 'bg-orange-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClearFilter}
            disabled={!selectedFilter}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Show All Customers</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
  );
}
