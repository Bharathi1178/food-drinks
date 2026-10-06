import React, { useState, useEffect, useMemo } from 'react';
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
  UtensilsCrossed,
  Search,
  Check,
  Printer,
  ChevronUp,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useSettings } from '../context/SettingsContext';
import PaymentModal from '../components/pos/PaymentModal';

export default function BillingPage() {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    tableNo,
    setTableNo,
    activeReceipt,
    setActiveReceipt,
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

  const handleProceedToPay = () => {
    if (cart.length === 0) {
      alert('Please add at least one dish to the bill before proceeding.');
      return;
    }

    // Auto-fill customer if empty
    if (!selectedCustomer?.name?.trim()) {
      setSelectedCustomer((prev) => ({
        ...prev,
        name: currentCustomer?.name || 'Customer',
        phone: prev?.phone || '9876543210',
      }));
    }

    // Delivery-specific validations
    if (orderType === 'Delivery') {
      if (!deliveryDistrict?.trim()) setDeliveryDistrict('Chennai');
      if (!deliveryArea?.trim()) setDeliveryArea('Velachery');
      if (!deliveryAddress?.trim()) setDeliveryAddress('12/4 Main Road, Chennai');
      if (!deliveryLandmark?.trim()) setDeliveryLandmark('Near Landmark Point');
    }

    setPaymentModalOpen(true);
  };

  const handlePrintSampleInvoice = () => {
    if (cart.length > 0) {
      setActiveReceipt({
        id: 'BILL-' + Math.floor(100000 + Math.random() * 900000),
        items: cart,
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        grandTotal,
        customerName: selectedCustomer?.name || 'Walk-in Customer',
        customerPhone: selectedCustomer?.phone || '9876543210',
        orderType: orderType || 'Dine In',
        deliveryAddress: deliveryAddress || '',
        deliveryLandmark: deliveryLandmark || '',
        created_at: new Date().toISOString(),
      });
    } else {
      alert('Add items to the bill to generate and preview an invoice.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 px-4 sm:px-6">
      {/* Top Header & Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Full Food Menu</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Billing & Checkout</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
              Fast Invoice System
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Create bills, add dishes, calculate totals & generate instant tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={handlePrintSampleInvoice}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Invoice</span>
            </button>
          )}

          <Link
            to="/menu"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl text-xs font-extrabold shadow-md transition-all shrink-0 cursor-pointer"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>

      {/* MAIN BILLING SCREEN: ORDER TYPE, RECIPIENT & BILL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Order Mode, Customer Info & Ordered Dishes */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. ORDER MODE SELECTOR */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                1. Order Channel & Mode
              </span>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                {orderType} Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { type: 'Delivery', icon: Truck, label: 'Food Delivery', desc: 'Doorstep dispatch' },
                { type: 'Takeaway', icon: ShoppingBag, label: 'Takeaway', desc: 'Self pickup parcel' },
                { type: 'Dine In', icon: UtensilsCrossed, label: 'Dine-In', desc: 'Table service' },
              ].map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderType === type
                      ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-sm ring-2 ring-orange-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 ${
                      orderType === type ? 'text-orange-600' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-xs font-black leading-tight">{label}</div>
                  <div className="text-[10px] text-slate-400">{desc}</div>
                </button>
              ))}
            </div>

            {orderType === 'Dine In' && (
              <div className="pt-2 flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700">Table Number:</label>
                <input
                  type="text"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  placeholder="e.g. Table 4"
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-32 focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* 2. RECIPIENT & DELIVERY DETAILS */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 leading-tight">
                    2. Customer & Address Information
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Recipient contact details attached to invoice
                  </p>
                </div>
              </div>

              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={openSignupModal}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200"
                >
                  Sign In / Register
                </button>
              )}
            </div>

            {/* Recipient Name & Phone */}
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
                    placeholder="Customer Name"
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

            {/* Address fields (Only required for Food Delivery) */}
            {orderType === 'Delivery' && (
              <div className="space-y-3 pt-1">
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
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
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
                        placeholder="e.g. Velachery"
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Complete Street Address <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Door No, Street Name, Flat / Building"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. ORDERED DISHES IN CURRENT BILL */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>3. Dishes in Bill</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-extrabold">
                  {cart.length} {cart.length === 1 ? 'Dish' : 'Dishes'}
                </span>
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCatalogOpen(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dishes Items */}
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-3">
                <p className="font-semibold text-slate-500">Your bill is currently empty.</p>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Browse Menu & Add Dishes</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-4 group"
                  >
                    {/* Dish Thumbnail & Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'
                        }
                        alt={item.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-xs border border-slate-100"
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
                    <div className="flex items-center gap-3 shrink-0">
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
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BILL BREAKDOWN & INVOICE GENERATOR */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Tax Invoice & Totals
            </h3>

            {/* Bill Rows */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Delivery Partner Fee */}
              <div className="flex justify-between text-slate-600 font-medium items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Delivery / Packaging</span>
                </span>
                <span className="text-emerald-600 font-black">
                  {orderType === 'Delivery' ? 'FREE' : '₹0.00'}
                </span>
              </div>

              {/* GST / Taxes */}
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Restaurant GST & Taxes ({taxRate}%)</span>
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
                    <span>Apply Discount / Coupon</span>
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
                    Total Due
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Inclusive of GST
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Button: Create Bill & Proceed to Payment */}
            <button
              type="button"
              onClick={handleProceedToPay}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                cart.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/25'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-amber-200" />
              <span>CREATE BILL & PAY • ₹{grandTotal.toFixed(2)}</span>
            </button>

            {/* Instant Print Invoice Button */}
            {cart.length > 0 && (
              <button
                type="button"
                onClick={handlePrintSampleInvoice}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Generate Thermal Invoice Preview</span>
              </button>
            )}

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Tax Invoice with GST breakdown & QR payment supported
            </p>
          </div>
        </div>
      </div>

      {/* Global Payment & Order Confirmation Modal */}
      <PaymentModal />
    </div>
  );
}
