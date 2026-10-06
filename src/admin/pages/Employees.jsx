import React, { useEffect, useState } from 'react';
import { UserPlus, Users, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import EmployeeDetails from './EmployeeDetails';
import { employeeApi } from '../api/employeeApi';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleOpenRegisterModal = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEmployeeToEdit(emp);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (emp) => {
    if (!emp) return;
    setEmployeeToDelete(emp);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    try {
      await employeeApi.deleteEmployee(employeeToDelete.id);
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
      showToast(`Employee "${employeeToDelete.name}" (${employeeToDelete.id}) removed successfully`);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error('Failed to delete employee:', err);
      showToast(`Failed to delete employee: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEmployee = async (payload) => {
    if (employeeToEdit) {
      const updated = await employeeApi.updateEmployee(employeeToEdit.id, payload);
      setEmployees((prev) =>
        prev.map((e) => (e.id === employeeToEdit.id ? { ...e, ...updated } : e))
      );
      showToast(`Employee "${payload.name}" updated successfully`);
    } else {
      const created = await employeeApi.createEmployee(payload);
      setEmployees((prev) => [created, ...prev.filter((e) => e.id !== created.id)]);
      showToast(`Employee "${payload.name}" (${payload.id}) registered successfully`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              Admin & Director Control
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Store Staff & Personnel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register and manage your team: Emp_id, Employee Name, Department, and shift availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs border border-slate-800">
            <Users className="w-3.5 h-3.5 text-white" />
            <span className="text-white">Staff: <strong className="text-white">{employees.length}</strong></span>
          </div>

          <button
            onClick={handleOpenRegisterModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs border border-slate-800 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span className="text-white">Register New Employee</span>
          </button>
        </div>
      </div>

      {/* Table / Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading employee records...
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onViewEmployee={(emp) => setSelectedEmployee(emp)}
          onEditEmployee={handleOpenEditModal}
          onDeleteEmployee={handleDeleteEmployee}
          onRegisterClick={handleOpenRegisterModal}
        />
      )}

      {/* Register / Edit Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
        existingEmployees={employees}
      />

      {/* View Details Drawer/Modal */}
      {selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Simple Yes / No Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 size={22} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Employee</h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Are you sure you want to delete <span className="font-bold text-slate-900">{employeeToDelete.name || 'this employee'}</span> ({employeeToDelete.id})?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEmployeeToDelete(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
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
