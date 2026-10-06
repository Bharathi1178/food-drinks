import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function LoginPage() {
  const [email, setEmail] = useState('cashier@bitepos.local');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/pos');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const handleDemoFill = (role, demoEmail) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Graphic Ornaments */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-8 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner border border-white/20">
            <Flame className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {settings?.shop?.name || 'BitePOS'}
          </h1>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            Fast Food Shop Billing & POS System
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username / Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cashier@bitepos.local"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[11px] text-orange-600 font-semibold cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('Cashier', 'cashier@bitepos.local')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all text-center"
              >
                Cashier
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('Admin', 'admin@bitepos.local')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('Staff', 'staff@bitepos.local')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all text-center"
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
