import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import employeeAuthApi from '../api/employeeAuthApi';
import {
  Flame,
  User,
  Mail,
  BadgeCheck,
  AlertCircle,
  LogIn,
  ShieldCheck,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

export default function EmployeeLogin() {
  const { login, isAuthenticated } = useEmployeeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sampleEmployees, setSampleEmployees] = useState([]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const dest = location.state?.from?.pathname || '/employee/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Load registered employees for easy 1-click test fill
  useEffect(() => {
    employeeAuthApi
      .getRegisteredEmployees()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSampleEmployees(data.filter((e) => (e.status || '').toLowerCase() === 'active'));
        }
      })
      .catch(() => {});
  }, []);

  const handleFillSample = (emp) => {
    setEmployeeId(emp.id || '');
    setName(emp.name || '');
    setEmail(emp.email || '');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!employeeId.trim() || !name.trim() || !email.trim()) {
      setErrorMsg('Please enter your Employee ID, Name, and Email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({
        employeeId: employeeId.trim(),
        name: name.trim(),
        email: email.trim(),
      });

      if (res.success) {
        navigate('/employee/dashboard', { replace: true });
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please verify with Admin.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D17] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background ambient lighting like Image 2 */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-lg shadow-orange-500/30 mb-2">
            <Flame className="w-8 h-8 fill-slate-950" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bite<span className="text-orange-500">Craze</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider shadow-inner">
              Employee Portal
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto font-medium">
            Operational sign-in for Kitchen Staff, Order Handlers, and Packing Specialists
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Employee ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Employee ID <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP001 or EMP-101"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* 2. Employee Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Employee Name <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* 3. Employee Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Employee Email <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arun@bitecraze.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <span>Validating with Restaurant Backend...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In to Employee Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Select Helpers for Registered Employees */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Registered Active Employees (Click to Test):</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleFillSample({
                    id: 'EMP001',
                    name: 'Arun Kumar',
                    email: 'arun@bitecraze.com',
                  })
                }
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Arun Kumar
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-orange-500/20 px-1.5 py-0.2 rounded border border-orange-500/30">
                      EMP001
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">arun@bitecraze.com • Kitchen Staff</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFillSample({
                    id: 'EMP-101',
                    name: 'Raguram S',
                    email: 'raguram@bitecraze.com',
                  })
                }
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Raguram S
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-orange-500/20 px-1.5 py-0.2 rounded border border-orange-500/30">
                      EMP-101
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">raguram@bitecraze.com • Director / Store Manager</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Back to Customer or Admin */}
        <div className="text-center text-xs text-slate-500 space-x-4">
          <Link to="/menu" className="hover:text-amber-400 font-medium transition-colors">
            ← Customer Menu
          </Link>
          <span>•</span>
          <Link to="/admin/login" className="hover:text-amber-400 font-medium transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
