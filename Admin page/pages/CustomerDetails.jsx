import React from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, ShoppingBag, IndianRupee } from 'lucide-react';

export default function CustomerDetails({ customer, onClose }) {
  if (!customer) return null;

  const orders = Number(customer.total_orders ?? customer.totalOrders ?? 0);
  const spent = Number(customer.total_spent ?? customer.totalSpent ?? 0);
  const signupDate = customer.created_at ? customer.created_at.split('T')[0] : (customer.createdAt || 'N/A');

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
              <h3 className="text-base font-bold text-slate-900">{customer.name || 'Walk-in Customer'}</h3>
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
                  <Mail size={13} className="mr-2 text-slate-400" />
                  Email:
                </span>
                <span className="font-medium text-slate-800">{customer.email || 'Not provided'}</span>
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
                  Last Order:
                </span>
                <span className="font-medium text-slate-800">{customer.lastOrder || customer.last_order || 'Never'}</span>
              </div>

              {customer.address && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 flex items-center mb-1">
                    <MapPin size={13} className="mr-2 text-slate-400" />
                    Delivery Address:
                  </span>
                  <p className="text-slate-700 font-medium pl-5">{customer.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
