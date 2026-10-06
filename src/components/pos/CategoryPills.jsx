import React from 'react';
import {
  Sparkles,
  CupSoda,
  Coffee,
  GlassWater,
  UtensilsCrossed,
  Pizza,
  Flame,
  Cookie,
  Gift,
  IceCream,
  Sandwich as SandwichIcon,
} from 'lucide-react';

const iconMap = {
  CupSoda,
  Coffee,
  GlassWater,
  UtensilsCrossed,
  Pizza,
  Sandwich: SandwichIcon,
  Flame,
  Cookie,
  Gift,
  IceCream,
};

export default function CategoryPills({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
  productCounts = {},
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
      {/* "All" Category Pill */}
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 shadow-xs ${
          activeCategory === 'all'
            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>All Items</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            activeCategory === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {productCounts['all'] || 0}
        </span>
      </button>

      {/* Dynamic Categories */}
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || UtensilsCrossed;
        const isActive = activeCategory === cat.slug;
        const count = productCounts[cat.slug] || 0;

        return (
          <button
            key={cat.id || cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 shadow-xs ${
              isActive
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
