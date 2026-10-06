import React from 'react';
import { Flame, Truck, Star, Sparkles } from 'lucide-react';

const REASONS = [
  {
    icon: Flame,
    title: 'Freshly Prepared',
    description: 'Every order is prepared fresh to order in our artisan kitchen.',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Hot food delivered quickly in temperature-controlled packaging.',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Star,
    title: 'Highly Rated',
    description: 'Loved by thousands of foodies across the city with 4.9★ rating.',
    color: 'from-yellow-500/20 to-amber-500/10',
    border: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
  },
  {
    icon: Sparkles,
    title: 'Quality Ingredients',
    description: 'Farm-fresh veggies, 100% genuine meats and zero artificial additives.',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 bg-[#0a0e17] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Trust & Quality
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
            Why Customers Love <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">BiteCraze</span> ❤️
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            We hold ourselves to the highest standards of culinary craft, safety, and speedy delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-gradient-to-b ${item.color} ${item.border} border bg-[#111726]/80 backdrop-blur-xs hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/20`}
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${item.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
