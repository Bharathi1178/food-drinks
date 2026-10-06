import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GlobalPortalSwitcher from '../common/GlobalPortalSwitcher';
import HeldOrdersModal from '../pos/HeldOrdersModal';
import ThermalReceipt from '../invoice/ThermalReceipt';
import { usePOS } from '../../context/POSContext';

export default function AppLayout() {
  const { activeReceipt, setActiveReceipt } = usePOS();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* Universal Connected Portals Switcher */}
      <GlobalPortalSwitcher />

      {/* Top Customer-Centric Sticky Navigation Bar */}
      <Header />

      {/* Main Page Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Professional Customer-Facing Footer */}
      <Footer />

      {/* Global Held Orders Drawer/Modal */}
      <HeldOrdersModal />

      {/* Thermal Receipt Preview & Print Modal */}
      {activeReceipt && (
        <ThermalReceipt
          order={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
}
