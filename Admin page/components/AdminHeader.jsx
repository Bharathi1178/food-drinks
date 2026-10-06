import React from 'react';
import { Menu, Shield, Calendar, UserCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminHeader({ pageTitle = 'Dashboard', onOpenMobile }) {
  const { adminUser } = useAdminAuth();
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobile}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">{pageTitle}</h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">Director Executive Control & Business Analytics</p>
        </div>
      </div>

      {/* Right: Date & Director Badge */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar size={13} className="text-slate-600" />
          <span>{todayStr}</span>
        </div>

        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
            {adminUser?.name ? adminUser.name[0] : 'D'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{adminUser?.name || 'Vikram Singh'}</p>
            <p className="text-[10px] font-medium text-emerald-600 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 inline-block"></span>
              {adminUser?.role || 'Director'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
