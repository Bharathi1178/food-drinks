import React, { useState, useEffect, useMemo } from 'react';
import { inventoryService } from '../api/services/inventoryService';
import StockInModal from '../components/inventory/StockInModal';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Boxes,
  PlusCircle,
  SlidersHorizontal,
  AlertTriangle,
  History,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' | 'history'

  // Modals state
  const [isStockInOpen, setStockInOpen] = useState(false);
  const [isAdjustmentOpen, setAdjustmentOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getInventory();
      setProducts(data.products || []);
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockIn = async (payload) => {
    try {
      await inventoryService.stockIn(payload);
      await loadInventory();
      setStockInOpen(false);
      setSelectedProductId(null);
    } catch (e) {
      alert('Failed to restock product.');
    }
  };

  const handleAdjustment = async (payload) => {
    try {
      await inventoryService.adjustStock(payload);
      await loadInventory();
      setAdjustmentOpen(false);
      setSelectedProductId(null);
    } catch (e) {
      alert('Failed to adjust stock.');
    }
  };

  // Low stock warning list
  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.stock <= (p.minStock || 10));
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === 'in_stock') matchesStatus = p.stock > (p.minStock || 10);
      else if (statusFilter === 'low_stock')
        matchesStatus = p.stock > 0 && p.stock <= (p.minStock || 10);
      else if (statusFilter === 'out_of_stock') matchesStatus = p.stock <= 0;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">Inventory & Stock Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time kitchen ingredient levels, log supplier restocks, and audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedProductId(null);
              setStockInOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Stock In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedProductId(null);
              setAdjustmentOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Adjust Stock</span>
          </button>
        </div>
      </div>

      {/* Warning Banner if Low Stock Exists */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900">
              Low Stock Warning: {lowStockItems.length} product(s) below reorder threshold
            </h4>
            <p className="text-amber-700 mt-0.5">
              {lowStockItems.map((p) => `${p.name} (${p.stock} left)`).join(' • ')}
            </p>
          </div>
          <button
            onClick={() => {
              setStatusFilter('low_stock');
              setActiveTab('stock');
            }}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold shrink-0 hover:bg-amber-700"
          >
            View Low Stock
          </button>
        </div>
      )}

      {/* Navigation Tabs (Stock Overview vs Audit Trail) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stock'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Current Stock Levels ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock History Logs ({logs.length})</span>
        </button>
      </div>

      {activeTab === 'stock' ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search inventory items..."
              className="flex-1"
            />

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-400 mr-1">Status:</span>
              {[
                { id: 'All', label: 'All' },
                { id: 'in_stock', label: 'In Stock' },
                { id: 'low_stock', label: 'Low Stock' },
                { id: 'out_of_stock', label: 'Out of Stock' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === filter.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <LoadingSpinner size="lg" text="Loading stock..." />
            ) : filteredProducts.length === 0 ? (
              <EmptyState title="No inventory items found" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Current Stock</th>
                      <th className="py-3.5 px-4">Minimum Alert Level</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isOut = p.stock <= 0;
                      const isLow = !isOut && p.stock <= (p.minStock || 10);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                            {p.category}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-base font-black text-slate-900">
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono">
                            {p.minStock || 10} units
                          </td>
                          <td className="py-3.5 px-4">
                            {isOut ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                Low Stock Warning
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProductId(p.id);
                                  setStockInOpen(true);
                                }}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition-colors"
                              >
                                + Stock In
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProductId(p.id);
                                  setAdjustmentOpen(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors"
                              >
                                Adjust
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History logs */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Transaction Type</th>
                  <th className="py-3.5 px-4">Quantity Change</th>
                  <th className="py-3.5 px-4">New Balance</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                  <th className="py-3.5 px-4">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {log.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {log.productName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.type === 'Stock In'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.type === 'POS Deduction'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={log.quantity > 0 ? 'text-emerald-600' : 'text-slate-700'}
                      >
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                      {log.newStock} units
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[240px] truncate">
                      {log.reason}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {log.user || 'System'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock In Modal */}
      <StockInModal
        isOpen={isStockInOpen}
        onClose={() => setStockInOpen(false)}
        onSubmit={handleStockIn}
        products={products}
        initialProductId={selectedProductId}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustmentOpen}
        onClose={() => setAdjustmentOpen(false)}
        onSubmit={handleAdjustment}
        products={products}
        initialProductId={selectedProductId}
      />
    </div>
  );
}
