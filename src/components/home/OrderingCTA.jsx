import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

export default function OrderingCTA({ onOrderClick }) {
  const handleClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      const el = document.getElementById('main-menu-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#090c13] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-[#171e2e] via-[#1b2336] to-[#251b14] shadow-2xl">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
              alt="Artisan Dining"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111726] via-[#111726]/85 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Cravings Delivered in 30 Mins</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              Feeling <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Hungry?</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Your favorite gourmet food is just a few clicks away. Freshly prepared, loaded with flavors, and delivered hot to your doorstep.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base transition-all duration-300 shadow-xl shadow-amber-500/25 active:scale-95 group"
              >
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Zero contact delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
