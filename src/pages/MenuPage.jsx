import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import GourmetHeroSection from '../components/home/GourmetHeroSection';
import HotDealsSection from '../components/home/HotDealsSection';
import CustomerFavorites from '../components/home/CustomerFavorites';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import FloatingCartBar from '../components/pos/FloatingCartBar';
import ProductCard from '../components/pos/ProductCard';
import ProductDetailModal from '../components/pos/ProductDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { productService } from '../api/services/productService';
import { categoryService } from '../api/services/categoryService';
import { usePOS } from '../context/POSContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  UtensilsCrossed,
  Flame,
  Star,
  X,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Monitor,
  Receipt,
  Clock,
  ArrowRight,
  User,
} from 'lucide-react';

const MENU_TABS = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'chicken', name: 'Chicken', icon: '🍗' },
  { id: 'fries', name: 'Fries', icon: '🍟' },
  { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export default function MenuPage() {
  const { currentCustomer } = useCustomerAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);

  // Dietary and feature filters
  const [vegOnly, setVegOnly] = useState(() => currentCustomer?.foodPreference === 'veg');
  const [nonVegOnly, setNonVegOnly] = useState(() => currentCustomer?.foodPreference === 'non-veg');
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [highRatingOnly, setHighRatingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc'

  const { cart, addToCart } = usePOS();

  // Load products and categories from backend API / service
  const loadMenu = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.error('Failed to load menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const scrollToMenu = () => {
    const el = document.getElementById('main-menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Category Tab Matching
      const c = (activeCategory || 'all').toLowerCase();
      const prodCat = (p.category || '').toLowerCase();
      const prodName = (p.name || '').toLowerCase();

      let matchesCategory = true;
      if (c !== 'all') {
        if (c === 'burgers') {
          matchesCategory = prodCat.includes('burger') || prodName.includes('burger');
        } else if (c === 'pizza') {
          matchesCategory = prodCat.includes('pizza') || prodName.includes('pizza');
        } else if (c === 'chicken') {
          matchesCategory = prodCat.includes('chicken') || prodName.includes('chicken');
        } else if (c === 'fries') {
          matchesCategory = prodCat.includes('fries') || prodName.includes('fries');
        } else if (c === 'sandwiches' || c === 'sandwich') {
          matchesCategory = prodCat.includes('sandwich') || prodName.includes('sandwich');
        } else if (c === 'coffee') {
          matchesCategory = prodCat.includes('coffee') || prodName.includes('coffee');
        } else if (c === 'drinks') {
          matchesCategory =
            prodCat.includes('drinks') ||
            prodCat.includes('tea') ||
            prodName.includes('mojito') ||
            prodName.includes('juice') ||
            prodName.includes('tea') ||
            prodName.includes('cooler');
        } else if (c === 'desserts') {
          matchesCategory =
            prodCat.includes('dessert') ||
            prodName.includes('cake') ||
            prodName.includes('brownie') ||
            prodName.includes('ice cream');
        } else {
          matchesCategory = prodCat === c || prodCat.includes(c) || prodName.includes(c);
        }
      }

      // Search match
      const matchesSearch =
        !searchQuery ||
        prodName.includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Dietary checks
      const isVeg = p.isVeg ?? (!prodName.includes('chicken') && !prodName.includes('mutton') && !prodName.includes('egg') && !prodName.includes('meat'));
      const matchesVeg = !vegOnly || isVeg === true;
      const matchesNonVeg = !nonVegOnly || isVeg === false;

      // Badges & rating
      const matchesBestseller = !bestsellerOnly || p.bestseller === true || prodName.includes('chicken burger') || prodName.includes('margherita');
      const rating = Number(p.rating || 4.8);
      const matchesRating = !highRatingOnly || rating >= 4.7;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesVeg &&
        matchesNonVeg &&
        matchesBestseller &&
        matchesRating
      );
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.ratingCount || 100) - (a.ratingCount || 100));
    }

    return result;
  }, [
    products,
    activeCategory,
    searchQuery,
    vegOnly,
    nonVegOnly,
    bestsellerOnly,
    highRatingOnly,
    sortBy,
  ]);

  // Map quantities for quick stepper display on product cards
  const cartQuantities = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      const id = item.baseId || item.id;
      map[id] = (map[id] || 0) + (item.quantity || 1);
    });
    return map;
  }, [cart]);

  const resetAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setVegOnly(false);
    setNonVegOnly(false);
    setBestsellerOnly(false);
    setHighRatingOnly(false);
    setSortBy('popular');
  };

  const hasActiveFilters =
    activeCategory !== 'all' ||
    searchQuery ||
    vegOnly ||
    nonVegOnly ||
    bestsellerOnly ||
    highRatingOnly ||
    sortBy !== 'popular';

  return (
    <div className="w-full bg-[#090c13] min-h-screen text-slate-100 flex flex-col">
      {/* 1. Hero Section (Requirement 2) */}
      <GourmetHeroSection
        onOrderNow={scrollToMenu}
        onExploreMenu={scrollToMenu}
      />

      {/* Special Offers Section */}
      <HotDealsSection
        onOpenDetails={setSelectedProductForDetails}
        cartQuantities={cartQuantities}
      />

      {/* 4. Customer Favorites / Bestsellers (Requirement 5) */}
      <CustomerFavorites
        products={products}
        onAddToCart={addToCart}
        cartQuantities={cartQuantities}
        onOpenDetails={setSelectedProductForDetails}
      />

      {/* 5. Main Food Ordering Menu Section (Requirements 6 & 7) */}
      <section
        id="main-menu-section"
        className="py-12 sm:py-16 bg-[#0c1018] relative border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Fresh & Hot
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2">
                Our <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Menu</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Browse our complete selection of artisan burgers, hand-crafted pizzas, crispy sides, and chilled coolers.
              </p>
            </div>

            {/* Total items badge */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Showing <strong className="text-amber-400">{filteredProducts.length}</strong> items
              </span>
            </div>
          </div>

          {/* Category Tabs (Requirement 6: All, Burgers, Pizza, Chicken, Fries, Sandwiches, Coffee, Drinks, Desserts) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {MENU_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25 scale-102'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Dietary Filter Pills & Sorters */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-[#111726]/90 border border-slate-800/90 shadow-xl">
            {/* Filter Pills row */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {/* Veg Only */}
              <button
                type="button"
                onClick={() => {
                  setVegOnly(!vegOnly);
                  if (!vegOnly) setNonVegOnly(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  vegOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-xs border border-emerald-500 flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span>Pure Veg</span>
              </button>

              {/* Non-Veg Only */}
              <button
                type="button"
                onClick={() => {
                  setNonVegOnly(!nonVegOnly);
                  if (!nonVegOnly) setVegOnly(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  nonVegOnly
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-xs border border-rose-500 flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </span>
                <span>Non-Veg</span>
              </button>

              {/* Bestseller */}
              <button
                type="button"
                onClick={() => setBestsellerOnly(!bestsellerOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  bestsellerOnly
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Bestseller</span>
              </button>

              {/* High Rating */}
              <button
                type="button"
                onClick={() => setHighRatingOnly(!highRatingOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  highRatingOnly
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>Ratings 4.7+</span>
              </button>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                <span className="text-xs text-slate-400 font-bold hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Reset filter button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Cards Grid (Desktop: 4 per row, Tablet: 2-3 per row, Mobile: 2 per row) */}
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" text="Preparing delicious menu..." />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={UtensilsCrossed}
                title="No dishes found"
                description={
                  searchQuery
                    ? `No dishes matching "${searchQuery}". Try searching for burger, pizza, fries, or shake.`
                    : 'No items match your active dietary filters in this category.'
                }
                action={
                  <button
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    View All Items
                  </button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  cartQuantity={cartQuantities[product.id] || 0}
                  onOpenDetails={setSelectedProductForDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Customers Love BiteCraze */}
      <WhyChooseUs />

      {/* 7. Customer Reviews / Social Proof */}
      <CustomerReviews />

      {/* 8. Enterprise Portals & Operational Modules Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Restaurant Operating System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore All BiteCraze Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seamlessly switch between customer storefront, executive business analytics, kitchen preparation display, and cashier POS billing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Director & Admin Portal */}
          <Link
            to="/admin/dashboard"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                Director / Admin Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Executive business dashboard, sales turnover charts, customer analytics, staff shifts, product catalog and settings.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Open Director Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Kitchen Display System (KDS) */}
          <Link
            to="/employee/dashboard"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                Kitchen Display (KDS)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dedicated kitchen terminal for chefs & line cooks. Real-time ticket management, order preparation timers and dispatch.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-orange-400">
              <span>Open Kitchen Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Counter POS Billing Terminal */}
          <Link
            to="/pos"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                Counter POS Terminal
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                High-speed cashier point of sale terminal. Instant product selection grid, bill holding, cash/card register & thermal printing.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>Open POS Terminal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Billing & Checkout */}
          <Link
            to="/billing"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-300 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                Billing & Checkout
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cart management, delivery address details, promo code application, GST tax calculations, and payment completion.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Go to Billing</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Live Order Tracker */}
          <Link
            to="/orders?view=track"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                Orders & Live Tracker
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Animated real-time motorcycle delivery tracker with live pipeline from kitchen prep to doorstep arrival.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-orange-400">
              <span>Track Orders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Customer Profile */}
          <Link
            to="/profile"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-slate-200 transition-colors">
                Customer Profile
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Saved addresses, dietary preferences, order history records, loyalty tier status and account credentials.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 8. Product Details Modal with Add-ons */}
      {selectedProductForDetails && (
        <ProductDetailModal
          product={selectedProductForDetails}
          onClose={() => setSelectedProductForDetails(null)}
        />
      )}

      {/* 10. Floating Sticky Cart Indicator (Requirement 9) */}
      <FloatingCartBar />
    </div>
  );
}
