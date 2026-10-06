import React from 'react';
import { Flame, Star, Sparkles } from 'lucide-react';
import ProductCard from '../pos/ProductCard';

export default function CustomerFavorites({ products, onAddToCart, cartQuantities, onOpenDetails }) {
  // Select top 4-5 customer favorite products
  const favorites = (products || [])
    .filter((p) => {
      const name = p.name.toLowerCase();
      return (
        p.bestseller ||
        name.includes('chicken burger') ||
        name.includes('margherita') ||
        name.includes('fries') ||
        name.includes('cold coffee') ||
        name.includes('combo')
      );
    })
    .slice(0, 4);

  // If no products loaded yet, fallback to first 4
  const displayItems = favorites.length > 0 ? favorites : (products || []).slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#0a0e17] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Most Ordered Today</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              🔥 Customer <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Favorites</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Handcrafted crowd-pleasers loved and devoured by thousands every single day.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Guaranteed 25-30 min delivery</span>
          </div>
        </div>

        {/* Product Cards Grid: 4 items per row on desktop, 2 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayItems.map((product) => (
            <ProductCard
              key={`fav-${product.id}`}
              product={{ ...product, bestseller: true }}
              onAddToCart={onAddToCart}
              cartQuantity={cartQuantities[product.id] || 0}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
