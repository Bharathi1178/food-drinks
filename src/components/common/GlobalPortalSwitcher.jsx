import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  Receipt,
  Clock,
  ShieldCheck,
  Flame,
  Monitor,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function GlobalPortalSwitcher() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const portals = [
    {
      to: '/menu',
      label: 'Store & Menu',
      icon: UtensilsCrossed,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-black',
      isActive: location.pathname === '/menu' || location.pathname === '/',
    },
    {
      to: '/billing',
      label: 'Billing & Checkout',
      icon: Receipt,
      color: 'text-orange-400',
      activeBg: 'bg-orange-500/20 border-orange-500/50 text-orange-300 font-black',
      isActive: location.pathname === '/billing' || location.pathname === '/cart',
    },
    {
      to: '/orders?view=track',
      label: 'Orders Tracker',
      icon: Clock,
      color: 'text-sky-400',
      activeBg: 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-black',
      isActive: location.pathname === '/orders',
    },
    {
      to: '/admin/dashboard',
      label: 'Admin Portal',
      icon: ShieldCheck,
      color: 'text-yellow-400',
      activeBg: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 font-black',
      isActive: location.pathname.startsWith('/admin'),
    },
    {
      to: '/employee/dashboard',
      label: 'Employees & Kitchen KDS',
      icon: Flame,
      color: 'text-rose-400',
      activeBg: 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-black',
      isActive: location.pathname.startsWith('/employee'),
    },
    {
      to: '/pos',
      label: 'Counter POS',
      icon: Monitor,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black',
      isActive: location.pathname === '/pos',
    },
  ];

  return (
    <div className="w-full bg-[#050811] border-b border-white/10 text-xs py-1.5 px-3 sm:px-6 relative z-50 select-none shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Portals Hub Branding & Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-5 h-5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
            <Layers className="w-3 h-3" />
          </div>
          <span className="font-extrabold text-white text-[11px] tracking-tight hidden sm:inline">
            BiteCraze Unified Network
          </span>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded border border-orange-500/30 hidden md:inline">
            All Portals Connected
          </span>
        </div>

        {/* Center: Quick Portal Switcher Pills */}
        {!collapsed && (
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 scrollbar-none max-w-full">
            {portals.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.to}
                  to={p.to}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    p.isActive
                      ? p.activeBg
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800/90'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                  <span>{p.label}</span>
                  {p.isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right: Toggle Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-200 text-[10px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 shrink-0 cursor-pointer"
          title={collapsed ? 'Show portal switcher' : 'Hide portal switcher'}
        >
          <span>{collapsed ? 'Switch Portals' : 'Collapse'}</span>
          {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
