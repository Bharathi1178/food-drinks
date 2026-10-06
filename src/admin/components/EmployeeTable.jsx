import React, { useState, useMemo } from 'react';
import { Search, Eye, Filter, Edit2, Trash2, Building2, UserPlus, AlertCircle } from 'lucide-react';

export default function EmployeeTable({
  employees = [],
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onRegisterClick,
}) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Extract unique departments and roles for filters
  const departments = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set);
  }, [employees]);

  const roles = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => {
      if (e.role) set.add(e.role);
    });
    return Array.from(set);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.phone && emp.phone.includes(q)) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.id && emp.id.toLowerCase().includes(q)) ||
        (emp.department && emp.department.toLowerCase().includes(q)) ||
        (emp.role && emp.role.toLowerCase().includes(q));

      const matchDept =
        deptFilter === 'all' ||
        (emp.department && emp.department.toLowerCase() === deptFilter.toLowerCase());

      const matchRole =
        roleFilter === 'all' ||
        (emp.role && emp.role.toLowerCase() === roleFilter.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (emp.status && emp.status.toLowerCase() === statusFilter.toLowerCase());

      return matchSearch && matchDept && matchRole && matchStatus;
    });
  }, [employees, search, deptFilter, roleFilter, statusFilter]);

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'inactive':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'on leave':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getDeptBadge = (dept) => {
    switch ((dept || '').toLowerCase()) {
      case 'kitchen & cooking':
      case 'kitchen':
        return 'bg-amber-50 text-amber-900 border border-amber-200';
      case 'billing & counter':
      case 'cashier':
        return 'bg-blue-50 text-blue-900 border border-blue-200';
      case 'food delivery':
      case 'delivery':
        return 'bg-emerald-50 text-emerald-900 border border-emerald-200';
      case 'store management':
      case 'management':
        return 'bg-purple-50 text-purple-900 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/60">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Emp_id, Name, Department, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={15} className="text-slate-400" />

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-bold bg-slate-900 text-white border border-slate-800 rounded-xl px-3.5 py-2 focus:outline-hidden cursor-pointer shadow-xs"
          >
            <option value="all" className="bg-slate-900 text-white">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-white">
                {d}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-bold bg-slate-900 text-white border border-slate-800 rounded-xl px-3.5 py-2 focus:outline-hidden cursor-pointer shadow-xs"
          >
            <option value="all" className="bg-slate-900 text-white">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r} className="bg-slate-900 text-white">
                {r}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-900 text-white border border-slate-800 rounded-xl px-3.5 py-2 focus:outline-hidden cursor-pointer shadow-xs"
          >
            <option value="all" className="bg-slate-900 text-white">All Statuses</option>
            <option value="active" className="bg-slate-900 text-white">Active</option>
            <option value="inactive" className="bg-slate-900 text-white">Inactive</option>
            <option value="on leave" className="bg-slate-900 text-white">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-black">Emp_id</th>
              <th className="py-3 px-4 font-black">Employee Name</th>
              <th className="py-3 px-4 font-black">Department</th>
              <th className="py-3 px-4 font-black">Role / Designation</th>
              <th className="py-3 px-4 font-black">Mobile</th>
              <th className="py-3 px-4 font-black">Joining Date</th>
              <th className="py-3 px-4 text-center font-black">Status</th>
              <th className="py-3 px-4 font-black">Availability</th>
              <th className="py-3 px-4 text-center font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {employees.length === 0
                        ? 'No staff members registered yet.'
                        : 'No employees found matching filter criteria.'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {employees.length === 0
                        ? 'Click the Register New Employee button above to add your team.'
                        : 'Try adjusting your search terms or filters.'}
                    </p>
                    {employees.length === 0 && onRegisterClick && (
                      <button
                        onClick={onRegisterClick}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-amber-400 font-black rounded-xl text-xs shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Register First Employee</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const joining = emp.joining_date || emp.joiningDate || '—';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-800">{emp.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{emp.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${getDeptBadge(emp.department)}`}>
                        <Building2 className="w-3 h-3 opacity-60" />
                        <span>{emp.department || 'General'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{emp.role}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono font-medium">{emp.phone}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{joining}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            emp.availability === 'Available'
                              ? 'bg-emerald-500'
                              : emp.availability === 'Busy'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-semibold">{emp.availability || 'Available'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewEmployee && onViewEmployee(emp)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => onEditEmployee && onEditEmployee(emp)}
                          title="Edit Employee"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee && onDeleteEmployee(emp)}
                          title="Delete Employee"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
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
