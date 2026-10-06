import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'slate' }) {
  const colorStyles = {
    slate: 'bg-slate-800/80 border-slate-700/60 text-slate-100',
    amber: 'bg-amber-950/20 border-amber-800/40 text-amber-400',
    emerald: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400',
    blue: 'bg-blue-950/20 border-blue-800/40 text-blue-400',
    indigo: 'bg-indigo-950/20 border-indigo-800/40 text-indigo-400',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
      </div>
      {subtitle && (
        <div className="mt-2 flex items-center text-xs text-slate-500">
          {trend && (
            <span className="font-semibold text-emerald-600 mr-1.5 flex items-center">
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
