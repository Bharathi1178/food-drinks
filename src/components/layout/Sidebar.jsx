import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Receipt,
  ShoppingBag,
  Flame,
  X,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { useSettings } from '../../context/SettingsContext';

export default function Sidebar({ isOpen, onClose }) {
  const { heldOrders, setHeldOrdersModalOpen, cart } = usePOS();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { to: '/menu', label: 'Food Menu', icon: UtensilsCrossed, count: null },
    { to: '/billing', label: 'Billing & Checkout', icon: Receipt, count: totalCartCount },
    { to: '/orders', label: 'Customer Orders', icon: ShoppingBag, count: null },
  ];

  const handleReadyToOrder = () => {
    navigate('/menu');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 font-black text-xl">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-tight">
                {settings?.shop?.name?.split(' ')[0] || 'BiteCraze'}
                <span className="text-orange-500">POS</span>
              </h1>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium tracking-wide">
                CUSTOMER FAST FOOD
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROMINENT "READY TO ORDER" BUTTON */}
        <div className="p-4 pb-2">
          <button
            onClick={handleReadyToOrder}
            id="ready-to-order-sidebar-btn"
            className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-orange-500/30 transition-all duration-200 group active:scale-95 border border-orange-400/30"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Flame className="w-4 h-4 text-white animate-bounce" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black leading-tight">Ready to Order</span>
                <span className="text-[10px] text-orange-100 font-medium block">Browse Food Menu</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Held Orders Banner */}
        {heldOrders.length > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={() => {
                setHeldOrdersModalOpen(true);
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Held Bills</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full font-bold text-[10px]">
                {heldOrders.length}
              </span>
            </button>
          </div>
        )}

        {/* Navigation Links - Separated Menu, Billing, and Orders */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Modules
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 font-bold scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="flex-1 text-sm font-semibold">{item.label}</span>
                    {item.count !== null && item.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                          isActive
                            ? 'bg-white text-orange-600'
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                    {isActive && item.count === null && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Info Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-white text-xs leading-tight">Fast Service</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" /> Counter Active
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
