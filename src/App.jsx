import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { POSProvider } from './context/POSContext';
import AppLayout from './components/layout/AppLayout';
import CustomerAuthModal from './components/auth/CustomerAuthModal';

// Customer-Facing Store Pages
import MenuPage from './pages/MenuPage';
import BillingPage from './pages/BillingPage';
import OrdersPage from './pages/OrdersPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import POSPage from './pages/POSPage';

// Dedicated Business Director / Owner Admin Portal
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import Customers from './admin/pages/Customers';
import Employees from './admin/pages/Employees';
import Reports from './admin/pages/Reports';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';

// Dedicated Employee Portal (Kitchen Operations & Order Preparation)
import { EmployeeAuthProvider } from './employee/context/EmployeeAuthContext';
import EmployeeProtectedRoute from './employee/components/EmployeeProtectedRoute';
import EmployeeLayout from './employee/components/EmployeeLayout';
import EmployeeLogin from './employee/pages/EmployeeLogin';
import EmployeeDashboard from './employee/pages/EmployeeDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <EmployeeAuthProvider>
          <SettingsProvider>
            <CustomerAuthProvider>
              <POSProvider>
                {/* Global Customer Authentication Modal (Signup & Login) */}
                <CustomerAuthModal />

                <Routes>
                  {/* 1. Customer-Facing Store Pages */}
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Navigate to="/menu" replace />} />
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="billing" element={<BillingPage />} />
                    <Route path="cart" element={<Navigate to="/billing" replace />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="profile" element={<CustomerProfilePage />} />
                    <Route path="pos" element={<POSPage />} />
                  </Route>

                  {/* 2. Dedicated Business Director / Admin Section */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="employees" element={<Employees />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="categories" element={<CategoriesPage />} />
                      <Route path="inventory" element={<InventoryPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="pos" element={<POSPage />} />
                    </Route>
                  </Route>

                  {/* Admin Direct URL and Typo Alias Rewrites (e.g. /admin%20page from user workspace) */}
                  <Route path="/admin%20page" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin page" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/adminpage" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin-page" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/Admin%20page" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/Admin page" element={<Navigate to="/admin/dashboard" replace />} />

                  {/* 3. Dedicated Employee Portal (Kitchen & Packing Operations) */}
                  <Route path="/employee/login" element={<EmployeeLogin />} />
                  <Route path="/employee" element={<EmployeeProtectedRoute />}>
                    <Route element={<EmployeeLayout />}>
                      <Route index element={<Navigate to="/employee/dashboard" replace />} />
                      <Route path="dashboard" element={<EmployeeDashboard />} />
                    </Route>
                  </Route>
                  <Route path="/employee-page" element={<Navigate to="/employee/dashboard" replace />} />
                  <Route path="/employee%20page" element={<Navigate to="/employee/dashboard" replace />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/menu" replace />} />
                </Routes>
              </POSProvider>
            </CustomerAuthProvider>
          </SettingsProvider>
        </EmployeeAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
