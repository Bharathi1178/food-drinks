import React, { useRef } from 'react';
import Modal from '../common/Modal';
import { Printer, Download, Check, X, Flame } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function ThermalReceipt({ order, onClose }) {
  const { settings } = useSettings();
  const receiptRef = useRef();

  if (!order) return null;

  const shop = settings?.shop || {
    name: 'BiteCraze Fast Food',
    tagline: 'Fresh • Fast • Delicious',
    address: 'Food Street, Perungudi, Chennai',
    phone: '9840198401',
    gstin: '33AAAAA0000A1Z5',
  };
  const invoiceCfg = settings?.invoice || {};
  const is58mm = invoiceCfg.receiptSize === '58mm';

  const handlePrint = () => {
    window.print();
  };

  // Robustly parse items
  const rawItems = order.items || order.order_items || [];
  let parsedItems = [];
  if (Array.isArray(rawItems)) {
    parsedItems = rawItems;
  } else if (typeof rawItems === 'string') {
    try {
      parsedItems = JSON.parse(rawItems);
    } catch {
      parsedItems = [];
    }
  }

  const taxRate = invoiceCfg.taxRate || 5;
  const halfTax = (taxRate / 2).toFixed(1);
  const subtotalVal = Number(order.subtotal || 0);
  const discountVal = Number(order.discount || 0);
  const taxVal = Number(order.tax || 0);
  const grandTotalVal = Number(order.grandTotal ?? order.grand_total ?? order.total ?? (subtotalVal - discountVal + taxVal));
  const cgstAmount = ((taxVal || 0) / 2).toFixed(2);
  const sgstAmount = ((taxVal || 0) / 2).toFixed(2);

  const customerName = order.customerName || order.customer_name || order.customer || 'Customer';
  const customerPhone = order.customerPhone || order.customer_phone || '';
  const orderId = order.id || order.orderId || 'N/A';
  const orderDate = order.date || (order.created_at ? order.created_at.split('T')[0] : new Date().toISOString().split('T')[0]);
  const orderTime = order.time || (order.created_at ? new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
  const deliveryAddr = order.deliveryAddress || order.delivery_address || order.address || '';
  const deliveryLnd = order.deliveryLandmark || order.delivery_landmark || order.landmark || '';

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title="Receipt / Tax Invoice"
      subtitle={`Invoice #${orderId}`}
      maxWidth={is58mm ? 'max-w-xs' : 'max-w-sm'}
    >
      <div className="space-y-4">
        {/* Printable Thermal Receipt Card */}
        <div
          id="thermal-receipt"
          ref={receiptRef}
          className={`bg-white p-5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 shadow-sm mx-auto ${
            is58mm ? 'w-[260px]' : 'w-[320px]'
          }`}
          style={{ letterSpacing: '-0.02em' }}
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-400">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto mb-1 font-black">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider">{shop.name}</h2>
            <p className="text-[10px] text-slate-600 mt-0.5">{shop.tagline}</p>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">{shop.address}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Phone: {shop.phone}</p>
            {shop.gstin && (
              <p className="text-[10px] font-bold text-slate-800 mt-0.5">GSTIN: {shop.gstin}</p>
            )}
          </div>

          {/* Token / Order Identification */}
          <div className="text-center py-2.5 my-2 border-y-2 border-slate-900 bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Token Number</span>
            <span className="text-2xl font-black tracking-widest text-slate-900">
              {order.tokenNo || 'T-01'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mt-0.5">
              {order.orderType || 'Dine In'} {order.tableNo && order.tableNo !== '-' ? `• ${order.tableNo}` : ''}
            </span>
          </div>

          {/* Meta Info */}
          <div className="py-2 space-y-0.5 text-[10px] border-b border-dashed border-slate-400 pb-2">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <span className="font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{orderDate} {orderTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{customerName}</span>
            </div>
            {customerPhone && (
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{customerPhone}</span>
              </div>
            )}
            {deliveryAddr && (
              <div className="pt-1 border-t border-slate-200 mt-1">
                <span className="font-bold block text-slate-800">Delivery Address:</span>
                <span className="block text-slate-700">{deliveryAddr}</span>
                {deliveryLnd && (
                  <span className="text-slate-600 block">Landmark: {deliveryLnd}</span>
                )}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-2 border-b border-dashed border-slate-400">
            <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-slate-200">
              <span className="w-1/2">ITEM</span>
              <span className="w-1/6 text-center">QTY</span>
              <span className="w-1/6 text-right">RATE</span>
              <span className="w-1/6 text-right">TOTAL</span>
            </div>

            <div className="py-1 space-y-1.5 text-[11px]">
              {parsedItems.length === 0 ? (
                <div className="py-2 text-center text-slate-400 italic text-[10px]">
                  No items listed
                </div>
              ) : (
                parsedItems.map((item, idx) => {
                  const name = item.name || item.title || item.product_name || `Item ${idx + 1}`;
                  const qty = parseInt(item.quantity || item.qty || 1, 10) || 1;
                  const price = parseFloat(item.price || item.unit_price || 0) || 0;
                  const total = parseFloat(item.total || price * qty) || 0;

                  return (
                    <div key={idx} className="flex justify-between leading-snug">
                      <span className="w-1/2 font-semibold truncate pr-1">{name}</span>
                      <span className="w-1/6 text-center">{qty}</span>
                      <span className="w-1/6 text-right">₹{price.toFixed(2)}</span>
                      <span className="w-1/6 text-right font-bold">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tax & Grand Total Breakdown */}
          <div className="py-2 space-y-1 text-[11px] border-b border-slate-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotalVal.toFixed(2)}</span>
            </div>

            {discountVal > 0 && (
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Discount:</span>
                <span>- ₹{discountVal.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-[10px] text-slate-600">
              <span>CGST ({halfTax}%):</span>
              <span>₹{cgstAmount}</span>
            </div>

            <div className="flex justify-between text-[10px] text-slate-600">
              <span>SGST ({halfTax}%):</span>
              <span>₹{sgstAmount}</span>
            </div>

            <div className="flex justify-between text-base font-black pt-1.5 border-t border-dashed border-slate-400">
              <span>GRAND TOTAL:</span>
              <span>₹{grandTotalVal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="py-2 space-y-0.5 text-[10px] border-b border-dashed border-slate-400">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{order.paymentMethod || 'ONLINE / COD'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold uppercase text-emerald-800">Confirmed (Online Delivery)</span>
            </div>
            {order.transactionId && (
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Ref / Txn ID:</span>
                <span className="font-mono">{order.transactionId}</span>
              </div>
            )}
          </div>

          {/* Barcode & Footer */}
          <div className="text-center pt-3 space-y-1.5">
            {/* Simulated Barcode */}
            <div className="flex justify-center items-center gap-0.5 h-7 overflow-hidden my-1">
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2].map((w, i) => (
                <span
                  key={i}
                  className="bg-slate-900 h-full inline-block"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest">{order.id}</p>

            <p className="text-[10px] font-bold text-slate-800 pt-1">
              {invoiceCfg.footerMessage || 'Thank you for dining with us!'}
            </p>
            <p className="text-[9px] text-slate-400">Visit again soon!</p>
          </div>
        </div>

        {/* Modal Action Controls (Hidden when printed) */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>

          <button
            type="button"
            id="thermal-print-action-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
