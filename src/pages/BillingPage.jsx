import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Truck,
  User,
  Phone,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Percent,
  Receipt,
  RotateCcw,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Building,
  Home,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useSettings } from '../context/SettingsContext';
import PaymentModal from '../components/pos/PaymentModal';

export default function BillingPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    selectedCustomer,
    setSelectedCustomer,
    deliveryDistrict,
    setDeliveryDistrict,
    deliveryArea,
    setDeliveryArea,
    deliveryAddress,
    setDeliveryAddress,
    deliveryLandmark,
    setDeliveryLandmark,
    deliveryBuildingDetails,
    setDeliveryBuildingDetails,
    deliveryInstructions,
    setDeliveryInstructions,
    deliveryOtherInstructions,
    setDeliveryOtherInstructions,
    subtotal,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    discountAmount,
    taxRate,
    taxAmount,
    grandTotal,
    setPaymentModalOpen,
  } = usePOS();

  const { currentCustomer, isLoggedIn, openLoginModal, openSignupModal } = useCustomerAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // Delivery instructions options
  const instructionOptions = [
    'Leave at door',
    'Ring bell',
    'Do not ring bell',
    'Avoid calling',
  ];

  // Empty Cart Screen
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-inner border border-orange-100">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5">
              Looks like you haven't added any dishes yet. Browse our delicious biryanis, dosas, curries & burgers to order online.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
            >
              <Flame className="w-5 h-5 text-amber-200" />
              <span>Ready to Order • Go to Menu</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Header & Back to Menu Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Menu / Add More Dishes</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Checkout & Food Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Review your delivery address, ordered items, and proceed to payment.
          </p>
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-orange-500/50 rounded-xl text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-orange-400" />
          <span>Add More Dishes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Delivery Location & Ordered Dishes */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. DELIVERY ADDRESS & LANDMARK CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 leading-tight">
                    1. Delivery Address & Contact
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Food will be delivered to this location
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Clock className="w-3.5 h-3.5" />
                <span>25-30 Mins Delivery</span>
              </div>
            </div>

            {/* 1. Recipient Name & Mobile Number (Side-by-side on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Recipient Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedCustomer?.name || ''}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Mobile Number <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={selectedCustomer?.phone || ''}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        phone: e.target.value,
                      })
                    }
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. District & Area / Locality (Side-by-side on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  District <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={deliveryDistrict}
                    onChange={(e) => setDeliveryDistrict(e.target.value)}
                    placeholder="e.g. Chennai"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Area / Locality <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    placeholder="e.g. Perungudi, Anna Nagar"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Complete Delivery Address Field */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Complete Delivery Address <span className="text-orange-500">*</span>
              </label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Door No, Street name, Locality"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
              />
            </div>

            {/* 4. Nearby Landmark Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-slate-700">
                  Nearby Landmark <span className="text-orange-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Helps delivery driver find your place easily
                </span>
              </div>
              <div className="relative">
                <Navigation className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={deliveryLandmark}
                  onChange={(e) => setDeliveryLandmark(e.target.value)}
                  placeholder="e.g. Opposite City Metro Station / Near Apollo Pharmacy"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* 5. Additional Location Details (Optional) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Additional Location Details <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={deliveryBuildingDetails}
                  onChange={(e) => setDeliveryBuildingDetails(e.target.value)}
                  placeholder="House No / Building Name / Floor / Apartment / Door No (e.g. Flat 4B, Emerald Heights, 2nd Floor)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* 6. Delivery Instructions Pills & Other Instructions */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Delivery Instructions
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {instructionOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDeliveryInstructions(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      deliveryInstructions === opt
                        ? 'bg-orange-50 text-orange-600 border-orange-400 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Optional Other Instructions Field */}
              <div className="pt-1.5">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Other Instructions <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={deliveryOtherInstructions}
                  onChange={(e) => setDeliveryOtherInstructions(e.target.value)}
                  placeholder="e.g. Call me when you reach the gate"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* 2. ORDERED DISHES LIST */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>2. Ordered Dishes</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-extrabold">
                  {cart.length} {cart.length === 1 ? 'Dish' : 'Dishes'}
                </span>
              </h2>

              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Dishes Items */}
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4 group"
                >
                  {/* Dish Thumbnail & Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'
                      }
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs border border-slate-100"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-bold block">
                        ₹{item.price} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-black active:scale-95 shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-6 text-center text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-black active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="w-16 text-right text-xs font-black text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BILL BREAKDOWN & PROCEED TO PAY */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Bill Details
            </h3>

            {/* Bill Rows */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Item Total</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Delivery Partner Fee */}
              <div className="flex justify-between text-slate-600 font-medium items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Delivery Partner Fee</span>
                </span>
                <span className="text-emerald-600 font-black">
                  FREE
                </span>
              </div>

              {/* GST / Taxes */}
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Govt Taxes & Restaurant GST ({taxRate}%)</span>
                <span className="font-bold text-slate-900">₹{taxAmount.toFixed(2)}</span>
              </div>

              {/* Discount if applied */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Coupon Accordion */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDiscountInput(!showDiscountInput)}
                  className="flex items-center justify-between w-full text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Apply Coupon or Discount</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      showDiscountInput ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showDiscountInput && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`flex-1 py-1 rounded-xl text-xs font-bold border ${
                          discountType === 'percentage'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Percentage (%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`flex-1 py-1 rounded-xl text-xs font-bold border ${
                          discountType === 'fixed'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Fixed (₹)
                      </button>
                    </div>

                    <input
                      type="number"
                      min={0}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                    To Pay
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Inclusive of all taxes
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Account Required Notice if Customer is NOT signed up/logged in */}
            {!isLoggedIn && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="text-xs font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Customer Sign Up Required</span>
                </p>
                <p className="text-[11px] text-amber-800">
                  Please sign up or sign in below so your details are attached and you can place your order.
                </p>
              </div>
            )}

            {/* Big Action Button to Pay / Sign Up */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  // Customer has NOT signed up: direct go to the signup page!
                  openSignupModal();
                  return;
                }
                if (!selectedCustomer?.name?.trim()) {
                  alert('Please enter recipient name before proceeding.');
                  return;
                }
                if (!selectedCustomer?.phone?.trim()) {
                  alert('Please enter recipient mobile number before proceeding.');
                  return;
                }
                if (!deliveryDistrict?.trim()) {
                  alert('Please enter delivery District before proceeding.');
                  return;
                }
                if (!deliveryArea?.trim()) {
                  alert('Please enter delivery Area / Locality before proceeding.');
                  return;
                }
                if (!deliveryAddress?.trim()) {
                  alert('Please enter Complete Delivery Address before proceeding.');
                  return;
                }
                if (!deliveryLandmark?.trim()) {
                  alert('Please enter Nearby Landmark before proceeding.');
                  return;
                }
                setPaymentModalOpen(true);
              }}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-200" />
              <span>
                {isLoggedIn
                  ? `PROCEED TO PAY • ₹${grandTotal.toFixed(2)}`
                  : `SIGN UP TO PLACE ORDER • ₹${grandTotal.toFixed(2)}`}
              </span>
            </button>

            {/* Secure Payment Assurance */}
            <p className="text-[11px] text-slate-400 text-center font-medium">
              100% Safe & Secure Online Checkout
            </p>
          </div>
        </div>
      </div>

      {/* Global Payment & Order Confirmation Modal */}
      <PaymentModal />
    </div>
  );
}
