import React from 'react';
import {
  Flame,
  ArrowRight,
  UtensilsCrossed,
  Star,
  Clock,
  Truck,
} from 'lucide-react';

export default function GourmetHeroSection({
  onOrderNow = () => {},
  onExploreMenu = () => {},
}) {
  return (
    <section
      id="home-hero-section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#090D17] via-[#0D1322] to-[#17111D] pt-8 sm:pt-12 pb-14 sm:pb-20 select-none border-b border-white/10"
    >
      {/* Background Depth & Ambient Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      {/* Warm dark brown/orange glow near the food image */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-amber-500/15 via-orange-600/12 to-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Brand Badge, Headline, Subtext, Buttons, Trust Indicators */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Brand / Freshness badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-orange-500/30 text-amber-400 text-xs font-black shadow-inner backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>Freshly Prepared • Delivered Hot</span>
            </div>

            {/* Headline: "Cravings Deserve" in pure white, "Something Delicious." in warm orange -> coral gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08] text-white">
              Cravings Deserve <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 bg-clip-text text-transparent">
                Something Delicious.
              </span>
            </h1>

            {/* Subheading / Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
              Fresh burgers, crispy fries, loaded pizzas, creamy shakes and more — handcrafted fresh and delivered straight to your door.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Order Now: Main orange gradient button with slight lift + shadow */}
              <button
                type="button"
                onClick={onOrderNow}
                className="px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              {/* Explore Menu: Transparent dark button with orange border + glow on hover */}
              <button
                type="button"
                onClick={onExploreMenu}
                className="px-6 sm:px-7 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-white font-bold text-sm border border-orange-500/40 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Explore Menu</span>
              </button>
            </div>

            {/* Hero Bottom Information with Small Icons & Subtle Dividers */}
            <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-white/10">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-none">4.9</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Customer Rating</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              {/* Delivery */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/15 flex items-center justify-center text-emerald-400">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-none">25 Mins</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Fast Delivery</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              {/* Ingredients */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-400/15 flex items-center justify-center text-rose-400">
                  <Flame className="w-4 h-4 fill-rose-400 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-none">100%</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Fresh Ingredients</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Prominent Food Image & Supporting Glass Floating Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Soft Warm Orange Glow Behind Food Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-rose-500/20 rounded-3xl blur-3xl transform scale-105 pointer-events-none" />

            {/* Food Image Card: Slightly larger, prominent, rounded corners, premium border & soft shadow */}
            <div className="relative w-full max-w-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-black/90 border border-white/15 group bg-slate-950">
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src="/hero-food-spread.png"
                  alt="BiteCraze Artisan Food Spread"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Subtle bottom vignette to emphasize floating badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating Glass Card 1: 4.9 Rating (Top Right) */}
            <div className="absolute -top-3 sm:top-2 -right-2 sm:right-0 z-20 bg-[#0B0F19]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-white shadow-xl shadow-black/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-black leading-none text-white">4.9 Rating</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5">1,200+ Reviews</p>
              </div>
            </div>

            {/* Floating Glass Card 2: Best Seller (Top Left) */}
            <div className="absolute top-1/4 -left-3 sm:-left-5 z-20 bg-[#0B0F19]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-white shadow-xl shadow-black/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              </div>
              <div>
                <p className="text-xs font-black leading-none text-white">Best Seller</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Chef's Special</p>
              </div>
            </div>

            {/* Floating Glass Card 3: 25–30 min (Bottom Left) */}
            <div className="absolute -bottom-3 sm:bottom-4 -left-2 sm:left-2 z-20 bg-[#0B0F19]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-white shadow-xl shadow-black/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-black leading-none text-white">25–30 min</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Express Delivery</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
