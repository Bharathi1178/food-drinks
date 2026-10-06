import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, CreditCard, Calendar, BarChart2, DollarSign, Wallet } from 'lucide-react';
import ReportFilters from '../components/ReportFilters';
import { reportApi } from '../api/reportApi';

export default function Reports() {
  const [reportType, setReportType] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'payments'
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [reportType, filterPeriod, selectedDate, selectedMonth, selectedYear]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await reportApi.getReports({
        period: filterPeriod,
        date: selectedDate,
        month: selectedMonth,
        year: selectedYear
      });
      setReportData(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalTurnover = Number(reportData?.total_turnover || 0);
  const orderCount = reportData?.order_count || 0;
  const aov = Number(reportData?.average_order_value || 0);
  const payments = reportData?.payment_breakdown || {
    Cash: { count: 0, amount: 0 },
    UPI: { count: 0, amount: 0 },
    Card: { count: 0, amount: 0 }
  };

  const weeklyBreakdown = reportData?.weekly_breakdown || [];
  const monthlyBreakdown = reportData?.monthly_breakdown || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Turnover & Sales Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">Comprehensive Financial Audits, Daily Turnover & Revenue Analytics</p>
      </div>

      {/* Report Category Switcher Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'daily', label: 'Daily Turnover' },
          { id: 'weekly', label: 'Weekly Turnover' },
          { id: 'monthly', label: 'Monthly Turnover' },
          { id: 'payments', label: 'Payment Breakdown' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setReportType(tab.id);
              if (tab.id === 'daily') setFilterPeriod('today');
              if (tab.id === 'weekly') setFilterPeriod('this_week');
              if (tab.id === 'monthly') setFilterPeriod('this_month');
            }}
            className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all -mb-px ${
              reportType === tab.id
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Control Bar */}
      <ReportFilters
        activeFilter={filterPeriod}
        onFilterChange={(p) => setFilterPeriod(p)}
        selectedDate={selectedDate}
        onDateChange={(d) => setSelectedDate(d)}
      />

      {loading && !reportData ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Generating director turnover reports...
        </div>
      ) : (
        <>
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Gross Turnover</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ₹{totalTurnover.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total revenue generated</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{orderCount}</p>
              <p className="text-xs text-slate-500 mt-1">Orders processed</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Average Order Value (AOV)</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                ₹{aov.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 mt-1">Average ticket size</p>
            </div>
          </div>

          {/* VIEW 1: DAILY TURNOVER */}
          {reportType === 'daily' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Selected Day Sales Performance</h3>
                    <p className="text-xs text-slate-500">Selected date: {selectedDate}</p>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
                  />
                </div>

                {/* Day Summary Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Day Turnover</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">₹{totalTurnover.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Orders Completed</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">{orderCount}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Average Ticket</span>
                    <p className="text-xl font-bold text-emerald-700 mt-1">₹{aov}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: WEEKLY TURNOVER */}
          {reportType === 'weekly' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Breakdown (Monday through Sunday)</h3>
                <p className="text-xs text-slate-500">Detailed sales and order volume across each day of the week</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {weeklyBreakdown.map((day) => (
                  <div key={day.day} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-700">{day.day}</p>
                    <p className="text-[10px] text-slate-400 mb-2">{day.date}</p>
                    <p className="text-sm font-black text-slate-900">₹{Number(day.turnover).toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{day.orders} orders</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: MONTHLY TURNOVER */}
          {reportType === 'monthly' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Monthly Turnover Analysis</h3>
                  <p className="text-xs text-slate-500">Week-by-week aggregated turnover</p>
                </div>

                {/* Month & Year Selection */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                  >
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((m, idx) => (
                      <option key={m} value={idx + 1}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {monthlyBreakdown.map((w, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-700">{w.label}</p>
                    <p className="text-xl font-black text-slate-900 mt-2">
                      ₹{Number(w.turnover).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{w.orders} orders processed</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: PAYMENT REPORT (Also displayed below or when tab clicked) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Methods Breakdown</h3>
              <p className="text-xs text-slate-500">Revenue split across Cash, UPI, and Card transactions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Cash */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="text-xs font-bold uppercase">Cash</span>
                  <Wallet size={16} />
                </div>
                <p className="text-2xl font-black text-emerald-900 mt-2">
                  ₹{Number(payments.Cash?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  {payments.Cash?.count || 0} transactions
                </p>
              </div>

              {/* UPI */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between text-blue-800">
                  <span className="text-xs font-bold uppercase">UPI Payments</span>
                  <DollarSign size={16} />
                </div>
                <p className="text-2xl font-black text-blue-900 mt-2">
                  ₹{Number(payments.UPI?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {payments.UPI?.count || 0} transactions
                </p>
              </div>

              {/* Card */}
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl">
                <div className="flex items-center justify-between text-purple-800">
                  <span className="text-xs font-bold uppercase">Card POS</span>
                  <CreditCard size={16} />
                </div>
                <p className="text-2xl font-black text-purple-900 mt-2">
                  ₹{Number(payments.Card?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {payments.Card?.count || 0} transactions
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
