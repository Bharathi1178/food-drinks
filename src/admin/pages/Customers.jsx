import React, { useEffect, useState, useMemo } from 'react';
import CustomerTable from '../components/CustomerTable';
import CustomerDetails from './CustomerDetails';
import CustomerEditModal from '../components/CustomerEditModal';
import SignupDateCalendar from '../components/SignupDateCalendar';
import { customerApi } from '../api/customerApi';
import { Users, Trash2, Calendar, X } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSignupFilter, setSelectedSignupFilter] = useState(null); // 'YYYY-MM-DD' or 'YYYY-MM'
  const [signupFilterType, setSignupFilterType] = useState('date'); // 'date' | 'month'

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = (cust) => {
    if (!cust) return;
    setCustomerToDelete(cust);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await customerApi.deleteCustomer(customerToDelete.id, customerToDelete.phone, customerToDelete.name);
      setCustomers((prev) =>
        prev.filter(
          (c) =>
            c.id !== customerToDelete.id &&
            c.phone !== customerToDelete.phone &&
            c.name?.toLowerCase() !== customerToDelete.name?.toLowerCase()
        )
      );
      if (selectedCustomer?.id === customerToDelete.id) {
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error('Failed to delete customer:', err);
    } finally {
      setIsDeleting(false);
      setCustomerToDelete(null);
    }
  };

  const handleSelectDate = (dateStr) => {
    setSelectedSignupFilter(dateStr);
    setSignupFilterType('date');
    setShowCalendar(false);
  };

  const handleSelectMonth = (monthStr) => {
    setSelectedSignupFilter(monthStr);
    setSignupFilterType('month');
    setShowCalendar(false);
  };

  const handleClearSignupFilter = () => {
    setSelectedSignupFilter(null);
    setSignupFilterType('date');
    setShowCalendar(false);
  };

  // Filter customers by selected signup date or month
  const displayedCustomers = useMemo(() => {
    if (!selectedSignupFilter) return customers;
    return customers.filter((c) => {
      const d = c.created_at ? c.created_at.split('T')[0] : (c.createdAt || '');
      if (!d || d === 'N/A') return false;
      if (signupFilterType === 'month') {
        return d.startsWith(selectedSignupFilter);
      }
      return d === selectedSignupFilter;
    });
  }, [customers, selectedSignupFilter, signupFilterType]);

  const handleSaveCustomerEdit = async (updated) => {
    try {
      await customerApi.updateCustomer(updated.id, updated);
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
      if (selectedCustomer?.id === updated.id) {
        setSelectedCustomer({ ...selectedCustomer, ...updated });
      }
    } catch (err) {
      console.error('Failed to update customer:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-slate-500 mt-0.5">Customer Database, Orders Record & Lifetime Spend History</p>
      </div>

      <div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs border border-slate-800"
        >
          <Users className="w-4 h-4 text-white" />
          <span className="text-white">Registered Customer Database</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Loading customer directory...
        </div>
      ) : (
        <CustomerTable
          customers={displayedCustomers}
          onViewCustomer={(cust) => setSelectedCustomer(cust)}
          onEditCustomer={(cust) => setCustomerToEdit(cust)}
          onDeleteCustomer={handleDeleteCustomer}
          headerRight={
            <>
              {/* Calendar filter button directly anchored below beside Total Customers */}
              <div className="relative">
                {selectedSignupFilter ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowCalendar((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-white hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>
                        {signupFilterType === 'month' ? 'Month' : 'Date'}: {selectedSignupFilter}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSignupFilter}
                      className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                      title="Clear signup date filter"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs border border-slate-800 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white">Signup Dates</span>
                  </button>
                )}

                {/* Popup dropdown directly below the button */}
                {showCalendar && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowCalendar(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-84 max-w-[calc(100vw-2rem)]">
                      <SignupDateCalendar
                        customers={customers}
                        selectedFilter={selectedSignupFilter}
                        filterType={signupFilterType}
                        onSelectDate={handleSelectDate}
                        onSelectMonth={handleSelectMonth}
                        onClearFilter={handleClearSignupFilter}
                        onClose={() => setShowCalendar(false)}
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs border border-slate-800"
              >
                <Users className="w-4 h-4 text-white" />
                <span className="text-white">
                  Total Customers: <span className="font-bold text-white">{displayedCustomers.length}</span>
                  {selectedSignupFilter && (
                    <span className="text-slate-400 font-normal ml-1">/ {customers.length}</span>
                  )}
                </span>
              </button>
            </>
          }
        />
      )}

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onDelete={handleDeleteCustomer}
        />
      )}

      {customerToEdit && (
        <CustomerEditModal
          isOpen={!!customerToEdit}
          customer={customerToEdit}
          onClose={() => setCustomerToEdit(null)}
          onSave={handleSaveCustomerEdit}
        />
      )}

      {/* Simple Yes / No Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 size={22} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Customer</h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Are you sure you want to delete <span className="font-bold text-slate-900">{customerToDelete.name || 'this customer'}</span>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                No
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
