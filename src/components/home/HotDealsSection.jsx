import React from 'react';
import { Tag, Flame, Plus, Minus, Star, Clock, Sparkles } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

const HOT_DEALS = [
  {
    id: 'deal-1',
    title: 'Burger + Fries Combo',
    name: 'Burger + Fries Combo',
    description: 'Double crunchy chicken burger, peri-peri loaded fries & chilled beverage.',
    originalPrice: 399,
    discountedPrice: 299,
    price: 299,
    discountPercent: '25% OFF',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    tag: 'Bestseller Combo',
    stock: 50,
    isVeg: false,
    rating: 4.8,
    ratingCount: 340,
    prepTime: '20-25 mins',
    bestseller: true,
  },
  {
    id: 'deal-2',
    title: 'Buy 1 Get 1 Pizza',
    name: 'Buy 1 Get 1 Pizza',
    description: 'Two hand-tossed 10-inch stone-baked pizzas with extra mozzarella and toppings.',
    originalPrice: 699,
    discountedPrice: 399,
    price: 399,
    discountPercent: '43% OFF',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    tag: 'Mega Saver',
    stock: 40,
    isVeg: true,
    rating: 4.9,
    ratingCount: 420,
    prepTime: '20-30 mins',
    bestseller: true,
  },
  {
    id: 'deal-3',
    title: 'Family Feast Platter',
    name: 'Family Feast Platter',
    description: 'Royal Dum Biryani handi, rich butter chicken, 4 butter naans & gulab jamuns.',
    originalPrice: 1099,
    discountedPrice: 799,
    price: 799,
    discountPercent: '27% OFF',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    tag: 'Feast Pack',
    stock: 30,
    isVeg: false,
    rating: 4.8,
    ratingCount: 510,
    prepTime: '25-30 mins',
    bestseller: true,
  },
  {
    id: 'deal-4',
    title: 'Coffee & Snack Combo',
    name: 'Coffee & Snack Combo',
    description: 'Artisan hazelnut iced coffee with hot loaded cheese nachos and spicy dip.',
    originalPrice: 249,
    discountedPrice: 189,
    price: 189,
    discountPercent: '24% OFF',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    tag: 'Quick Delight',
    stock: 60,
    isVeg: true,
    rating: 4.7,
    ratingCount: 380,
    prepTime: '10-15 mins',
    bestseller: true,
  },
];

export default function HotDealsSection({ onOpenDetails, cartQuantities = {} }) {
  const { cart = [], addToCart, updateQuantity, removeFromCart } = usePOS();

  const handleIncrement = (deal) => {
    const item = cart.find((i) => i.id === deal.id);
    if (!item) {
      addToCart({
        id: deal.id,
        name: deal.title,
        price: deal.discountedPrice,
        image: deal.image,
        category: 'deals',
        stock: deal.stock,
        available: true,
        isVeg: deal.isVeg,
        prepTime: deal.prepTime,
        rating: deal.rating,
      });
    } else {
      updateQuantity(deal.id, 1);
    }
  };

  const handleDecrement = (deal) => {
    const item = cart.find((i) => i.id === deal.id);
    if (!item) return;
    if (item.quantity <= 1) {
      removeFromCart(deal.id);
    } else {
      updateQuantity(deal.id, -1);
    }
  };

  return (
    <section id="hot-deals-section" className="relative w-full bg-[#0a0e17] py-12 sm:py-16 border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Customer Favorites layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>LIMITED TIME PROMOTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              🔥 Today's <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Hot Deals</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Freshly prepared combos at exclusive promotional prices.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Guaranteed 25-30 min delivery</span>
          </div>
        </div>

        {/* 4 Cards Grid - Styled exactly like Image 2 ProductCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOT_DEALS.map((deal) => {
            const qty = (cartQuantities && cartQuantities[deal.id]) || cart.find((i) => i.id === deal.id)?.quantity || 0;

            return (
              <div
                key={deal.id}
                onClick={() => onOpenDetails && onOpenDetails(deal)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 select-none cursor-pointer"
              >
                <div>
                  {/* 1. Food Image with Veg/Non-Veg, Bestseller & Prep Time Badges */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Badges on Image - Top Left */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      {/* Veg / Non-Veg Indicator */}
                      {deal.isVeg ? (
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
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] tracking-wide shadow-sm">
                        <Flame className="w-3 h-3 fill-slate-950 text-slate-950" />
                        <span>BESTSELLER</span>
                      </span>
                    </div>

                    {/* Top Right: Discount Badge */}
                    {deal.discountPercent && (
                      <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-[10px] tracking-wide shadow-sm flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{deal.discountPercent}</span>
                      </span>
                    )}

                    {/* Prep Time Badge - Bottom Left */}
                    {deal.prepTime && (
                      <span className="absolute bottom-2 left-2.5 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-amber-300" />
                        <span>{deal.prepTime}</span>
                      </span>
                    )}
                  </div>

                  {/* 2. Product Name, Rating & Description */}
                  <div className="p-3.5 sm:p-4 pb-2">
                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors line-clamp-1">
                      {deal.title}
                    </h3>

                    {/* Rating Row */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-0.5 text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{deal.rating}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({deal.ratingCount})
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>
                </div>

                {/* 3. Price + Add Button Footer Row */}
                <div className="p-3.5 sm:p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        ₹{deal.discountedPrice}
                      </span>
                      {deal.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          ₹{deal.originalPrice}
                        </span>
                      )}
                    </div>
                    {deal.originalPrice && (
                      <span className="text-[10px] text-emerald-600 font-extrabold block">
                        Save ₹{deal.originalPrice - deal.discountedPrice}
                      </span>
                    )}
                  </div>

                  {/* Action Button: Stepper or [+ Add] */}
                  <div>
                    {qty > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 bg-slate-900 text-white px-2 py-1 rounded-xl shadow-md font-black text-xs"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrement(deal);
                          }}
                          aria-label="Decrease quantity"
                          className="w-5 h-5 rounded-md hover:bg-slate-800 flex items-center justify-center text-amber-400 active:scale-90 transition-transform cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-5 text-center font-black text-xs text-white">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrement(deal);
                          }}
                          aria-label="Increase quantity"
                          className="w-5 h-5 rounded-md hover:bg-slate-800 flex items-center justify-center text-amber-400 active:scale-90 transition-transform cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(deal);
                        }}
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
          })}
        </div>
      </div>
    </section>
  );
}
