import React, { useState, useEffect, useMemo } from 'react';
import { reportService } from '../api/services/reportService';
import DateFilter from '../components/common/DateFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart3,
  Download,
  Printer,
  DollarSign,
  TrendingUp,
  Percent,
  Receipt,
  PieChart,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('this_month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getSummary();
      setReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Compute breakdown by category from orders
  const categoryBreakdown = useMemo(() => {
    if (!reportData?.orders) return {};
    const catMap = {};
    reportData.orders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.category || 'other';
        catMap[cat] = (catMap[cat] || 0) + (item.total || item.price * item.quantity);
      });
    });
    return catMap;
  }, [reportData]);

  // Compute product sales ranking
  const productRankings = useMemo(() => {
    if (!reportData?.orders) return [];
    const pMap = {};
    reportData.orders.forEach((o) => {
      o.items?.forEach((item) => {
        if (!pMap[item.name]) {
          pMap[item.name] = { name: item.name, qty: 0, revenue: 0, price: item.price };
        }
        pMap[item.name].qty += item.quantity;
        pMap[item.name].revenue += item.total || item.price * item.quantity;
      });
    });
    return Object.values(pMap).sort((a, b) => b.revenue - a.revenue);
  }, [reportData]);

  const handleExportCSV = () => {
    if (!reportData?.orders) return;
    const headers = 'Order ID,Date,Customer,Total,Payment Mode,Status\n';
    const rows = reportData.orders
      .map(
        (o) =>
          `"${o.id}","${o.date}","${o.customerName}",${o.grandTotal},"${o.paymentMethod}","${o.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BitePOS_Sales_Report_${dateFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Compiling financial reports..." />;
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    grossProfit = 0,
    totalGst = 0,
    paymentBreakdown = {},
  } = reportData || {};

  const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">Reports & Financial Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sales performance, payment method split, GST tax filings, and gross profitability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <DateFilter
          selectedFilter={dateFilter}
          onSelectFilter={setDateFilter}
          customStartDate={customStart}
          customEndDate={customEnd}
          onCustomDateChange={(k, v) =>
            k === 'start' ? setCustomStart(v) : setCustomEnd(v)
          }
        />
        <span className="text-xs font-bold text-slate-500 hidden sm:block">
          Aggregated over {totalOrders} transactions
        </span>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Gross Revenue</span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ₹{totalRevenue.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {totalOrders} total sales
          </span>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Estimated Gross Profit</span>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            ₹{grossProfit.toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            {profitMargin}% Gross Margin
          </span>
        </div>

        {/* GST Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">GST Tax Collected</span>
          <p className="text-2xl font-black text-orange-600 font-mono">
            ₹{totalGst.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            CGST: ₹{(totalGst / 2).toFixed(2)} • SGST: ₹{(totalGst / 2).toFixed(2)}
          </span>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Average Ticket Size</span>
          <p className="text-2xl font-black text-slate-800 font-mono">
            ₹{(totalRevenue / (totalOrders || 1)).toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Per customer order</span>
        </div>
      </div>

      {/* Middle Section: Payment Methods & Category Share */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Payment Method Distribution</h3>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {Object.entries(paymentBreakdown).map(([mode, amt]) => {
              const pct = totalRevenue > 0 ? ((amt / totalRevenue) * 100).toFixed(1) : 0;
              return (
                <div key={mode} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{mode}</span>
                    <span className="text-slate-900 font-mono">
                      ₹{amt.toFixed(2)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        mode === 'UPI'
                          ? 'bg-orange-500'
                          : mode === 'Cash'
                          ? 'bg-emerald-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Sales Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Category Sales Share</h3>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([cat, amt]) => {
              const pct = totalRevenue > 0 ? ((amt / totalRevenue) * 100).toFixed(1) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold capitalize">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900 font-mono">
                      ₹{amt.toFixed(2)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product-Wise Sales Performance */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Product Sales Volume & Gross Revenue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Gross Sales</th>
                <th className="py-3 px-4">Revenue Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productRankings.map((p, idx) => {
                const share = totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : 0;
                return (
                  <tr key={p.name} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 font-mono">₹{p.price}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.qty}</td>
                    <td className="py-3 px-4 font-mono font-extrabold text-orange-600">
                      ₹{p.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">{share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
