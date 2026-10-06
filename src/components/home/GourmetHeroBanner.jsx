import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  User,
  LogOut,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { usePOS } from '../../context/POSContext';

export default function GourmetHeroBanner({
  searchQuery = '',
  onSearchChange = () => {},
  onSelectCategory = () => {},
  deliveryAddress = '',
  onUpdateDeliveryAddress = () => {},
}) {
  const { currentCustomer, isLoggedIn, openLoginModal, logout } = useCustomerAuth();
  const { cart } = usePOS();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [locationValue, setLocationValue] = useState(
    deliveryAddress || currentCustomer?.address || 'Chennai, Tamil Nadu'
  );
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const predefinedLocations = [
    'Chennai, Tamil Nadu',
    'T. Nagar, Chennai',
    'Anna Nagar, Chennai',
    'Velachery, Chennai',
    'Adyar, Chennai',
    'Bangalore, Karnataka',
    'Indiranagar, Bangalore',
    'Koramangala, Bangalore',
  ];

  const handleSelectLocation = (loc) => {
    setLocationValue(loc);
    onUpdateDeliveryAddress(loc);
    setShowLocationDropdown(false);
  };

  const handleScrollToMenu = (categorySlug = 'all') => {
    onSelectCategory(categorySlug);
    const menuEl = document.getElementById('food-menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-[#090b10] via-[#0f1420] to-[#151c2d] text-white overflow-hidden select-none border-b border-slate-800/80">
      {/* Ambient Lighting & Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        {/* Brand Logo: BiteCraze Gourmet Cloche / Flame */}
        <Link to="/menu" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-2xl tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                BiteCraze
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400/80 block mt-0.5">
              Artisan Kitchen & Dining
            </span>
          </div>
        </Link>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => handleScrollToMenu('all')}
            className="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm font-bold hover:text-amber-400 transition-colors cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Explore Menu</span>
          </button>

          <Link
            to="/orders"
            className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm font-bold hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Track Orders</span>
          </Link>

          <Link
            to="/admin/login"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </Link>

          {/* Cart Quick Button */}
          {totalCartCount > 0 && (
            <Link
              to="/billing"
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{totalCartCount}</span>
            </Link>
          )}

          {/* Sign In / Customer Profile Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="max-w-[100px] truncate">{currentCustomer?.name || 'Account'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">
                      {currentCustomer?.name}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono">
                      {currentCustomer?.phone}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* MAIN HERO SPLIT CONTENT SECTION */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Headline, Highlights, & Integrated Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>HANDCRAFTED GOURMET EXPERIENCES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.12] text-white">
              Authentic Flavors, <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Cooked To Perfection.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              Indulge in royal dum biryanis, aromatic curries, woodfired breads, and handcrafted fast bites — made fresh to order with traditional secret spice blends.
            </p>

            {/* DUAL SEARCH & LOCATION CONSOLE (Obsidian Dark Glass Style) */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 backdrop-blur-xl shadow-2xl shadow-black/50 max-w-xl">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                {/* Location Picker */}
                <div className="relative w-full sm:w-[42%]">
                  <div
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="w-full h-12 bg-slate-800/90 hover:bg-slate-800 rounded-xl px-3.5 flex items-center gap-2.5 cursor-pointer border border-slate-700/60 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">
                        Deliver To
                      </span>
                      <input
                        type="text"
                        value={locationValue}
                        onChange={(e) => {
                          setLocationValue(e.target.value);
                          onUpdateDeliveryAddress(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Select location"
                        className="w-full text-xs font-bold text-white placeholder-slate-400 focus:outline-none truncate bg-transparent mt-0.5"
                      />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>

                  {/* Dropdown */}
                  {showLocationDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowLocationDropdown(false)}
                      />
                      <div className="absolute left-0 top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-left max-h-56 overflow-y-auto">
                        <p className="px-3.5 py-1 text-[10px] font-black uppercase text-amber-400/80 tracking-wider">
                          Popular Neighborhoods
                        </p>
                        {predefinedLocations.map((loc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectLocation(loc)}
                            className="w-full px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2 transition-colors cursor-pointer text-left"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{loc}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Dish Search Input */}
                <div className="w-full sm:w-[58%] h-12 bg-slate-800/90 rounded-xl px-3.5 flex items-center gap-2.5 border border-slate-700/60 focus-within:border-amber-400 transition-colors">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search dishes, biryani, curries..."
                    className="flex-1 text-xs font-bold text-white placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleScrollToMenu('all')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>25-30 Mins Hot Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                  ★
                </div>
                <span>4.9/5 Dining Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">
                  🔥
                </div>
                <span>100% Fresh Daily Ingredients</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Cinematic Feature of User's Food Spread Image */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Backlight Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-rose-500/20 rounded-3xl blur-2xl transform scale-95 pointer-events-none" />

            {/* Main Showcase Card Holding User's Second Image */}
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-slate-700/60 group bg-slate-900">
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src="/hero-food-spread.png"
                  alt="BiteCraze Signature Feast"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 pointer-events-none" />
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 text-amber-400 font-black text-xs shadow-xl flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Chef's Grand Feast</span>
              </div>

              {/* Floating Badge 2: Bottom Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Royal Feast Collection</h3>
                  <p className="text-[11px] text-amber-400/90 font-medium">Breads, Gravies, Kebabs & Biryani</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleScrollToMenu('all')}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl text-xs font-black hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-1 shadow-md shadow-amber-500/20"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 DISTINCT GOURMET SERVICE PILLARS (Completely Different Pattern) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-10 sm:mt-14">
          {/* Pillar 1: Express Delivery */}
          <div
            onClick={() => handleScrollToMenu('all')}
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-4 shadow-lg hover:shadow-amber-500/10"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Flame className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Doorstep Express
              </span>
              <h4 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                Hot & Fresh Delivery
              </h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Thermal insulated packaging, delivered within 30 mins
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>

          {/* Pillar 2: Dine-In & Table Reservation */}
          <div
            onClick={() => handleScrollToMenu('briyani')}
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-4 shadow-lg hover:shadow-orange-500/10"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Table Service
              </span>
              <h4 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                Dine-In & Counter
              </h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Fresh aromas, zero waiting, order direct from table
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>

          {/* Pillar 3: Handcrafted Platters */}
          <div
            onClick={() => handleScrollToMenu('chicken-gravy')}
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-4 shadow-lg hover:shadow-rose-500/10"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                Party & Combos
              </span>
              <h4 className="text-base font-black text-white group-hover:text-rose-400 transition-colors">
                Chef's Family Platters
              </h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Generous party packs, biryani handis & gravy bowls
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
