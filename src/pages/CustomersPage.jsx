import React, { useState, useEffect, useMemo, useRef } from 'react';
import { customerService } from '../api/services/customerService';
import { customerDB } from '../api/customerDatabase';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import CustomerHistoryModal from '../components/customers/CustomerHistoryModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  History,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Download,
  Upload,
  Database,
  DollarSign,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef(null);

  // Modals state
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getAll();
      setCustomers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingCustomer) {
        const updated = await customerService.update(editingCustomer.id, formData);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? updated : c))
        );
      } else {
        const created = await customerService.create(formData);
        setCustomers((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
      }
      setFormOpen(false);
      setEditingCustomer(null);
    } catch (e) {
      alert('Failed to save customer');
    }
  };

  const handleDelete = async () => {
    if (!deletingCustomer) return;
    try {
      await customerService.delete(deletingCustomer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      setDeletingCustomer(null);
    } catch (e) {
      alert('Failed to delete customer');
    }
  };

  const handleExportCSV = () => {
    customerDB.exportCSV();
  };

  const handleExportJSON = () => {
    customerDB.exportJSON();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = customerDB.importJSON(content);
      if (res.success) {
        alert(`Successfully imported ${res.count} customers into database!`);
        loadCustomers();
      } else {
        alert(`Import failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalSpentByCustomers = customers.reduce(
    (sum, c) => sum + (Number(c.totalSpent) || 0),
    0
  );
  const totalCustomerOrders = customers.reduce(
    (sum, c) => sum + (Number(c.totalOrders) || 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            <span>Customer Database</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store and manage customer input details, track purchase frequency, and loyalty totals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Database button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={customers.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-colors disabled:opacity-40"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Import JSON button */}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-colors"
            title="Restore from JSON backup"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Import</span>
          </button>

          {/* Add New Customer */}
          <button
            type="button"
            onClick={() => {
              setEditingCustomer(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Registered Customers</span>
          <p className="text-2xl font-black text-slate-900 font-mono">{customers.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">In custom database</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Customer Sales</span>
          <p className="text-2xl font-black text-emerald-600 font-mono">₹{totalSpentByCustomers.toFixed(2)}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Lifetime value</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Customer Orders</span>
          <p className="text-2xl font-black text-slate-800 font-mono">{totalCustomerOrders}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Billed transactions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Average Ticket</span>
          <p className="text-2xl font-black text-orange-600 font-mono">
            ₹{customers.length > 0 ? (totalSpentByCustomers / (totalCustomerOrders || 1)).toFixed(0) : '0'}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Per customer order</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by customer name, mobile number, or email..."
          className="flex-1"
        />
        <span className="text-xs font-bold text-slate-500 hidden sm:block">
          Found: {filteredCustomers.length} record(s)
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading customer records..." />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Customer database is empty"
            description="When customers give their mobile number and name at the counter, or when you add them here, they will be stored in your database."
            action={
              <button
                type="button"
                onClick={() => {
                  setEditingCustomer(null);
                  setFormOpen(true);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700"
              >
                + Add First Customer
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Mobile Number</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Address / Notes</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spending</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{cust.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {cust.phone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{cust.email || '-'}</td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-500">
                      {cust.address || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800">
                        {cust.totalOrders || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                      ₹{Number(cust.totalSpent || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {cust.lastOrder || 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setHistoryCustomer(cust)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View Order History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomer(cust);
                            setFormOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCustomer(cust)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleCreateOrUpdate}
        customer={editingCustomer}
      />

      {/* Customer History Modal */}
      {historyCustomer && (
        <CustomerHistoryModal
          customer={historyCustomer}
          isOpen={!!historyCustomer}
          onClose={() => setHistoryCustomer(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleDelete}
        title="Delete Customer?"
        message={`Delete record for "${deletingCustomer?.name}" (${deletingCustomer?.phone})?`}
      />
    </div>
  );
}
