import React, { useState, useMemo } from 'react';
import { Search, Eye, Filter } from 'lucide-react';

export default function EmployeeTable({ employees = [], onViewEmployee }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.phone && emp.phone.includes(q)) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.id && emp.id.toLowerCase().includes(q));

      const matchRole =
        roleFilter === 'all' ||
        (emp.role && emp.role.toLowerCase() === roleFilter.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (emp.status && emp.status.toLowerCase() === statusFilter.toLowerCase());

      return matchSearch && matchRole && matchStatus;
    });
  }, [employees, search, roleFilter, statusFilter]);

  const getRoleBadge = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'cashier':
        return 'bg-blue-100 text-blue-800';
      case 'kitchen staff':
        return 'bg-amber-100 text-amber-800';
      case 'delivery staff':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-slate-200 text-slate-700';
      case 'on leave':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees by name, mobile, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={15} className="text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Roles</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
            <option value="kitchen staff">Kitchen Staff</option>
            <option value="delivery staff">Delivery Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Employee ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joining Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Orders Handled</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-400">
                  No employees found matching filter criteria
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const orders = emp.total_orders_handled ?? emp.totalOrdersHandled ?? 0;
                const joining = emp.joining_date || emp.joiningDate || '2025-01-01';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{emp.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{emp.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{emp.phone}</td>
                    <td className="py-3 px-4 text-slate-500">{emp.email || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${getRoleBadge(emp.role)}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{joining}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-800">{orders}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          emp.availability === 'Available' ? 'bg-emerald-500' : (emp.availability === 'Busy' ? 'bg-amber-500' : 'bg-slate-400')
                        }`} />
                        <span>{emp.availability || 'Available'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewEmployee(emp)}
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
