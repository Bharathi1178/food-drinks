import React from 'react';
import { Link } from 'react-router-dom';
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

      {/* Right: Quick Portals & Director Badge */}
      <div className="flex items-center space-x-2.5">
        <Link
          to="/menu"
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <span>Storefront ↗</span>
        </Link>
        <Link
          to="/employee/dashboard"
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
        >
          <span>Kitchen KDS ↗</span>
        </Link>
        <Link
          to="/pos"
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
        >
          <span>Counter POS ↗</span>
        </Link>
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
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
