import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Briefcase, Phone, Mail, Building2, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

const DEPARTMENTS = [
  'Kitchen & Cooking',
  'Billing & Counter',
  'Food Delivery',
  'Store Management',
  'Floor & Table Service',
  'Quality & Cleaning',
];

const ROLES = [
  'Store Manager',
  'Cashier / Billing Staff',
  'Head Chef',
  'Kitchen Assistant / Cook',
  'Delivery Partner',
  'Floor Supervisor',
  'Service Associate',
];

export default function EmployeeModal({ isOpen, onClose, onSave, employeeToEdit = null, existingEmployees = [] }) {
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Kitchen & Cooking');
  const [role, setRole] = useState('Kitchen Assistant / Cook');
  const [joiningDate, setJoiningDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [availability, setAvailability] = useState('Available');
  const [profileInfo, setProfileInfo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setEmpId(employeeToEdit.id || '');
      setName(employeeToEdit.name || '');
      setPhone(employeeToEdit.phone || '');
      setEmail(employeeToEdit.email || '');
      setDepartment(employeeToEdit.department || 'Kitchen & Cooking');
      setRole(employeeToEdit.role || 'Kitchen Assistant / Cook');
      setJoiningDate(employeeToEdit.joining_date || employeeToEdit.joiningDate || new Date().toISOString().split('T')[0]);
      setStatus(employeeToEdit.status || 'Active');
      setAvailability(employeeToEdit.availability || 'Available');
      setProfileInfo(employeeToEdit.profile_info || employeeToEdit.profileInfo || '');
    } else {
      // Auto-suggest next ID based on existing count
      const nextNum = existingEmployees.length + 101;
      setEmpId(`EMP-${nextNum}`);
      setName('');
      setPhone('');
      setEmail('');
      setDepartment('Kitchen & Cooking');
      setRole('Kitchen Assistant / Cook');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setStatus('Active');
      setAvailability('Available');
      setProfileInfo('');
    }
    setErrorMsg('');
  }, [employeeToEdit, isOpen, existingEmployees]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!empId.trim()) {
      setErrorMsg('Please enter an Employee ID (Emp_id)');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter the Employee Name');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!employeeToEdit) {
      const isDuplicate = existingEmployees.some(
        (e) => (e.id || '').toLowerCase() === empId.trim().toLowerCase()
      );
      if (isDuplicate) {
        setErrorMsg(`Employee ID "${empId.trim()}" is already assigned. Please use another ID.`);
        return;
      }
    }

    const payload = {
      id: empId.trim(),
      Emp_id: empId.trim(),
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      department: department.trim(),
      role: role.trim(),
      joiningDate: joiningDate || new Date().toISOString().split('T')[0],
      joining_date: joiningDate || new Date().toISOString().split('T')[0],
      status: status,
      availability: availability,
      profileInfo: profileInfo.trim(),
      profile_info: profileInfo.trim(),
    };

    setSubmitting(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save employee record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {employeeToEdit ? 'Edit Employee Details' : 'Register New Employee'}
              </h3>
              <p className="text-xs text-slate-400">
                {employeeToEdit
                  ? 'Update staff record and operational credentials'
                  : 'Add verified staff member to your business roster'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Emp_id & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emp_id <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                placeholder="EMP-101"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employee Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name (e.g. Ramesh Kumar)"
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Department *</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Role / Designation *</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@bitecraze.com"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Joining Date, Status & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Joining Date</span>
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shift Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="On Break">On Break</option>
                <option value="Off-duty">Off-duty</option>
              </select>
            </div>
          </div>

          {/* Profile Info / Duties */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Responsibilities & Scope Notes
            </label>
            <textarea
              rows={2}
              value={profileInfo}
              onChange={(e) => setProfileInfo(e.target.value)}
              placeholder="e.g. In charge of South Indian gravies, morning prep, and daily closing checklist."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border border-slate-800"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              <span>{submitting ? 'Saving...' : employeeToEdit ? 'Save Changes' : 'Register Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
