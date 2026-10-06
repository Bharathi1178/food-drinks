import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import {
  QrCode,
  CreditCard,
  CheckCircle2,
  Printer,
  ArrowRight,
  ShieldCheck,
  Receipt,
  MapPin,
  Clock,
  Truck,
  Banknote,
  Building,
  Sparkles,
  Phone,
  Flame,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { usePOS } from '../../context/POSContext';
import { useSettings } from '../../context/SettingsContext';
import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    setPaymentModalOpen,
    cart,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    orderType,
    selectedCustomer,
    deliveryDistrict,
    deliveryArea,
    deliveryAddress,
    deliveryLandmark,
    deliveryBuildingDetails,
    deliveryInstructions,
    deliveryOtherInstructions,
    clearCart,
    setActiveReceipt,
  } = usePOS();

  const { settings } = useSettings();
  const navigate = useNavigate();

  // Online Food Delivery Payment Modes (No Cashier Cash Tendered Calculator!)
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'UPI' | 'Card' | 'NetBanking'
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay'); // 'GPay' | 'PhonePe' | 'Paytm'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (isPaymentModalOpen) {
      setPaymentMethod('COD');
      setIsSuccess(false);
      setCompletedOrder(null);
    }
  }, [isPaymentModalOpen, grandTotal]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const formattedInstructions = deliveryOtherInstructions
        ? `${deliveryInstructions} • Note: ${deliveryOtherInstructions}`
        : deliveryInstructions || 'Leave at door';

      const orderPayload = {
        orderType: 'Delivery',
        customerName: selectedCustomer?.name || 'Online Customer',
        customerPhone: selectedCustomer?.phone || '9876543210',
        deliveryDistrict: deliveryDistrict || '',
        deliveryArea: deliveryArea || '',
        deliveryAddress: deliveryAddress || '',
        deliveryLandmark: deliveryLandmark || '',
        deliveryBuildingDetails: deliveryBuildingDetails || '',
        deliveryInstructions: formattedInstructions,
        location: [deliveryArea, deliveryDistrict].filter(Boolean).join(', ') || deliveryDistrict || deliveryArea || '',
        items: [...cart],
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        grandTotal,
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending (Pay on Delivery)' : 'Paid Online',
        status: 'Preparing',
        estimatedDeliveryTime: '25-30 Mins',
        cashierName: 'Online Delivery App',
        transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      if (paymentMethod !== 'COD') {
        try {
          await paymentApi.processPayment({
            payment_method: paymentMethod,
            amount: grandTotal,
            transaction_id: orderPayload.transactionId,
          });
        } catch (payErr) {
          console.warn('Payment notice:', payErr);
        }
      }

      const saved = await orderApi.createOrder(orderPayload);
      const fullCompletedOrder = {
        ...orderPayload,
        ...(saved || {}),
        items: (saved?.items && saved.items.length > 0) ? saved.items : [...cart],
        id: saved?.id || orderPayload.id || orderPayload.transactionId,
      };
      setCompletedOrder(fullCompletedOrder);
      setIsSuccess(true);
      if (fullCompletedOrder.id) {
        localStorage.setItem('bitepos_last_placed_order_id', fullCompletedOrder.id);
      }

      // Real-time notification across all portals (Employees Kitchen & Admin Director)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: fullCompletedOrder }));
        window.dispatchEvent(new CustomEvent('bitepos_order_status_change', { detail: fullCompletedOrder }));
      }

      // Automatically sync delivery address to customer record
      if (deliveryAddress && (selectedCustomer?.phone || selectedCustomer?.name)) {
        try {
          ['bitepos_customer_database', 'bitepos_customers'].forEach((storageKey) => {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
              const list = JSON.parse(raw);
              const updated = list.map((c) => {
                const matches =
                  (selectedCustomer.id && c.id === selectedCustomer.id) ||
                  (selectedCustomer.phone && c.phone === selectedCustomer.phone) ||
                  (selectedCustomer.name && c.name && c.name.toLowerCase() === selectedCustomer.name.toLowerCase());
                if (matches) {
                  return {
                    ...c,
                    district: deliveryDistrict || c.district,
                    area: deliveryArea || c.area,
                    address: deliveryAddress,
                    deliveryAddress: deliveryAddress,
                    landmark: deliveryLandmark || c.landmark,
                    deliveryLandmark: deliveryLandmark || c.deliveryLandmark,
                    buildingDetails: deliveryBuildingDetails || c.buildingDetails,
                  };
                }
                return c;
              });
              localStorage.setItem(storageKey, JSON.stringify(updated));
            }
          });
        } catch (e) {
          console.warn('Could not sync customer delivery address to storage:', e);
        }
      }

      // Festive celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Order placement error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishAndTrack = () => {
    clearCart();
    setPaymentModalOpen(false);
    if (completedOrder?.id) {
      localStorage.setItem('bitepos_last_placed_order_id', completedOrder.id);
      navigate(`/orders?view=track&orderId=${completedOrder.id}`);
    } else {
      navigate('/orders?view=track');
    }
  };

  const handleFinishAndPrint = () => {
    if (completedOrder) {
      setActiveReceipt(completedOrder);
    }
    clearCart();
    setPaymentModalOpen(false);
  };

  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={() => {
        if (!isProcessing) {
          if (isSuccess) clearCart();
          setPaymentModalOpen(false);
        }
      }}
      title={isSuccess ? '' : 'Confirm Delivery & Pay'}
      size="md"
    >
      {isSuccess && completedOrder ? (
        /* ================= ORDER SUCCESS CONFIRMATION ================= */
        <div className="text-center py-4 space-y-5 animate-scale">
          {/* Success Check Icon */}
          <div className="w-18 h-18 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Placed Successfully!</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Food is Being Prepared
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Order #{completedOrder.id} • Arriving in ~25-30 Mins
            </p>
          </div>

          {/* Delivery Address & Landmark Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-extrabold text-slate-900 block">
                  Delivering to {completedOrder.customerName || selectedCustomer?.name} ({completedOrder.customerPhone || selectedCustomer?.phone}):
                </span>
                {completedOrder.deliveryBuildingDetails && (
                  <p className="text-slate-700 font-bold">
                    {completedOrder.deliveryBuildingDetails}
                  </p>
                )}
                <p className="text-slate-600 font-medium">
                  {completedOrder.deliveryAddress || deliveryAddress}
                </p>
                <p className="text-slate-600 font-semibold">
                  {completedOrder.deliveryArea || deliveryArea}, {completedOrder.deliveryDistrict || deliveryDistrict}
                </p>
                {(completedOrder.deliveryLandmark || deliveryLandmark) && (
                  <p className="text-orange-600 font-bold mt-0.5">
                    Landmark: {completedOrder.deliveryLandmark || deliveryLandmark}
                  </p>
                )}
                {completedOrder.deliveryInstructions && (
                  <p className="text-slate-500 text-[11px] italic mt-0.5">
                    Instructions: &ldquo;{completedOrder.deliveryInstructions}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimated Time: 25-30 Mins</span>
              </span>
              <span className="text-slate-900 font-black">
                Total: ₹{Number(completedOrder.grandTotal).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleFinishAndTrack}
              className="py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Track in My Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleFinishAndPrint}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>View Bill Receipt</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= ONLINE CHECKOUT & PAYMENT SELECTION ================= */
        <div className="space-y-4">
          {/* Delivery Address & Landmark Highlight */}
          <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                  Deliver To: {selectedCustomer?.name || 'Customer'} ({deliveryArea}, {deliveryDistrict})
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-md font-bold flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> 25-30 Mins
                </span>
              </div>
              {deliveryBuildingDetails && (
                <p className="text-xs font-extrabold text-slate-900 truncate">
                  {deliveryBuildingDetails}
                </p>
              )}
              <p className="text-xs font-bold text-slate-800 truncate">
                {deliveryAddress || 'Door Delivery Address'}
              </p>
              {deliveryLandmark && (
                <p className="text-[11px] text-slate-500 truncate">
                  Landmark: <span className="font-semibold text-slate-700">{deliveryLandmark}</span>
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-black transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-orange-50 text-orange-600 border-orange-500 ring-2 ring-orange-500/20 shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5 mb-1 text-orange-500" />
                <span>UPI / QR</span>
              </button>

              {/* Cards */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-black transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-orange-50 text-orange-600 border-orange-500 ring-2 ring-orange-500/20 shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-blue-500" />
                <span>Card</span>
              </button>

              {/* Cash on Delivery (COD) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-black transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-orange-50 text-orange-600 border-orange-500 ring-2 ring-orange-500/20 shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                <span>Pay on Delivery</span>
              </button>
            </div>
          </div>

          {/* Payment Method Details Body */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            {paymentMethod === 'UPI' && (
              <div className="space-y-3 text-center">
                <p className="text-xs font-bold text-slate-700">
                  Scan QR with any UPI App or tap to pay
                </p>
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-slate-200 mx-auto shadow-sm flex items-center justify-center">
                  {/* Dynamic Demo QR Visual */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=bitecraze@upi%26pn=BiteCraze%26am=${grandTotal}%26cu=INR`}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Popular UPI Apps */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                        selectedUpiApp === app
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-700">
                  Debit or Credit Card Details
                </p>
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 8821)"
                  defaultValue="4532 •••• •••• 8821"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="08/29"
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="•••"
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="text-center py-2 space-y-1.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Banknote className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-slate-900">
                  Cash or UPI on Delivery
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  You can pay via Cash or scan the delivery partner's QR code when your food arrives at your door.
                </p>
              </div>
            )}
          </div>

          {/* Bill Summary Row */}
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-extrabold text-slate-500">Total to Pay:</span>
            <span className="text-xl font-black text-slate-900">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePlaceOrder}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Placing Your Order...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>
                  {paymentMethod === 'COD'
                    ? `Place Order • Pay ₹${grandTotal.toFixed(2)} on Delivery`
                    : `Pay ₹${grandTotal.toFixed(2)} & Confirm Order`}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </Modal>
  );
}
