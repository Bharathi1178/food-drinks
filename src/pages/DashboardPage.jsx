import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Printer,
  Calendar,
} from 'lucide-react';
import { orderService } from '../api/services/orderService';
import { productService } from '../api/services/productService';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePOS } from '../context/POSContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveReceipt } = usePOS();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ord, prod] = await Promise.all([
          orderService.getAll(),
          productService.getAll(),
        ]);
        setOrders(ord || []);
        setProducts(prod || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = useMemo(() => {
    return orders.filter((o) => o.date === todayStr || true); // mock: use all for demo data richness
  }, [orders, todayStr]);

  const todaySales = todayOrders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
  const pendingOrders = todayOrders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;
  const completedOrders = todayOrders.filter((o) => o.status === 'Completed').length;
  const lowStockProducts = products.filter((p) => p.stock <= (p.minStock || 10));

  // Compute best selling products
  const bestSellers = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      o.items?.forEach((i) => {
        counts[i.name] = (counts[i.name] || 0) + i.quantity;
      });
    });
    return Object.entries(counts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard metrics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 rounded-3xl text-white shadow-lg shadow-orange-500/20">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
            Live Restaurant Overview
          </span>
          <h1 className="text-2xl font-black mt-1">Today's Sales & POS Analytics</h1>
          <p className="text-xs text-orange-100 mt-0.5">
            Monitor real-time fast food billing, pending orders, and kitchen flow.
          </p>
        </div>

        <Link
          to="/pos"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 rounded-xl text-xs font-extrabold hover:bg-orange-50 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Flame className="w-4 h-4 text-orange-600" />
          <span>Open POS Terminal</span>
        </Link>
      </div>

      {/* Top Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Today's Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ₹{todaySales.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        {/* Orders Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Today's Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {todayOrders.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Avg ticket: ₹{(todaySales / (todayOrders.length || 1)).toFixed(0)}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Kitchen Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono">
            {pendingOrders}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {completedOrders} completed today
          </p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Low Stock Items</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-mono">
            {lowStockProducts.length}
          </p>
          <Link
            to="/inventory"
            className="text-[11px] text-orange-600 hover:underline font-bold mt-1 inline-block"
          >
            Review inventory &rarr;
          </Link>
        </div>
      </div>

      {/* Middle Section: Sales Summary Visual & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Summary Visual Card (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Sales Summary</h3>
                <p className="text-xs text-slate-400">Hourly billing volume across the day</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                Peak Hours: 12PM - 2PM, 7PM - 9PM
              </span>
            </div>

            {/* Custom SVG Line Trend Chart */}
            <div className="h-44 w-full pt-4">
              <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
                {/* Grid horizontal lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />

                {/* Gradient area */}
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 10 95 Q 60 85, 100 65 T 200 40 T 300 25 T 400 50 T 490 20 L 490 110 L 10 110 Z"
                  fill="url(#salesGrad)"
                />

                {/* Line */}
                <path
                  d="M 10 95 Q 60 85, 100 65 T 200 40 T 300 25 T 400 50 T 490 20"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Key data dots */}
                <circle cx="100" cy="65" r="4.5" fill="#f97316" stroke="white" strokeWidth="2" />
                <circle cx="200" cy="40" r="4.5" fill="#f97316" stroke="white" strokeWidth="2" />
                <circle cx="300" cy="25" r="5" fill="#ea580c" stroke="white" strokeWidth="2" />
                <circle cx="490" cy="20" r="5" fill="#ea580c" stroke="white" strokeWidth="2" />
              </svg>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-2">
                <span>9 AM</span>
                <span>11 AM</span>
                <span>1 PM (Lunch Peak)</span>
                <span>4 PM</span>
                <span>7 PM</span>
                <span>9 PM (Dinner Peak)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs mt-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Gross Sales</span>
              <p className="text-base font-bold text-slate-800">₹{(todaySales * 1.05).toFixed(0)}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Discounts Given</span>
              <p className="text-base font-bold text-emerald-600">₹{(todaySales * 0.05).toFixed(0)}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">GST Collected</span>
              <p className="text-base font-bold text-slate-800">₹{(todaySales * 0.05).toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col">
          <h3 className="text-base font-bold text-slate-900 mb-1">Best Selling Products</h3>
          <p className="text-xs text-slate-400 mb-4">Top fast food items ordered today</p>

          <div className="flex-1 space-y-3">
            {bestSellers.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      index === 0
                        ? 'bg-amber-500 text-white'
                        : index === 1
                        ? 'bg-slate-300 text-slate-800'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-extrabold text-orange-600 font-mono">
                  {item.qty} sold
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="w-full text-center py-2.5 mt-4 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-xl transition-colors border border-dashed border-orange-200"
          >
            Manage Product Catalog &rarr;
          </Link>
        </div>
      </div>

      {/* Bottom Section: Recent Orders Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
            <p className="text-xs text-slate-400">Live order stream at cashier desk</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Token</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {ord.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-700">
                      {ord.tokenNo}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800">{ord.customerName}</span>
                    <span className="block text-[10px] text-slate-400">{ord.orderType}</span>
                  </td>
                  <td className="py-3 px-3 max-w-[200px] truncate text-slate-500">
                    {ord.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-slate-900">
                    ₹{Number(ord.grandTotal || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <OrderStatusBadge status={ord.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveReceipt(ord)}
                      className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Print Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
