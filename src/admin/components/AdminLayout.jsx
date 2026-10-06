import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import GlobalPortalSwitcher from '../../components/common/GlobalPortalSwitcher';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Derive human readable page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/customers')) return 'Customer Directory';
    if (path.includes('/admin/employees')) return 'Employee Management';
    if (path.includes('/admin/reports')) return 'Turnover & Sales Reports';
    if (path.includes('/admin/products')) return 'Food Products Catalog';
    if (path.includes('/admin/categories')) return 'Menu Categories';
    if (path.includes('/admin/inventory')) return 'Inventory & Stock Management';
    if (path.includes('/admin/settings')) return 'System Settings';
    if (path.includes('/admin/pos')) return 'Point of Sale (POS) Counter';
    return 'Executive Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Universal Connected Portals Switcher */}
      <GlobalPortalSwitcher />

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader pageTitle={getPageTitle()} onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
