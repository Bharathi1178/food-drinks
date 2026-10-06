import React, { useState, useMemo } from 'react';
import { Search, Eye, Filter } from 'lucide-react';

export default function CustomerTable({ customers = [], onViewCustomer }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (cust.name && cust.name.toLowerCase().includes(q)) ||
        (cust.phone && cust.phone.includes(q)) ||
        (cust.email && cust.email.toLowerCase().includes(q)) ||
        (cust.id && cust.id.toLowerCase().includes(q));

      const orders = Number(cust.total_orders ?? cust.totalOrders ?? 0);
      let status = 'Regular';
      if (orders >= 5) status = 'VIP';
      else if (orders === 0) status = 'New';

      const matchStatus =
        statusFilter === 'all' ||
        status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, mobile, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={15} className="text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Customer Statuses</option>
            <option value="vip">VIP</option>
            <option value="regular">Regular</option>
            <option value="new">New Customers</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Signup Date</th>
              <th className="py-3 px-4">Last Order</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400">
                  No customers found matching filter criteria
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const orders = Number(c.total_orders ?? c.totalOrders ?? 0);
                const signup = c.created_at ? c.created_at.split('T')[0] : (c.createdAt || 'N/A');
                let badgeClass = 'bg-slate-100 text-slate-700';
                let statusLabel = 'Regular';
                if (orders >= 5) {
                  badgeClass = 'bg-amber-100 text-amber-800 font-semibold';
                  statusLabel = 'VIP';
                } else if (orders === 0) {
                  badgeClass = 'bg-blue-50 text-blue-700';
                  statusLabel = 'New';
                }

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{c.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{c.name || 'Walk-in Customer'}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{c.phone}</td>
                    <td className="py-3 px-4 text-slate-500">{c.email || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{signup}</td>
                    <td className="py-3 px-4 text-slate-600">{c.lastOrder || c.last_order || 'Never'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewCustomer(c)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
