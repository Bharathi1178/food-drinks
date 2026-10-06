import React from 'react';
import Modal from '../common/Modal';
import OrderStatusBadge from './OrderStatusBadge';
import { Printer, Calendar, Clock, User, Phone, MapPin, Hash, CreditCard } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export default function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }) {
  const { setActiveReceipt } = usePOS();
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.id}`}
      subtitle={`Token: ${order.tokenNo} • Placed on ${order.date} at ${order.time}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Status & Type Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Status:</span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Update:</span>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Customer & Order Metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Details</span>
            <p className="font-bold text-slate-800 mt-0.5">{order.customerName}</p>
            {order.customerPhone && (
              <p className="text-slate-500 text-[11px]">{order.customerPhone}</p>
            )}
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Details</span>
            <p className="font-bold text-slate-800 mt-0.5">
              {order.orderType} {order.tableNo && order.tableNo !== '-' ? `(${order.tableNo})` : ''}
            </p>
            <p className="text-slate-500 text-[11px]">Payment: {order.paymentMethod}</p>
          </div>
        </div>

        {/* Line Items List */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">Order Items</span>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-[11px] text-slate-400">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-extrabold text-slate-900 font-mono">
                  ₹{(item.total || item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold">₹{Number(order.subtotal || 0).toFixed(2)}</span>
          </div>
          {Number(order.discount || 0) > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>- ₹{Number(order.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>GST / Tax</span>
            <span className="font-semibold">₹{Number(order.tax || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-1.5">
            <span>Grand Total</span>
            <span className="text-orange-600 font-mono">
              ₹{Number(order.grandTotal || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveReceipt(order);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
