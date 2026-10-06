import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Briefcase,
  TrendingUp,
  Receipt,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import { adminApi } from '../api/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState('daily');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="py-16 text-center text-slate-500 text-sm">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Director Metrics...
      </div>
    );
  }

  const todayTurnover = Number(stats?.today_turnover || 0);
  const weeklyTurnover = Number(stats?.weekly_turnover || 0);
  const monthlyTurnover = Number(stats?.monthly_turnover || 0);
  const totalOrders = stats?.total_orders || 0;
  const totalCustomers = stats?.total_customers || 0;
  const activeEmployees = stats?.active_employees || 0;

  const todaySales = stats?.today_sales || {
    order_count: 0,
    total_sales: todayTurnover,
    average_order_value: 0
  };

  const recentOrders = stats?.recent_orders || [];
  const salesOverview = stats?.sales_overview || [];

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards (Turnover & Business Scale) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Business Turnover Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Today's Turnover"
            value={`₹${todayTurnover.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtitle="Today's gross business revenue"
            trend="+12%"
            icon={IndianRupee}
          />
          <StatCard
            title="Weekly Turnover"
            value={`₹${weeklyTurnover.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtitle="Current week turnover"
            trend="+8.5%"
            icon={TrendingUp}
          />
          <StatCard
            title="Monthly Turnover"
            value={`₹${monthlyTurnover.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtitle="Current month turnover"
            trend="+14.2%"
            icon={Receipt}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString('en-IN')}
          subtitle="All recorded POS orders"
          icon={ShoppingBag}
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers.toLocaleString('en-IN')}
          subtitle="Registered customer base"
          icon={Users}
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees.toString()}
          subtitle="Staff currently on duty"
          icon={Briefcase}
        />
      </div>

      {/* 2. Today's Sales Key Performance Indicator */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Realtime Performance</span>
            <h3 className="text-lg font-bold text-white">Today's Sales Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 flex items-center">
            <Clock size={13} className="mr-1.5 text-slate-400" />
            Live Store Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">Number of Orders</p>
            <p className="text-2xl font-black text-white mt-1">{todaySales.order_count}</p>
            <p className="text-[11px] text-slate-400 mt-1">Processed today</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">Total Sales</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              ₹{Number(todaySales.total_sales).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Gross sales today</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">Average Order Value (AOV)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ₹{Number(todaySales.average_order_value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Average per customer ticket</p>
          </div>
        </div>
      </div>

      {/* 3. Sales Overview Chart */}
      <SalesChart
        data={salesOverview}
        activeTab={chartTab}
        onTabChange={(tab) => setChartTab(tab)}
      />

      {/* 4. Recent Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Latest transactions across the billing system</p>
          </div>
          <a
            href="/admin/reports"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
          >
            <span>Full Reports</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Date / Time</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Payment Method</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    No recent orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{ord.id}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">{ord.customer || 'Customer'}</td>
                    <td className="py-2.5 px-4 text-slate-500">{ord.date} {ord.time || ''}</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                      ₹{Number(ord.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[10px]">
                        {ord.paymentMethod || 'Cash'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {ord.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
