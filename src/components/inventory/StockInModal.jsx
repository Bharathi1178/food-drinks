import React, { useState } from 'react';
import Modal from '../common/Modal';

export default function StockInModal({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  initialProductId = null,
}) {
  const [selectedProductId, setSelectedProductId] = useState(
    initialProductId || products[0]?.id || ''
  );
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('Supplier Replenishment');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId || !quantity || Number(quantity) <= 0) {
      alert('Please enter valid product and quantity.');
      return;
    }

    onSubmit({
      productId: selectedProductId,
      quantity: Number(quantity),
      reason,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock In / Restock Products"
      subtitle="Receive fresh inventory batch"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Product *</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
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
            <span>Current Stock in Store:</span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">
              {selectedProduct.stock} units
            </span>
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1">Quantity to Add *</label>
          <input
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 50"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Reason / Supplier Note</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Vendor delivery invoice #8812"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {selectedProduct && quantity && Number(quantity) > 0 && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
            New Stock will become: {selectedProduct.stock + Number(quantity)} units
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
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
          >
            Add to Stock
          </button>
        </div>
      </form>
    </Modal>
  );
}
