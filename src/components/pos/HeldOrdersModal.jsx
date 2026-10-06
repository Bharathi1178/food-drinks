import React from 'react';
import Modal from '../common/Modal';
import { Clock, Play, Trash2, ShoppingBag } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export default function HeldOrdersModal() {
  const {
    isHeldOrdersModalOpen,
    setHeldOrdersModalOpen,
    heldOrders,
    resumeOrder,
    deleteHeldOrder,
    cart,
  } = usePOS();

  return (
    <Modal
      isOpen={isHeldOrdersModalOpen}
      onClose={() => setHeldOrdersModalOpen(false)}
      title="Held Orders Queue"
      subtitle={`${heldOrders.length} order(s) parked on hold`}
      maxWidth="max-w-lg"
    >
      {heldOrders.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No Orders On Hold</p>
          <p className="text-[11px] text-slate-400 mt-1">
            When a customer pauses their billing, click "Hold" on the bill summary to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {heldOrders.map((held) => (
            <div
              key={held.id}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-amber-300 transition-all flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {held.orderType}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {held.customer?.name || 'Walk-in'}
                    </span>
                    {held.tableNo && held.tableNo !== '-' && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        ({held.tableNo})
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Parked at {held.timestamp}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    ₹{held.grandTotal.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {held.cart?.length || 0} items
                  </span>
                </div>
              </div>

              {/* Items summary list */}
              <div className="text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-100 line-clamp-2">
                {held.cart?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => deleteHeldOrder(held.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Discard held order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (cart.length > 0) {
                      if (!confirm('Active cart has items. Replace with this held order?')) {
                        return;
                      }
                    }
                    resumeOrder(held);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
