import React, { useEffect, useState } from 'react';
import CustomerTable from '../components/CustomerTable';
import CustomerDetails from './CustomerDetails';
import { customerApi } from '../api/customerApi';
import { Users, UserPlus } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Registered Customer Database</h2>
          <p className="text-xs text-slate-500">
            Director overview of all signed-up customers, contact details, and account status
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Total Customers: <span className="font-bold text-slate-900">{customers.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Loading customer directory...
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onViewCustomer={(cust) => setSelectedCustomer(cust)}
        />
      )}

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
