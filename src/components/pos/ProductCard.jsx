import React from 'react';
import { Plus, Minus, Star, Flame, Clock } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export default function ProductCard({
  product,
  onAddToCart,
  cartQuantity = 0,
  onOpenDetails,
}) {
  const { updateQuantity, removeFromCart } = usePOS();
  if (!product) return null;

  const isOutOfStock = product.stock <= 0 || product.available === false;
  const isLowStock = !isOutOfStock && product.stock <= (product.minStock || 8);

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    }
  };

  const handleIncrement = (e) => {
    if (e) e.stopPropagation();
    if (isOutOfStock) return;
    if (cartQuantity === 0) {
      if (onAddToCart) onAddToCart(product);
    } else {
      updateQuantity(product.id, 1);
    }
  };

  const handleDecrement = (e) => {
    if (e) e.stopPropagation();
    if (cartQuantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, -1);
    }
  };

  const ratingVal = product.rating || 4.8;
  const ratingCountVal = product.ratingCount || 82;

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 select-none ${
        isOutOfStock
          ? 'opacity-60 cursor-not-allowed border-slate-200'
          : 'cursor-pointer hover:border-amber-400/80 border-slate-200/90'
      }`}
    >
      <div>
        {/* 1. Food Image */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';
            }}
          />

          {/* Badges on Image */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {/* Veg / Non-Veg Indicator */}
            {product.isVeg ? (
              <span
                className="w-4 h-4 rounded-sm bg-white/95 backdrop-blur-xs border border-emerald-600 flex items-center justify-center p-0.5 shadow-sm"
                title="Pure Vegetarian"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              </span>
            ) : (
              <span
                className="w-4 h-4 rounded-sm bg-white/95 backdrop-blur-xs border border-rose-700 flex items-center justify-center p-0.5 shadow-sm"
                title="Non-Vegetarian"
              >
                <span className="w-2 h-2 rounded-full bg-rose-700 inline-block" />
              </span>
            )}

            {/* Bestseller Badge */}
            {product.bestseller && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] tracking-wide shadow-sm">
                <Flame className="w-3 h-3 fill-slate-950 text-slate-950" />
                <span>BESTSELLER</span>
              </span>
            )}
          </div>

          {/* Stock Notification Badge */}
          {isOutOfStock ? (
            <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] uppercase shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] shadow-sm">
              Only {product.stock} Left
            </span>
          ) : null}

          {/* Prep time */}
          {product.prepTime && (
            <span className="absolute bottom-2 left-2.5 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-amber-300" />
              <span>{product.prepTime}</span>
            </span>
          )}
        </div>

        {/* 2. Product Name, Rating & Description */}
        <div className="p-3.5 sm:p-4 pb-2">
          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-0.5 text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{ratingVal}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ({ratingCountVal})
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || 'Prepared fresh with prime ingredients & secret spices.'}
          </p>
        </div>
      </div>

      {/* 3. Price + Add Button Footer Row */}
      <div className="p-3.5 sm:p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          ₹{product.price}
        </span>

        {/* Action Button */}
        <div>
          {isOutOfStock ? (
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Unavailable
            </span>
          ) : cartQuantity > 0 ? (
            /* Interactive Stepper */
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-2 py-1 rounded-xl shadow-md font-black text-xs"
            >
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="w-5 h-5 rounded-md hover:bg-slate-800 flex items-center justify-center text-amber-400 active:scale-90 transition-transform"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-5 text-center font-black text-xs text-white">
                {cartQuantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-5 h-5 rounded-md hover:bg-slate-800 flex items-center justify-center text-amber-400 active:scale-90 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Highly Visible [+ Add] Button */
            <button
              type="button"
              onClick={handleIncrement}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
