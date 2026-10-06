import React, { useState } from 'react';
import {
  Percent,
  Receipt,
  PauseCircle,
  RotateCcw,
  CreditCard,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { useSettings } from '../../context/SettingsContext';

export default function BillSummary() {
  const {
    cart,
    subtotal,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    discountAmount,
    taxRate,
    taxAmount,
    grandTotal,
    clearCart,
    holdCurrentOrder,
    setPaymentModalOpen,
    setActiveReceipt,
    orderType,
    tableNo,
    selectedCustomer,
  } = usePOS();

  const { settings } = useSettings();
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const handleHold = () => {
    if (cart.length === 0) return;
    const success = holdCurrentOrder();
    if (success) {
      alert('Order placed on hold. You can resume it anytime from the Held Orders menu.');
    }
  };

  const handlePrintDraft = () => {
    if (cart.length === 0) return;
    // Generate draft receipt for preview
    setActiveReceipt({
      id: 'DRAFT-' + Date.now().toString().slice(-4),
      tokenNo: 'DRAFT',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerPhone: selectedCustomer?.phone || '-',
      orderType,
      tableNo,
      items: cart,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      grandTotal,
      paymentMethod: 'Pending',
      cashierName: 'Active Cashier',
      isDraft: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3.5">
      {/* Discount Bar */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDiscountInput(!showDiscountInput)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 transition-colors"
          >
            <Percent className="w-3.5 h-3.5 text-orange-500" />
            <span>Apply Discount</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showDiscountInput ? 'rotate-180' : ''}`} />
          </button>
          {discountAmount > 0 && (
            <span className="text-xs font-bold text-emerald-600">
              - ₹{discountAmount.toFixed(2)}
            </span>
          )}
        </div>

        {showDiscountInput && (
          <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-300 bg-white overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`px-2.5 py-1 font-semibold ${
                  discountType === 'percentage'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`px-2.5 py-1 font-semibold ${
                  discountType === 'fixed'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ₹
              </button>
            </div>

            <input
              type="number"
              min="0"
              max={discountType === 'percentage' ? 100 : subtotal}
              value={discountValue || ''}
              placeholder="0"
              onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs text-right font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />

            {/* Quick discount presets */}
            <div className="flex items-center gap-1">
              {[5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setDiscountType('percentage');
                    setDiscountValue(pct);
                  }}
                  className="px-2 py-1 bg-white hover:bg-orange-50 border border-slate-200 text-slate-600 hover:text-orange-600 rounded-md text-[10px] font-semibold"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Numerical Breakdown */}
      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Flat'})</span>
            <span className="font-semibold">- ₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-500">
          <span className="flex items-center gap-1">
            <span>GST ({taxRate}%)</span>
            <span className="text-[10px] text-slate-400">
              (CGST {(taxRate / 2).toFixed(1)}% + SGST {(taxRate / 2).toFixed(1)}%)
            </span>
          </span>
          <span className="font-semibold text-slate-800">₹{taxAmount.toFixed(2)}</span>
        </div>

        {/* Grand Total */}
        <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
          <div>
            <span className="text-sm font-extrabold text-slate-900 block">Grand Total</span>
            <span className="text-[10px] text-slate-400">Inclusive of all taxes</span>
          </div>
          <span className="text-2xl font-black text-orange-600 font-mono">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Auxiliary Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          type="button"
          disabled={cart.length === 0}
          onClick={handleHold}
          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Hold</span>
        </button>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={() => {
            if (confirm('Clear all items from current cart?')) clearCart();
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={handlePrintDraft}
          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print</span>
        </button>
      </div>

      {/* Primary Pay Now Button */}
      <button
        type="button"
        id="pos-pay-now-btn"
        disabled={cart.length === 0}
        onClick={() => setPaymentModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-150"
      >
        <CreditCard className="w-4 h-4" />
        <span>PAY NOW • ₹{grandTotal.toFixed(2)}</span>
      </button>
    </div>
  );
}
