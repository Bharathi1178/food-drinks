import React from 'react';
import { Menu } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminHeader({ pageTitle = 'Dashboard', onOpenMobile }) {
  const { adminUser } = useAdminAuth();

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

      {/* Right: Director Badge */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
