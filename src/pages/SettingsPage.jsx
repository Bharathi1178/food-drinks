import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  Store,
  Receipt,
  Users,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'invoice' | 'users' | 'system'

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings.');
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        'Are you sure you want to reset all data? This will restore initial sample fast-food menu items, categories, customers and orders.'
      )
    ) {
      await resetAllData();
      alert('System database reset to sample defaults.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure shop profile, thermal tax invoices, taxes, and system users.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'shop', label: 'Shop Profile', icon: Store },
          { id: 'invoice', label: 'Invoice & Thermal Printer', icon: Receipt },
          { id: 'users', label: 'Staff Roles & Users', icon: Users },
          { id: 'system', label: 'System & Data', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {/* SHOP SETTINGS */}
        {activeTab === 'shop' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Restaurant & Outlet Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shop / Outlet Name *</label>
                <input
                  type="text"
                  required
                  value={formData?.shop?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData?.shop?.tagline || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData?.shop?.phone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData?.shop?.email || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GSTIN / Tax ID Number</label>
                <input
                  type="text"
                  value={formData?.shop?.gstin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, gstin: e.target.value },
                    })
                  }
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={formData?.shop?.currency || '₹'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, currency: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Store Address</label>
                <textarea
                  rows="2"
                  value={formData?.shop?.address || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shop: { ...formData.shop, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* INVOICE SETTINGS */}
        {activeTab === 'invoice' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Invoice & Thermal Print Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice Number Prefix</label>
                <input
                  type="text"
                  value={formData?.invoice?.prefix || 'BC-'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoice: { ...formData.invoice, prefix: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Default GST Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={formData?.invoice?.taxRate ?? 5}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoice: { ...formData.invoice, taxRate: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thermal Receipt Size</label>
                <select
                  value={formData?.invoice?.receiptSize || '80mm'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoice: { ...formData.invoice, receiptSize: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="80mm">80mm (Standard POS Thermal Printer)</option>
                  <option value="58mm">58mm (Compact Mobile POS Printer)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Footer Message (Printed on receipt bottom)
                </label>
                <input
                  type="text"
                  value={formData?.invoice?.footerMessage || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoice: { ...formData.invoice, footerMessage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* USERS SETTINGS */}
        {activeTab === 'users' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Staff & User Permissions
            </h3>

            <div className="space-y-2">
              {formData?.users?.map((u, i) => (
                <div
                  key={u.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYSTEM & DATA */}
        {activeTab === 'system' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Database Maintenance
            </h3>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-rose-900">Reset Local Database to Sample Defaults</h4>
                <p className="text-rose-700 text-xs mt-1">
                  Resets products, categories, orders, customers and logs back to initial rich sample data.
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-xs"
              >
                Reset Database
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
