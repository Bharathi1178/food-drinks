import React from 'react';
import {
  ShoppingBag,
  Utensils,
  ShoppingBasket,
  Truck,
  UserPlus,
  User,
  Hash,
} from 'lucide-react';
import CartItem from './CartItem';
import BillSummary from './BillSummary';
import { usePOS } from '../../context/POSContext';

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    orderType,
    setOrderType,
    tableNo,
    setTableNo,
    selectedCustomer,
    setCustomerModalOpen,
  } = usePOS();

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const orderTypes = [
    { id: 'Dine In', icon: Utensils, label: 'Dine In' },
    { id: 'Takeaway', icon: ShoppingBasket, label: 'Takeaway' },
    { id: 'Delivery', icon: Truck, label: 'Delivery' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/70 rounded-2xl border border-slate-200/80 p-3 lg:p-4">
      {/* Top Controls: Order Type Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl mb-3">
        {orderTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = orderType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setOrderType(type.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Customer & Table details bar */}
      <div className="flex items-center gap-2 mb-3">
        {/* Customer Select / Quick Add */}
        <button
          type="button"
          onClick={() => setCustomerModalOpen(true)}
          className={`flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl text-left border transition-all shadow-2xs ${
            selectedCustomer?.phone && selectedCustomer.phone !== '9999999999'
              ? 'bg-orange-50/80 border-orange-300'
              : 'bg-white hover:border-orange-300 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <User className={`w-3.5 h-3.5 shrink-0 ${
              selectedCustomer?.phone && selectedCustomer.phone !== '9999999999'
                ? 'text-orange-600'
                : 'text-slate-400'
            }`} />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                {selectedCustomer?.name || 'Walk-in Customer'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {selectedCustomer?.phone && selectedCustomer.phone !== '9999999999'
                  ? selectedCustomer.phone
                  : 'Click to enter customer info'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-orange-600 hover:underline shrink-0 ml-1">
            {selectedCustomer?.phone && selectedCustomer.phone !== '9999999999' ? 'Edit' : '+ Add'}
          </span>
        </button>

        {/* Table or Token No */}
        {orderType === 'Dine In' ? (
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs w-28">
            <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              placeholder="Table #"
              className="w-full text-xs font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-slate-500 text-xs font-bold w-28 text-center justify-center">
            <span>{orderType === 'Takeaway' ? 'Parcel' : 'Direct'}</span>
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-3 min-h-[160px] max-h-[calc(100vh-420px)]">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-white border border-dashed border-slate-200 flex items-center justify-center mb-2 shadow-2xs">
              <ShoppingBag className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-600">Cart is empty</p>
            <p className="text-[11px] text-slate-400 max-w-[180px] mt-0.5">
              Select items from the menu to start billing.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))
        )}
      </div>

      {/* Bill Summary & Actions */}
      <BillSummary />
    </div>
  );
}
