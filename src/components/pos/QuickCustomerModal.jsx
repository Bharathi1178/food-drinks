import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { User, Phone, Mail, MapPin, Search, Plus, Check, UserMinus } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { customerService } from '../../api/services/customerService';
import { customerDB } from '../../api/customerDatabase';

export default function QuickCustomerModal() {
  const {
    isCustomerModalOpen,
    setCustomerModalOpen,
    selectedCustomer,
    setSelectedCustomer,
  } = usePOS();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isCustomerModalOpen) {
      loadCustomers();
      setShowAddForm(false);
      setSearch('');
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
    }
  }, [isCustomerModalOpen]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleSelect = (customer) => {
    setSelectedCustomer({
      name: customer.name,
      phone: customer.phone,
      id: customer.id,
    });
    setCustomerModalOpen(false);
  };

  const handleResetWalkin = () => {
    setSelectedCustomer({
      name: 'Walk-in Customer',
      phone: '9999999999',
    });
    setCustomerModalOpen(false);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('Please provide Customer Name and Mobile Number.');
      return;
    }

    try {
      const created = await customerService.create({
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim(),
        address: newAddress.trim(),
      });

      setSelectedCustomer({
        name: created.name,
        phone: created.phone,
        id: created.id,
      });

      setCustomerModalOpen(false);
    } catch (err) {
      alert('Failed to add customer.');
    }
  };

  return (
    <Modal
      isOpen={isCustomerModalOpen}
      onClose={() => setCustomerModalOpen(false)}
      title="Customer Details"
      subtitle="Link this bill to customer details"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Toggle between Search & Add new */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            {showAddForm ? 'Enter Customer Input' : 'Registered Customers'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetWalkin}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
            >
              <UserMinus className="w-3 h-3" />
              <span>Walk-in</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              {showAddForm ? 'Back to Search' : '+ New Customer'}
            </button>
          </div>
        </div>

        {!showAddForm ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer mobile or name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {filteredCustomers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-600">No customers found</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {search ? `No customer with "${search}".` : 'Your database is currently empty.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (/^\d+$/.test(search)) {
                        setNewPhone(search);
                      } else {
                        setNewName(search);
                      }
                      setShowAddForm(true);
                    }}
                    className="mt-3 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                  >
                    + Register "{search || 'New Customer'}"
                  </button>
                </div>
              ) : (
                filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomer?.phone === cust.phone;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => handleSelect(cust)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-orange-50/80 border-orange-300'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{cust.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{cust.phone}</p>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {cust.totalOrders || 0} orders • ₹{cust.totalSpent || 0}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleCreateCustomer} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Mobile Number *</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-orange-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address / Notes</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Door #, Street or Landmark"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save & Attach to Bill
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
