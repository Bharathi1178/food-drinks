import React from 'react';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

export default function CategoryStrip({
  categories = [],
  activeCategory = null,
  onSelectCategory,
  productCounts = {},
}) {
  return (
    <section className="bg-white rounded-3xl p-5 lg:p-6 border border-slate-200/80 shadow-xs">
      {/* Header: Explore Culinary Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-500" />
            <span>Explore Culinary Categories</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Select any cuisine or dish category below to view fresh handcrafted meals
          </p>
        </div>

        {activeCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="self-start sm:self-auto text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
        {/* "All Items" Option */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className="group flex flex-col items-center text-center focus:outline-none transition-transform active:scale-95 w-full cursor-pointer"
        >
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-sm relative overflow-hidden ${
              activeCategory === 'all'
                ? 'ring-4 ring-amber-500 ring-offset-2 bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-700 hover:bg-amber-50 group-hover:scale-105'
            }`}
          >
            <Sparkles
              className={`w-8 h-8 sm:w-9 sm:h-9 ${
                activeCategory === 'all' ? 'text-slate-950' : 'text-amber-500'
              }`}
            />
            <span className="text-[11px] font-black uppercase tracking-wider mt-1">
              All
            </span>
          </div>
          <span
            className={`text-xs font-black mt-2 max-w-[100px] truncate transition-colors ${
              activeCategory === 'all'
                ? 'text-amber-600'
                : 'text-slate-800 group-hover:text-amber-600'
            }`}
          >
            All Items
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {productCounts['all'] || 0} dishes
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const count = productCounts[cat.slug] || 0;

          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="group flex flex-col items-center text-center focus:outline-none transition-transform active:scale-95 w-full cursor-pointer"
            >
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full relative overflow-hidden bg-slate-100 transition-all duration-200 shadow-sm ${
                  isActive
                    ? 'ring-4 ring-amber-500 ring-offset-2 shadow-lg shadow-amber-500/35 scale-105'
                    : 'border-2 border-transparent hover:border-amber-300 group-hover:scale-105'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[1px]" />
                )}
              </div>

              {/* Category Name */}
              <span
                className={`text-xs font-black mt-2 max-w-[110px] line-clamp-1 transition-colors leading-tight ${
                  isActive
                    ? 'text-amber-600'
                    : 'text-slate-800 group-hover:text-amber-600'
                }`}
                title={cat.name}
              >
                {cat.name}
              </span>

              {/* Subtitle / Item Count */}
              <span className="text-[10px] text-slate-400 font-semibold line-clamp-1 max-w-[110px]">
                {count > 0 ? `${count} items` : cat.subtitle || 'Fresh'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
