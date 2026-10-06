import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all">
      {/* Product Image Thumbnail */}
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80';
        }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
          {item.name}
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          ₹{item.price} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center font-bold text-xs text-slate-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Item Total & Delete */}
      <div className="flex flex-col items-end justify-between h-full py-0.5">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-extrabold text-slate-900 mt-2">
          ₹{item.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
