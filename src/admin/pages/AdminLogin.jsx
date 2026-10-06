import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, authError } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoDirectorLogin = async () => {
    setEmail('director@bitecraze.com');
    setPassword('Admin@1234');
    const res = await login({ email: 'director@bitecraze.com', password: 'Admin@1234' });
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <ShieldCheck size={32} />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Director & Admin Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Authorized business directors and senior management only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {authError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Director Email / Username
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="director@bitecraze.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-hidden focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-hidden focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Director'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoDirectorLogin}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-medium border border-amber-500/20 transition-all"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>One-Click Director Demo Access</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-500">
            Customer ordering? Access customer menu at{' '}
            <a href="/menu" className="text-amber-400 hover:underline">/menu</a>
          </p>
        </div>
      </div>
    </div>
  );
}
