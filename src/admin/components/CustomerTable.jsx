import React, { useState, useMemo } from 'react';
import { Search, Eye, Edit2, Trash2, MapPin } from 'lucide-react';

export default function CustomerTable({
  customers = [],
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  headerRight,
}) {
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = search.toLowerCase();
      return (
        !search ||
        (cust.name && cust.name.toLowerCase().includes(q)) ||
        (cust.phone && cust.phone.includes(q)) ||
        (cust.location && cust.location.toLowerCase().includes(q)) ||
        (cust.id && cust.id.toLowerCase().includes(q)) ||
        (cust.address && cust.address.toLowerCase().includes(q))
      );
    });
  }, [customers, search]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs relative">
      {/* Search Bar & Actions Filter Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, mobile, location, address, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {headerRight && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {headerRight}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-b-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Delivery Address</th>
              <th className="py-3 px-4">Last Order Date</th>
              <th className="py-3 px-4 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  No customers found matching search criteria
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const lastOrderDate = c.lastOrder || c.last_order || 'Never';
                const addressText = c.address || c.deliveryAddress || '—';
                const locationText =
                  c.location ||
                  (c.area && c.district ? `${c.area}, ${c.district}` : c.area || c.district) ||
                  (c.address && c.address.includes(',') ? c.address.split(',').slice(-2).join(',').trim() : '') ||
                  '—';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{c.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name || 'Customer'}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono font-medium">{c.phone}</td>
                    <td className="py-3 px-4">
                      {locationText !== '—' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200/70">
                          <MapPin size={12} className="text-orange-600 shrink-0" />
                          <span>{locationText}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={addressText}>
                      {addressText !== '—' ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="truncate">{addressText}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{lastOrderDate}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewCustomer && onViewCustomer(c)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => onEditCustomer && onEditCustomer(c)}
                          title="Edit Customer"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteCustomer && onDeleteCustomer(c)}
                          title="Delete Customer"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
