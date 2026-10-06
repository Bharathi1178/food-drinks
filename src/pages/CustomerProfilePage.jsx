import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  CreditCard,
  Settings,
  Bell,
  Utensils,
  Flame,
  CheckCircle2,
  ArrowLeft,
  LogOut,
  Save,
  RotateCcw,
  Sparkles,
  Printer,
  Sliders,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { usePOS } from '../context/POSContext';

export default function CustomerProfilePage() {
  const {
    currentCustomer,
    isLoggedIn,
    openLoginModal,
    openSignupModal,
    updateProfile,
    updateSettings,
    logout,
  } = useCustomerAuth();

  const { setSelectedCustomer } = usePOS();
  const navigate = useNavigate();

  // Tab: 'details' (signup details) | 'settings' (common customer settings)
  const [activeTab, setActiveTab] = useState('details');

  // Form state for signup details
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
  });

  // Settings state for common customer settings
  const [settingsData, setSettingsData] = useState({
    foodPreference: 'all', // 'all' | 'veg' | 'non-veg'
    defaultOrderType: 'Dine In', // 'Dine In' | 'Takeaway' | 'Delivery'
    spicePreference: 'Medium', // 'Mild' | 'Medium' | 'Spicy'
    orderAlerts: true,
    autoPrintReceipt: true,
    theme: 'warm',
  });

  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Sync state with logged-in customer data
  useEffect(() => {
    if (currentCustomer) {
      setFormData({
        name: currentCustomer.name || '',
        phone: currentCustomer.phone || '',
        email: currentCustomer.email || '',
        address: currentCustomer.address || '',
        landmark: currentCustomer.landmark || '',
      });
      setSettingsData({
        foodPreference: currentCustomer.foodPreference || 'all',
        defaultOrderType: currentCustomer.defaultOrderType || 'Dine In',
        spicePreference: currentCustomer.spicePreference || 'Medium',
        orderAlerts: currentCustomer.orderAlerts !== undefined ? currentCustomer.orderAlerts : true,
        autoPrintReceipt: currentCustomer.autoPrintReceipt !== undefined ? currentCustomer.autoPrintReceipt : true,
        theme: currentCustomer.theme || 'warm',
      });
      // Also ensure POS selected customer is synced
      setSelectedCustomer(currentCustomer);
    }
  }, [currentCustomer, setSelectedCustomer]);

  // If customer is not logged in, show an attractive invitation card to Sign Up or Login
  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
            <User className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Customer Account & Settings
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              Sign up or log in to view your saved details, track your order history, and customize your customer dining preferences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={openSignupModal}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
            >
              Sign Up (New Customer)
            </button>
            <button
              onClick={openLoginModal}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black active:scale-95 transition-all"
            >
              Sign In with Mobile / Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle saving signup profile details
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = updateProfile(formData);
    if (updated) {
      setSelectedCustomer(updated);
      setSavedSuccessMsg('Signup details updated successfully!');
      setTimeout(() => setSavedSuccessMsg(''), 3500);
    }
  };

  // Handle saving common customer settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updated = updateSettings(settingsData);
    if (updated) {
      setSavedSuccessMsg('Common customer settings updated successfully!');
      setTimeout(() => setSavedSuccessMsg(''), 3500);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/menu');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Back to Menu link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/menu')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Food Menu</span>
        </button>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Customer Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar Circle */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-inner border border-white/30 shrink-0">
            {currentCustomer.name ? currentCustomer.name.slice(0, 2).toUpperCase() : 'CU'}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-200" />
                <span>Verified Customer</span>
              </span>
              <span className="text-xs text-orange-100 font-medium">
                ID: {currentCustomer.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentCustomer.name}
            </h1>
            <p className="text-xs text-orange-100 mt-0.5 flex items-center gap-2">
              <span>{currentCustomer.phone}</span>
              {currentCustomer.email && <span>• {currentCustomer.email}</span>}
            </p>
          </div>
        </div>

        {/* Quick Order Stats */}
        <div className="flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
          <div className="text-center">
            <span className="text-[10px] text-orange-100 font-semibold block uppercase">
              Orders
            </span>
            <span className="text-lg font-black text-white">
              {currentCustomer.totalOrders || 0}
            </span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-orange-100 font-semibold block uppercase">
              Total Spent
            </span>
            <span className="text-lg font-black text-white">
              ₹{(currentCustomer.totalSpent || 0).toFixed(0)}
            </span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-orange-100 font-semibold block uppercase">
              Member Since
            </span>
            <span className="text-xs font-black text-white">
              {currentCustomer.createdAt || 'Recent'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Navigation: Signup Details vs Common Settings */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'details'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Customer Signup Details</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Common Settings for Customer</span>
        </button>
      </div>

      {/* Tab 1: All Signup Details Display & Edit */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              <span>Personal Signup Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and update your personal contact details, mobile number, and delivery address.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Customer Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Opposite Bank / Near Park"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Delivery / Home Address */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Saved Delivery & Billing Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete street address, door number, area"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Signup Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Common Settings for Customers */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              <span>Common Settings & Preferences</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize your dining style, dietary filters, order mode, and notification sounds.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* 1. Food Dietary Preference */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Food Dietary Preference
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Filter menu automatically based on your dining preference
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSettingsData({ ...settingsData, foodPreference: 'all' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border text-center ${
                    settingsData.foodPreference === 'all'
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsData({ ...settingsData, foodPreference: 'veg' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border text-center flex items-center justify-center gap-1.5 ${
                    settingsData.foodPreference === 'veg'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block border border-white" />
                  <span>Pure Veg Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsData({ ...settingsData, foodPreference: 'non-veg' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border text-center flex items-center justify-center gap-1.5 ${
                    settingsData.foodPreference === 'non-veg'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block border border-white" />
                  <span>Non-Veg Focus</span>
                </button>
              </div>
            </div>

            {/* 2. Default Order Mode Preference */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">
                  Preferred Dining / Order Mode
                </h3>
                <p className="text-[11px] text-slate-500">
                  Preselects your favorite order type automatically during checkout
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {['Dine In', 'Takeaway', 'Delivery'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSettingsData({ ...settingsData, defaultOrderType: mode })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border text-center ${
                      settingsData.defaultOrderType === mode
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Spice Level Preference */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">
                  Preferred Spice Level
                </h3>
                <p className="text-[11px] text-slate-500">
                  Used by kitchen cooks for your Biryanis, Curries & Fries
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {['Mild', 'Medium', 'Spicy'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSettingsData({ ...settingsData, spicePreference: level })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border text-center ${
                      settingsData.spicePreference === level
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level === 'Spicy' ? '🌶️ Spicy' : level === 'Medium' ? 'Medium' : 'Mild'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Toggles: Order Alerts & Auto Print */}
            <div className="space-y-3">
              {/* Order Status Chime */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      Order Status Audio Chimes
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Play notification sound when food status is updated
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settingsData.orderAlerts}
                  onChange={(e) => setSettingsData({ ...settingsData, orderAlerts: e.target.checked })}
                  className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                />
              </div>

              {/* Auto Thermal Receipt */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      Auto-Pop Thermal Receipt
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Instantly show printable bill receipt after completing payment
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settingsData.autoPrintReceipt}
                  onChange={(e) => setSettingsData({ ...settingsData, autoPrintReceipt: e.target.checked })}
                  className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Common Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
