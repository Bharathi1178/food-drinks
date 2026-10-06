import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  customer = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Name and Mobile Number are required.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Edit Customer' : 'Add New Customer'}
      subtitle="Customer profile and loyalty tracking"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Patel"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="10-digit mobile number"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Email (Optional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ramesh@example.com"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Address / Landmark</label>
          <textarea
            rows="2"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Delivery address or locality..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
          >
            {customer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
