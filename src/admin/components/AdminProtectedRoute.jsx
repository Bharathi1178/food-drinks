import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying Director Authorization...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
