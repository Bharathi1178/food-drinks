import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

const DEFAULT_ADDONS = [
  { id: 'addon-cheese', name: 'Extra Cheese', price: 30 },
  { id: 'addon-patty', name: 'Extra Patty / Protein', price: 50 },
  { id: 'addon-sauce', name: 'Spicy Gourmet Sauce', price: 10 },
  { id: 'addon-dip', name: 'Garlic Mayo Dip', price: 20 },
];

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = usePOS();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0 || product.available === false;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = Number(product.price || 0) + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedAddons);
    onClose();
  };

  // Mock ingredients if not present
  const ingredients = product.ingredients
    ? (Array.isArray(product.ingredients) ? product.ingredients : product.ingredients.split(','))
    : ['Artisan Brioche', 'Chef Secret Glaze', 'Organic Greens', 'Fresh Farm Herbs'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#111726] text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700/60 animate-scale-up max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center transition-all active:scale-95 border border-white/10 backdrop-blur-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-black/40 pointer-events-none" />

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {product.isVeg ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-xs font-bold shadow-md backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Pure Veg</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/90 text-rose-400 border border-rose-500/40 text-xs font-bold shadow-md backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                <span>Non-Veg</span>
              </span>
            )}

            {product.bestseller && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>Bestseller</span>
              </span>
            )}
          </div>

          {/* Title & Category over gradient */}
          <div className="absolute bottom-3 left-5 right-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {product.category?.replace('-', ' ') || 'Chef Specialty'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-md">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Price & Rating Bar */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">
                Base Price
              </span>
              <span className="text-2xl font-black text-amber-400">
                ₹{product.price}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating || '4.8'}</span>
                <span className="text-slate-400 font-normal">
                  ({product.ratingCount || '124'})
                </span>
              </div>

              {product.prepTime && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/60">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{product.prepTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Description
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {product.description || 'Crafted with premium ingredients, perfected with house recipes, and served sizzling hot.'}
            </p>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Key Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium"
                >
                  {typeof ing === 'string' ? ing.trim() : ing}
                </span>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">
                Choose Add-ons & Customizations
              </h4>
              <span className="text-[11px] text-slate-400">Optional</span>
            </div>

            <div className="space-y-2">
              {DEFAULT_ADDONS.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                            : 'border-slate-600 bg-slate-900/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">{addon.name}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      +₹{addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality highlights */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Artisan Prepared</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Quality Inspected</span>
            </div>
          </div>
        </div>

        {/* Modal Footer: Quantity Stepper & Add to Cart */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-2xl p-1 shadow-inner">
            <button
              type="button"
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-xl hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center text-sm font-black text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-xl hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? 'Sold Out'
                : `Add to Cart – ₹${totalPrice}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
