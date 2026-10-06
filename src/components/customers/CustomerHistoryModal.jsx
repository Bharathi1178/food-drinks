import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import OrderStatusBadge from '../orders/OrderStatusBadge';
import { orderService } from '../../api/services/orderService';
import { ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export default function CustomerHistoryModal({ customer, isOpen, onClose }) {
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setActiveReceipt } = usePOS();

  useEffect(() => {
    if (customer && isOpen) {
      loadHistory();
    }
  }, [customer, isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const all = await orderService.getAll();
      const filtered = all.filter(
        (o) =>
          o.customerPhone === customer.phone ||
          o.customerName?.toLowerCase() === customer.name?.toLowerCase()
      );
      setCustomerOrders(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${customer.name}'s Order History`}
      subtitle={`Mobile: ${customer.phone} • Total Spent: ₹${customer.totalSpent || 0}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading order history...</div>
        ) : customerOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
            <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-1" />
            <p className="text-xs font-bold text-slate-700">No past orders found</p>
            <p className="text-[11px] text-slate-400">Orders placed by this customer will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-300 transition-all text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 font-mono">{ord.id}</span>
                      <OrderStatusBadge status={ord.status} />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {ord.date} {ord.time} • {ord.orderType}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 font-mono">
                      ₹{Number(ord.grandTotal || 0).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      via {ord.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 truncate max-w-[260px]">
                    {ord.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReceipt(ord);
                    }}
                    className="text-[11px] font-bold text-orange-600 hover:underline shrink-0"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
