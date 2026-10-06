import React, { useEffect, useState } from 'react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeDetails from './EmployeeDetails';
import { employeeApi } from '../api/employeeApi';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeApi.getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Store Staff & Personnel</h2>
          <p className="text-xs text-slate-500">
            Director view of active staff, operational roles, orders handled, and current floor availability
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Staff Members: <span className="font-bold text-slate-900">{employees.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Loading employees list...
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onViewEmployee={(emp) => setSelectedEmployee(emp)}
        />
      )}

      {selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
