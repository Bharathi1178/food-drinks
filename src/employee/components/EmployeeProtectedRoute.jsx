import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';

export default function EmployeeProtectedRoute() {
  const { isAuthenticated } = useEmployeeAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/employee/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
