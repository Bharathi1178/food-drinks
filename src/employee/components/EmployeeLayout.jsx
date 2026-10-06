import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import {
  Flame,
  LogOut,
  Bell,
  BellOff,
  User,
  ShieldCheck,
  RefreshCw,
  Clock,
  UtensilsCrossed,
} from 'lucide-react';

export default function EmployeeLayout() {
  const { employee, logout } = useEmployeeAuth();
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/employee/login');
  };

  return (
    <div className="min-h-screen bg-[#090D17] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Depth & Ambient Glow Elements like Image 2 */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed -right-20 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-amber-500/10 via-orange-600/8 to-rose-600/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Operational Header Bar */}
      <header className="bg-[#0D1322]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identification */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-orange-500/25 shrink-0">
              <Flame className="w-5 h-5 fill-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  Bite<span className="text-orange-500">Craze</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider shadow-inner">
                  Employee Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Kitchen Operations, Preparation & Delivery Packing Station
              </p>
            </div>
          </div>

          {/* Employee Active Status & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Alert Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-slate-900/90 text-amber-400 border-amber-500/40 hover:bg-slate-800 shadow-xs'
                  : 'bg-slate-900/50 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
              title={soundEnabled ? 'Order sound alerts are ON' : 'Order sound alerts are MUTED'}
            >
              {soundEnabled ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span className="hidden md:inline text-[11px]">Audio Alert On</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline text-[11px]">Muted</span>
                </>
              )}
            </button>

            {/* Employee Identification Card */}
            <div className="flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 text-amber-400 flex items-center justify-center font-black text-xs shrink-0">
                {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-none">
                    {employee?.name || 'Staff Member'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-orange-500/20 px-1.5 py-0.2 rounded border border-orange-500/30">
                    {employee?.id || 'EMP'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {employee?.role || 'Kitchen Staff'} • Active Shift
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="End shift and sign out of Employee Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-7 relative z-10">
        <Outlet context={{ soundEnabled }} />
      </main>

      {/* Operational Footer Bar */}
      <footer className="bg-[#090D17] border-t border-white/10 py-3.5 px-4 text-center text-xs text-slate-500">
        <span>BiteCraze Restaurant Kitchen Terminal • Connected in Real-Time to Admin & Customer Delivery Backends</span>
      </footer>
    </div>
  );
}
