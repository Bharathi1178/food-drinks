import React from 'react';
import { Sparkles } from 'lucide-react';

const CRAVING_CATEGORIES = [
  { id: 'all', name: 'All Items', emoji: '✨', slug: 'all', color: 'from-amber-500 to-orange-500' },
  { id: 'burgers', name: 'Burgers', emoji: '🍔', slug: 'burgers', color: 'from-orange-500 to-amber-600' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', slug: 'pizza', color: 'from-red-500 to-orange-500' },
  { id: 'fries', name: 'Fries', emoji: '🍟', slug: 'fries', color: 'from-amber-400 to-yellow-500' },
  { id: 'wraps', name: 'Wraps', emoji: '🌯', slug: 'wraps', color: 'from-emerald-500 to-teal-500' },
  { id: 'sandwiches', name: 'Sandwiches', emoji: '🥪', slug: 'sandwiches', color: 'from-amber-600 to-orange-600' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', slug: 'chicken-gravy', color: 'from-rose-500 to-red-600' },
  { id: 'briyani', name: 'Biryani', emoji: '🍛', slug: 'briyani', color: 'from-orange-600 to-amber-600' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', slug: 'drinks', color: 'from-amber-700 to-yellow-700' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', slug: 'drinks', color: 'from-cyan-500 to-blue-500' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰', slug: 'desserts', color: 'from-pink-500 to-rose-500' },
];

export default function QuickCategories({
  activeCategory = 'all',
  onSelectCategory = () => {},
}) {
  const handleClick = (slug) => {
    onSelectCategory(slug);
    const menuEl = document.getElementById('food-menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#0c1018] py-8 sm:py-10 border-b border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>What are you craving?</span>
              <span className="text-xl sm:text-2xl">😋</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
              Tap any category to filter our live kitchen menu
            </p>
          </div>

          {activeCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="self-start sm:self-auto text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-3.5 py-1.5 rounded-xl border border-amber-400/30 transition-colors cursor-pointer"
            >
              Reset to All
            </button>
          )}
        </div>

        {/* Horizontal Category Cards Bar */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {CRAVING_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleClick(cat.slug)}
                className={`group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl shrink-0 transition-all duration-200 cursor-pointer min-w-[85px] sm:min-w-[95px] border ${
                  isActive
                    ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 hover:scale-102'
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110 shadow-inner ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-slate-800/80'
                  }`}
                >
                  {cat.emoji}
                </div>
                <span
                  className={`text-xs font-extrabold mt-2 tracking-tight transition-colors text-center ${
                    isActive ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
