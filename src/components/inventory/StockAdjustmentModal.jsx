import React, { useState } from 'react';
import Modal from '../common/Modal';

export default function StockAdjustmentModal({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  initialProductId = null,
}) {
  const [selectedProductId, setSelectedProductId] = useState(
    initialProductId || products[0]?.id || ''
  );
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const [newStock, setNewStock] = useState(selectedProduct?.stock ?? '');
  const [reason, setReason] = useState('Physical Stock Recount Correction');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId || newStock === '' || Number(newStock) < 0) {
      alert('Please enter valid stock number.');
      return;
    }

    onSubmit({
      productId: selectedProductId,
      newStock: Number(newStock),
      reason,
    });
  };

  const diff = selectedProduct ? Number(newStock) - selectedProduct.stock : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inventory Stock Adjustment"
      subtitle="Correct quantities due to wastage, damage, or recount"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Product *</label>
          <select
            value={selectedProductId}
            onChange={(e) => {
              const pid = e.target.value;
              setSelectedProductId(pid);
              const found = products.find((p) => p.id === pid);
              if (found) setNewStock(found.stock);
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Current: {p.stock})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600">
            <span>Recorded Stock in System:</span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">
              {selectedProduct.stock} units
            </span>
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1">Actual / New Physical Stock *</label>
          <input
            type="number"
            min="0"
            required
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="Enter actual physical count"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Adjustment Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="Physical Stock Recount Correction">Physical Stock Recount Correction</option>
            <option value="Damaged / Broken / Spill">Damaged / Broken / Spill</option>
            <option value="Expired / Food Spoilage">Expired / Food Spoilage</option>
            <option value="Kitchen Consumption / Testing">Kitchen Consumption / Testing</option>
            <option value="Customer Return">Customer Return</option>
          </select>
        </div>

        {selectedProduct && newStock !== '' && (
          <div
            className={`p-2.5 rounded-xl border text-xs font-semibold ${
              diff < 0
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : diff > 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            Adjustment variance: {diff > 0 ? `+${diff}` : diff} units
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
          >
            Save Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
}
