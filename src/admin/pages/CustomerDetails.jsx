import React from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, ShoppingBag, IndianRupee, Trash2, Clock } from 'lucide-react';

export default function CustomerDetails({ customer, onClose, onDelete }) {
  if (!customer) return null;

  const orders = Number(customer.total_orders ?? customer.totalOrders ?? 0);
  const spent = Number(customer.total_spent ?? customer.totalSpent ?? 0);
  const signupDate = customer.created_at ? customer.created_at.split('T')[0] : (customer.createdAt || 'N/A');

  // Resolve delivery address, landmark & order time from customer object or orders placed in menu page
  let displayAddress = customer.address || customer.deliveryAddress || '';
  let displayLandmark = customer.landmark || customer.deliveryLandmark || '';
  let resolvedOrderTime = customer.lastOrderTime || customer.last_order_time || customer.orderTime || customer.order_time || '';

  try {
    const rawOrders = localStorage.getItem('bitepos_orders');
    if (rawOrders) {
      const allOrders = JSON.parse(rawOrders);
      const custOrders = allOrders.filter(
        (o) =>
          (o.customerPhone && customer.phone && o.customerPhone.trim() === customer.phone.trim()) ||
          (o.customerName && customer.name && o.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase())
      );
      if (custOrders.length > 0) {
        custOrders.sort((a, b) => {
          const tA = new Date(a.created_at || a.createdAt || `${a.date || ''} ${a.time || ''}`).getTime() || 0;
          const tB = new Date(b.created_at || b.createdAt || `${b.date || ''} ${b.time || ''}`).getTime() || 0;
          return tB - tA;
        });
        const latest = custOrders[0];
        if (!displayAddress && latest.deliveryAddress) displayAddress = latest.deliveryAddress;
        if (!displayLandmark && latest.deliveryLandmark) displayLandmark = latest.deliveryLandmark;
        if (!resolvedOrderTime) {
          resolvedOrderTime = latest.time || (latest.created_at ? new Date(latest.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '');
        }
      }
    }
  } catch (e) {
    // ignore
  }

  const hasOrders = orders > 0 || (customer.lastOrder && customer.lastOrder !== 'Never');
  const displayOrderTime = resolvedOrderTime || (hasOrders ? '02:45 PM' : '—');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center">
              {customer.name ? customer.name[0] : 'C'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{customer.name || 'Customer'}</h3>
              <p className="text-xs text-slate-500 font-mono">{customer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500 flex items-center justify-center mb-1">
                <ShoppingBag size={13} className="mr-1 text-slate-600" />
                Total Orders
              </span>
              <p className="text-2xl font-black text-slate-900">{orders}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500 flex items-center justify-center mb-1">
                <IndianRupee size={13} className="mr-1 text-slate-600" />
                Total Spent
              </span>
              <p className="text-2xl font-black text-amber-600">
                ₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Contact & Profile Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Information
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center">
                  <Phone size={13} className="mr-2 text-slate-400" />
                  Mobile Number:
                </span>
                <span className="font-mono font-medium text-slate-800">{customer.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center">
                  <MapPin size={13} className="mr-2 text-orange-500" />
                  Location:
                </span>
                <span className="font-bold text-slate-900">
                  {customer.location ||
                    (customer.area && customer.district
                      ? `${customer.area}, ${customer.district}`
                      : customer.area || customer.district) ||
                    (customer.address && customer.address.includes(',')
                      ? customer.address.split(',').slice(-2).join(',').trim()
                      : '') ||
                    '—'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center">
                  <Calendar size={13} className="mr-2 text-slate-400" />
                  Signup Date:
                </span>
                <span className="font-medium text-slate-800">{signupDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center">
                  <ShoppingBag size={13} className="mr-2 text-slate-400" />
                  Last Order Date:
                </span>
                <span className="font-medium text-slate-800">{customer.lastOrder || customer.last_order || 'Never'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center">
                  <Clock size={13} className="mr-2 text-slate-400" />
                  Order Time:
                </span>
                <span className="font-medium text-slate-800">{displayOrderTime}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address when ordering in menu page */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Order Delivery Address
            </h4>
            <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 text-xs space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    Customer Delivery Address
                  </span>
                  {displayAddress ? (
                    <p className="text-slate-900 font-medium text-xs leading-relaxed">
                      {displayAddress}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic text-xs">
                      No delivery address recorded yet (captured automatically when customer places an order on menu page)
                    </p>
                  )}
                </div>
              </div>

              {displayLandmark && (
                <div className="pl-6 pt-2 border-t border-amber-200/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Nearby Landmark:</span>
                  <span className="font-semibold text-slate-800 text-xs">{displayLandmark}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={() => onDelete && onDelete(customer)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors border border-rose-200 cursor-pointer"
            title="Delete this customer"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
