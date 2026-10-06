import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePOS } from '../../context/POSContext';

export default function FloatingCartBar() {
  const { cart, grandTotal } = usePOS();

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Mobile Fixed Bottom Bar (shown on screens < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-950/95 backdrop-blur-md border-t border-amber-500/30 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </span>
              <span className="text-base font-black text-amber-400">
                ₹{grandTotal.toFixed(0)}
              </span>
            </div>
          </div>

          <Link
            to="/billing"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
          >
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Desktop Floating Indicator (bottom-right) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40 animate-bounce-subtle">
        <Link
          to="/billing"
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#171e2e] to-[#222a3d] border border-amber-500/50 shadow-2xl shadow-black/60 hover:border-amber-400 hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#171e2e]">
              {totalItems}
            </span>
          </div>

          <div className="text-left pr-2">
            <div className="text-xs font-semibold text-slate-300">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added
            </div>
            <div className="text-base font-black text-amber-400">
              ₹{grandTotal.toFixed(0)}
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </>
  );
}
