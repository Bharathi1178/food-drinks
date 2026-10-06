import React from 'react';
import { X, Briefcase, Phone, Mail, Calendar, Activity, CheckCircle, Clock } from 'lucide-react';

export default function EmployeeDetails({ employee, onClose }) {
  if (!employee) return null;

  const orders = employee.total_orders_handled ?? employee.totalOrdersHandled ?? 0;
  const sales = Number(employee.total_sales_handled ?? employee.totalSalesHandled ?? 0);
  const joining = employee.joining_date || employee.joiningDate || '2025-01-01';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center">
              {employee.name ? employee.name[0] : 'E'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{employee.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{employee.id} • {employee.role}</p>
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500">Orders Handled</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{orders}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500">Sales Handled</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                ₹{sales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Profile & Responsibilities */}
          {employee.profile_info || employee.profileInfo ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Profile & Scope:</span>
              <p className="text-slate-600 leading-relaxed">
                {employee.profile_info || employee.profileInfo}
              </p>
            </div>
          ) : null}

          {/* Details */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center">
                <Phone size={13} className="mr-2 text-slate-400" />
                Mobile:
              </span>
              <span className="font-mono font-medium text-slate-800">{employee.phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center">
                <Mail size={13} className="mr-2 text-slate-400" />
                Email:
              </span>
              <span className="font-medium text-slate-800">{employee.email || '—'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center">
                <Calendar size={13} className="mr-2 text-slate-400" />
                Joining Date:
              </span>
              <span className="font-medium text-slate-800">{joining}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center">
                <CheckCircle size={13} className="mr-2 text-slate-400" />
                Work Status:
              </span>
              <span className="font-semibold text-slate-800">{employee.status}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center">
                <Clock size={13} className="mr-2 text-slate-400" />
                Current Availability:
              </span>
              <span className="font-semibold text-slate-800">{employee.availability || 'Available'}</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
            <span className="font-bold text-amber-900 flex items-center mb-1">
              <Activity size={13} className="mr-1.5 text-amber-700" />
              Recent Activity
            </span>
            <p className="text-amber-800">
              {employee.recent_activity || employee.recentActivity || 'Active on floor schedule'}
            </p>
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
