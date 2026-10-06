import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import employeeAuthApi from '../api/employeeAuthApi';
import {
  Flame,
  ChefHat,
  Package,
  Bike,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  Check,
  Search,
  RefreshCw,
  Eye,
  X,
  Sparkles,
  ShoppingBag,
  IndianRupee,
  UtensilsCrossed,
  FileText,
  UserCheck,
  List,
  LayoutGrid,
  AlertCircle,
  Trash2,
} from 'lucide-react';

const QUEUE_TABS = [
  {
    id: 'new',
    label: 'New Orders',
    icon: Flame,
    sub: 'Awaiting Accept',
    iconBg: 'bg-orange-500/20 border border-orange-500/30',
    iconColor: 'text-orange-400',
    numberColor: 'text-orange-400',
    activeStyle: 'border-orange-500 ring-2 ring-orange-500/40 bg-orange-500/10 shadow-[0_0_25px_rgba(249,115,22,0.25)]',
  },
  {
    id: 'preparing',
    label: 'Preparing',
    icon: ChefHat,
    sub: 'In Kitchen',
    iconBg: 'bg-blue-500/20 border border-blue-500/30',
    iconColor: 'text-blue-400',
    numberColor: 'text-blue-400',
    activeStyle: 'border-blue-500 ring-2 ring-blue-500/40 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.25)]',
  },
  {
    id: 'packing',
    label: 'Ready for Packing',
    icon: Package,
    sub: 'Needs Box',
    iconBg: 'bg-purple-500/20 border border-purple-500/30',
    iconColor: 'text-purple-400',
    numberColor: 'text-purple-400',
    activeStyle: 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.25)]',
  },
];

const QUEUE_THEMES = {
  new: {
    toolbarBg: 'bg-gradient-to-r from-orange-500/25 via-amber-500/15 to-[#0D1322]',
    toolbarBorder: 'border-orange-500/30',
    titleBadge: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-orange-500/30',
    titleText: 'text-white',
    countBadge: 'bg-black/30 text-slate-950 font-black',
    liveBadge: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
    liveDot: 'bg-orange-400',
    theadBg: 'bg-gradient-to-r from-orange-950/80 via-amber-950/40 to-[#0D1322]',
    theadBorder: 'border-orange-500/30',
    thText: 'text-amber-300',
    thIcon: 'text-orange-400',
  },
  preparing: {
    toolbarBg: 'bg-gradient-to-r from-blue-500/25 via-sky-500/15 to-[#0D1322]',
    toolbarBorder: 'border-blue-500/30',
    titleBadge: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white font-black shadow-lg shadow-blue-500/30',
    titleText: 'text-white',
    countBadge: 'bg-white/25 text-white font-black',
    liveBadge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    liveDot: 'bg-blue-400',
    theadBg: 'bg-gradient-to-r from-blue-950/80 via-sky-950/40 to-[#0D1322]',
    theadBorder: 'border-blue-500/30',
    thText: 'text-sky-300',
    thIcon: 'text-blue-400',
  },
  packing: {
    toolbarBg: 'bg-gradient-to-r from-purple-500/25 via-indigo-500/15 to-[#0D1322]',
    toolbarBorder: 'border-purple-500/30',
    titleBadge: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black shadow-lg shadow-purple-500/30',
    titleText: 'text-white',
    countBadge: 'bg-white/25 text-white font-black',
    liveBadge: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    liveDot: 'bg-purple-400',
    theadBg: 'bg-gradient-to-r from-purple-950/80 via-indigo-950/40 to-[#0D1322]',
    theadBorder: 'border-purple-500/30',
    thText: 'text-purple-300',
    thIcon: 'text-purple-400',
  },
  delivery: {
    toolbarBg: 'bg-gradient-to-r from-teal-500/25 via-cyan-500/15 to-[#0D1322]',
    toolbarBorder: 'border-teal-500/30',
    titleBadge: 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black shadow-lg shadow-teal-500/30',
    titleText: 'text-white',
    countBadge: 'bg-white/25 text-white font-black',
    liveBadge: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
    liveDot: 'bg-teal-400',
    theadBg: 'bg-gradient-to-r from-teal-950/80 via-cyan-950/40 to-[#0D1322]',
    theadBorder: 'border-teal-500/30',
    thText: 'text-teal-300',
    thIcon: 'text-teal-400',
  },
  completed: {
    toolbarBg: 'bg-gradient-to-r from-emerald-500/25 via-teal-500/15 to-[#0D1322]',
    toolbarBorder: 'border-emerald-500/30',
    titleBadge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg shadow-emerald-500/30',
    titleText: 'text-white',
    countBadge: 'bg-white/25 text-white font-black',
    liveBadge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    liveDot: 'bg-emerald-400',
    theadBg: 'bg-gradient-to-r from-emerald-950/80 via-teal-950/40 to-[#0D1322]',
    theadBorder: 'border-emerald-500/30',
    thText: 'text-emerald-300',
    thIcon: 'text-emerald-400',
  },
  cancelled: {
    toolbarBg: 'bg-gradient-to-r from-rose-500/25 via-red-500/15 to-[#0D1322]',
    toolbarBorder: 'border-rose-500/30',
    titleBadge: 'bg-gradient-to-r from-rose-500 to-red-500 text-white font-black shadow-lg shadow-rose-500/30',
    titleText: 'text-white',
    countBadge: 'bg-white/25 text-white font-black',
    liveBadge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    liveDot: 'bg-rose-400',
    theadBg: 'bg-gradient-to-r from-rose-950/80 via-red-950/40 to-[#0D1322]',
    theadBorder: 'border-rose-500/30',
    thText: 'text-rose-300',
    thIcon: 'text-rose-400',
  },
};

export default function EmployeeDashboard() {
  const { employee } = useEmployeeAuth();
  const { soundEnabled } = useOutletContext() || { soundEnabled: true };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [ticker, setTicker] = useState(Date.now());
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' (like image 2) or 'grid'
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    const finalReason = cancelReason.trim() || 'Cancelled from Employee Station';
    await handleTransition(orderToCancel, 'CANCELLED', {
      cancellation_reason: finalReason,
    });
    setOrderToCancel(null);
    setCancelReason('');
  };

  const activeTabConfig = QUEUE_TABS.find((t) => t.id === activeTab) || QUEUE_TABS[0];
  const ActiveQueueIcon = activeTabConfig.icon || Flame;
  const activeQueueTheme = QUEUE_THEMES[activeTab] || QUEUE_THEMES.new;

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase().trim();
    if (s === 'PLACED' || s === 'NEW' || s === 'ORDER PLACED') {
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
    }
    if (s === 'ACCEPTED') {
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
    }
    if (s === 'PREPARING' || s === 'START_PREPARING') {
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
    }
    if (s === 'FOOD_READY') {
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/40';
    }
    if (s === 'PACKING' || s === 'START_PACKING') {
      return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40';
    }
    if (s === 'READY_FOR_DELIVERY' || s === 'OUT_FOR_DELIVERY' || s === 'ARRIVED') {
      return 'bg-teal-500/20 text-teal-400 border border-teal-500/40';
    }
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    }
    if (s === 'CANCELLED' || s === 'CANCELED' || s.includes('RETURN')) {
      return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
    }
    return 'bg-slate-800 text-slate-300 border border-slate-700';
  };

  const getDishEmoji = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('burger')) return '🍔';
    if (n.includes('pizza')) return '🍕';
    if (n.includes('fries') || n.includes('finger')) return '🍟';
    if (n.includes('coffee') || n.includes('tea') || n.includes('frappe') || n.includes('latte')) return '☕';
    if (n.includes('shake') || n.includes('juice') || n.includes('drink') || n.includes('beverage')) return '🥤';
    if (n.includes('chicken') || n.includes('wings') || n.includes('nugget')) return '🍗';
    if (n.includes('sandwich') || n.includes('sub')) return '🥪';
    if (n.includes('ice') || n.includes('dessert') || n.includes('cake')) return '🍨';
    return '🍽️';
  };

  const prevOrdersCountRef = useRef(0);

  // Play audio chime when a brand new order arrives
  const playNewOrderChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Fetch orders from backend
  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await employeeAuthApi.getOrders();
      const list = Array.isArray(data) ? data : [];
      
      // Check if new orders arrived
      const newOrders = list.filter((o) => {
        const s = (o.status || '').toUpperCase().trim();
        return s === 'PLACED' || s === 'NEW' || s === 'ORDER PLACED';
      });

      if (prevOrdersCountRef.current > 0 && newOrders.length > prevOrdersCountRef.current) {
        playNewOrderChime();
      }
      prevOrdersCountRef.current = newOrders.length;

      setOrders(list);
    } catch (err) {
      console.error('Failed to load employee orders:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders(true);
      setTicker(Date.now());
    }, 3000);

    const handleEvent = () => fetchOrders(true);
    window.addEventListener('bitepos_new_order', handleEvent);
    window.addEventListener('bitepos_order_status_change', handleEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('bitepos_new_order', handleEvent);
      window.removeEventListener('bitepos_order_status_change', handleEvent);
    };
  }, []);

  const showSuccessBanner = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Order category matching helper
  const getOrderQueue = (order) => {
    const s = (order.status || '').toUpperCase().trim();
    if (s === 'CANCELLED' || s === 'CANCELED' || s.includes('CANCEL') || s.includes('RETURN')) {
      return 'cancelled';
    }
    if (s === 'DELIVERED' || s === 'COMPLETED' || s === 'DONE') {
      return 'completed';
    }
    if (s === 'READY_FOR_DELIVERY' || s === 'PACKED' || s.includes('READY_FOR_DELIVERY') || s === 'OUT_FOR_DELIVERY' || s === 'OUT FOR DELIVERY' || s === 'ARRIVED') {
      return 'delivery';
    }
    if (s === 'FOOD_READY' || s === 'PACKING' || s === 'START_PACKING') {
      return 'packing';
    }
    if (s === 'ACCEPTED' || s === 'PREPARING' || s === 'START_PREPARING' || s.includes('PREP')) {
      return 'preparing';
    }
    return 'new'; // Default PLACED / NEW
  };

  // Status transition handler
  const handleTransition = async (order, targetStatus, extraPayload = {}) => {
    setUpdatingId(order.id);
    const nowIso = new Date().toISOString();

    const payload = {
      status: targetStatus,
      ...extraPayload,
    };

    // If accepting order, record employee assignment
    if (targetStatus === 'ACCEPTED') {
      payload.accepted_by_employee_id = employee?.id || 'EMP';
      payload.accepted_by_employee_name = employee?.name || 'Staff';
      payload.accepted_at = nowIso;
    }

    try {
      const updated = await employeeAuthApi.updateOrderStatus(order.id, payload);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...updated, status: targetStatus } : o))
      );
      if (selectedOrder?.id === order.id) {
        setSelectedOrder((prev) => ({ ...prev, ...updated, status: targetStatus }));
      }
      showSuccessBanner(`Order #${order.id} status updated to ${targetStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Cancellation prompt (uses centered modal)
  const handleCancelPrompt = (order) => {
    openCancelModal(order);
  };

  // Return to restaurant prompt
  const handleReturnPrompt = (order) => {
    const reason = prompt('Please enter return reason (e.g. Customer unreachable at address, wrong location):');
    if (reason === null) return;
    handleTransition(order, 'RETURNED_TO_RESTAURANT', {
      return_reason: reason.trim() || 'Delivery partner returned order to kitchen',
    });
  };

  // Format Elapsed Time since creation
  const getElapsedString = (order) => {
    const raw = order.created_at || order.createdAt;
    if (!raw) return 'Just now';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return 'Recently';
    const mins = Math.max(0, Math.floor((ticker - d.getTime()) / 60000));
    if (mins < 1) return 'Just placed (< 1m)';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  // Categorized counts
  const queueCounts = useMemo(() => {
    const counts = { new: 0, preparing: 0, packing: 0, delivery: 0, completed: 0, cancelled: 0 };
    orders.forEach((o) => {
      const q = getOrderQueue(o);
      if (counts[q] !== undefined) counts[q]++;
    });
    return counts;
  }, [orders]);

  // Filtered orders for active tab
  const displayedOrders = useMemo(() => {
    return orders
      .filter((o) => getOrderQueue(o) === activeTab)
      .filter((o) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const idMatch = (o.id || '').toLowerCase().includes(q);
        const nameMatch = (o.customer_name || o.customerName || '').toLowerCase().includes(q);
        const areaMatch = (o.delivery_area || o.deliveryArea || o.delivery_district || '').toLowerCase().includes(q);
        return idMatch || nameMatch || areaMatch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        return timeB - timeA;
      });
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="space-y-5">
      
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Top Controls: Search Bar & Station Stats */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0D1322] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Kitchen & Packing Operational Station</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Logged in as <strong className="text-amber-400 font-bold">{employee?.name}</strong> ({employee?.role}) • Real-time order flow
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search #ORD, customer, area..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
            />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchOrders()}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors shadow-xs cursor-pointer"
            title="Refresh order queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Queue Tabs Navigation (Summary Cards with Bold Colors) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {QUEUE_TABS.map((tab) => {
          const TabIcon = tab.icon;
          const count = queueCounts[tab.id] || 0;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? `${tab.activeStyle} shadow-lg`
                  : 'bg-[#0D1322] border-white/10 hover:border-white/20 hover:bg-[#121828]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className={`p-2 rounded-xl ${tab.iconBg}`}>
                  <TabIcon className={`w-4 h-4 ${tab.iconColor}`} />
                </div>
                <span className={`text-xl font-black ${isActive ? tab.numberColor : 'text-white'}`}>
                  {count}
                </span>
              </div>

              <div>
                <span className={`text-xs font-bold block truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                  {tab.label}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {tab.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Orders Section Header & View Mode Switcher */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Toolbar Header with Bold Color Grading */}
        <div className={`p-3.5 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-200 ${activeQueueTheme.toolbarBg} ${activeQueueTheme.toolbarBorder}`}>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Upper-case Queue Badge with Graded Aesthetic */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg ${activeQueueTheme.titleBadge}`}>
              <ActiveQueueIcon className="w-3.5 h-3.5 shrink-0" />
              <span>
                {activeTab === 'new' ? 'NEW ORDERS QUEUE' : `${activeTabConfig.label.toUpperCase()} QUEUE`}
              </span>
              <span className={`px-1.5 py-0.2 rounded-md text-[11px] font-black ${activeQueueTheme.countBadge}`}>
                {displayedOrders.length}
              </span>
            </div>

            {activeTab === 'new' && displayedOrders.length > 0 && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs animate-pulse ${activeQueueTheme.liveBadge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeQueueTheme.liveDot}`} />
                Live Incoming Orders
              </span>
            )}
            {activeTab === 'preparing' && displayedOrders.length > 0 && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${activeQueueTheme.liveBadge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeQueueTheme.liveDot} animate-ping`} />
                Active in Kitchen
              </span>
            )}
            {activeTab === 'delivery' && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${activeQueueTheme.liveBadge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeQueueTheme.liveDot}`} />
                Dispatch & Delivery Station
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Table List (default) vs Kitchen Cards */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl text-xs font-bold text-slate-300 border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Table List View with Bold Color Graded Uppercase Header */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className={`${activeQueueTheme.theadBg} border-b ${activeQueueTheme.theadBorder} transition-colors duration-200`}>
                <tr className={`text-[10.5px] font-black uppercase tracking-wider ${activeQueueTheme.thText}`}>
                  <th className="py-3.5 px-4 font-black">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      ORDER ID
                    </span>
                  </th>
                  <th className="py-3.5 px-4 font-black">
                    <span className="inline-flex items-center gap-1.5">
                      <UserCheck className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      CUSTOMER
                    </span>
                  </th>
                  <th className="py-3.5 px-4 font-black">
                    <span className="inline-flex items-center gap-1.5">
                      <UtensilsCrossed className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      DISHES & ITEMS
                    </span>
                  </th>
                  <th className="py-3.5 px-4 font-black">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      DELIVERY LOCATION
                    </span>
                  </th>
                  <th className="py-3.5 px-4 font-black">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      ORDER TIME
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-center font-black">
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      STATUS
                    </span>
                  </th>
                  <th className="py-3.5 px-4 font-black">
                    <span className="inline-flex items-center gap-1.5">
                      <IndianRupee className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      PAYMENT
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-center font-black">
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Sparkles className={`w-3.5 h-3.5 ${activeQueueTheme.thIcon}`} />
                      ACTIONS
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#0D1322]">
                {displayedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-14 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white">
                          {activeTab === 'new'
                            ? 'No incoming new orders at the moment.'
                            : `No orders in the ${QUEUE_TABS.find((t) => t.id === activeTab)?.label} queue.`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {activeTab === 'new'
                            ? 'All incoming customer orders have been accepted! Kitchen queue is clear.'
                            : 'Orders will appear here as they transition through preparation stages.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedOrders.map((ord) => {
                    const rawStatus = (ord.status || 'PLACED').toUpperCase();
                    const elapsed = getElapsedString(ord);
                    const isUpdating = updatingId === ord.id;
                    const items = Array.isArray(ord.items) ? ord.items : [];
                    const grandTotal = Number(ord.grand_total || ord.grandTotal || 0);
                    const isCOD = (ord.payment_method || ord.paymentMethod || '').toLowerCase().includes('cash');

                    return (
                      <tr
                        key={ord.id}
                        className={`hover:bg-white/[0.04] transition-colors ${
                          activeTab === 'new' ? 'bg-orange-500/[0.03]' : 'bg-transparent'
                        }`}
                      >
                        {/* 1. ORDER ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-black text-amber-400 text-xs">
                            #{ord.id}
                          </div>
                          {(ord.token_no || ord.tokenNo) && (
                            <span className="inline-block text-[10px] font-bold text-orange-300 bg-orange-500/20 px-1.5 py-0.2 rounded-md border border-orange-500/40 mt-0.5">
                              Token {ord.token_no || ord.tokenNo}
                            </span>
                          )}
                        </td>

                        {/* 2. CUSTOMER */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">
                            {ord.customer_name || ord.customerName || 'Customer'}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{ord.customer_phone || ord.customerPhone || '—'}</span>
                          </div>
                        </td>

                        {/* 3. DISHES & ITEMS */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-xs">
                            <div className="text-xs font-semibold text-slate-200 line-clamp-2 leading-relaxed">
                              {items.length > 0
                                ? items.map((it) => `${getDishEmoji(it.name)} ${it.quantity || 1}× ${it.name}`).join(', ')
                                : 'Order Items'}
                            </div>
                            {(ord.delivery_instructions || items.some((i) => i.instructions)) && (
                              <span className="text-[10px] text-amber-400 font-medium italic mt-0.5 block truncate">
                                Note: {ord.delivery_instructions || items.find((i) => i.instructions)?.instructions}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. DELIVERY LOCATION */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-[190px]">
                            <div className="font-bold text-white text-xs flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                              <span className="truncate">{ord.delivery_area || ord.deliveryArea || ord.delivery_district || 'Local Delivery'}</span>
                            </div>
                            {ord.delivery_landmark && (
                              <div className="text-[11px] text-slate-400 truncate mt-0.5 pl-4.5">
                                {ord.delivery_landmark}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. ORDER TIME */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{elapsed}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 pl-4.5">
                            {ord.created_at ? new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                          </div>
                        </td>

                        {/* 6. STATUS */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(ord.status)}`}>
                            {rawStatus}
                          </span>
                        </td>

                        {/* 7. PAYMENT */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCOD
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {isCOD ? `COD • ₹${grandTotal.toFixed(0)}` : `✓ Paid • ₹${grandTotal.toFixed(0)}`}
                          </span>
                        </td>

                        {/* 8. ACTIONS - Matching Image 2 with compact icon buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center justify-center gap-1.5">
                            {/* Action 1: View Details (Eye) */}
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              title="View Order Details"
                              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Action 2: Process / Advance Workflow Action Button */}
                            {(rawStatus === 'PLACED' || rawStatus === 'NEW' || rawStatus === 'ORDER PLACED') && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'ACCEPTED')}
                                title="Accept Order"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                              </button>
                            )}

                            {rawStatus === 'ACCEPTED' && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'PREPARING')}
                                title="Start Preparing (In Kitchen)"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <ChefHat className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {(rawStatus === 'PREPARING' || rawStatus === 'START_PREPARING') && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'FOOD_READY')}
                                title="Food Ready (Send to Packing)"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 text-white font-bold rounded-xl shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                            )}

                            {rawStatus === 'FOOD_READY' && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'PACKING')}
                                title="Start Packing Order"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <Package className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {rawStatus === 'PACKING' && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'READY_FOR_DELIVERY')}
                                title="Mark Packed & Ready for Delivery"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 text-white font-bold rounded-xl shadow-md shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {rawStatus === 'READY_FOR_DELIVERY' && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'OUT_FOR_DELIVERY')}
                                title="Handover to Delivery Partner"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <Bike className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {(rawStatus === 'OUT_FOR_DELIVERY' || rawStatus === 'ARRIVED') && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleTransition(ord, 'DELIVERED')}
                                title="Confirm Delivered"
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                            )}

                            {/* Action 3: Cancel / Delete Button (Trash2 like Image 2) */}
                            {rawStatus !== 'DELIVERED' && rawStatus !== 'CANCELLED' && !rawStatus.includes('RETURN') && (
                              <button
                                type="button"
                                onClick={() => openCancelModal(ord)}
                                title="Cancel Order"
                                className="p-1.5 sm:p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode 2: Kitchen Cards Grid with Bold Dark Theme */
          <div className="p-4 sm:p-5 bg-[#090D17]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedOrders.map((ord) => {
                const rawStatus = (ord.status || 'PLACED').toUpperCase();
                const elapsed = getElapsedString(ord);
                const isUpdating = updatingId === ord.id;
                const items = Array.isArray(ord.items) ? ord.items : [];
                const itemCount = items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
                const grandTotal = Number(ord.grand_total || ord.grandTotal || 0);
                const isCOD = (ord.payment_method || ord.paymentMethod || '').toLowerCase().includes('cash');

                return (
                  <div
                    key={ord.id}
                    className="bg-[#0D1322] border border-white/10 hover:border-white/20 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all relative overflow-hidden group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-400 tracking-tight font-mono">
                            #{ord.id}
                          </span>
                          {(ord.token_no || ord.tokenNo) && (
                            <span className="text-[10px] font-bold text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded-md border border-orange-500/30">
                              Token {ord.token_no || ord.tokenNo}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{elapsed}</span>
                        </div>
                      </div>

                      {/* Customer & Location */}
                      <div className="pt-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white truncate">
                            {ord.customer_name || ord.customerName || 'Customer'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCOD
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {isCOD ? 'COD' : '✓ Paid'}
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 text-[11px] font-medium text-slate-300">
                            {ord.delivery_area || ord.deliveryArea || ord.delivery_district || 'Local Delivery'}
                            {ord.delivery_landmark ? ` • Near ${ord.delivery_landmark}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Dish Items Breakdown */}
                      <div className="mt-3.5 p-3 rounded-xl bg-[#131B2E] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-1.5 border-b border-white/10">
                          <span>Items to Prepare</span>
                          <span className="text-amber-400">{itemCount} {itemCount === 1 ? 'dish' : 'dishes'}</span>
                        </div>

                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {items.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between text-xs gap-2">
                              <div className="flex items-start gap-1.5 min-w-0">
                                <span className="font-bold text-amber-300 shrink-0">
                                  {getDishEmoji(it.name)} {it.quantity}×
                                </span>
                                <div className="min-w-0">
                                  <p className="text-slate-200 font-semibold truncate leading-snug">
                                    {it.name}
                                  </p>
                                  {it.instructions && (
                                    <p className="text-[10px] text-amber-400 italic">
                                      Note: {it.instructions}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-emerald-400 text-xs shrink-0 font-bold font-mono">
                                ₹{((Number(it.price) || 0) * (Number(it.quantity) || 1)).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {ord.delivery_instructions && (
                        <div className="mt-2 p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[11px] text-amber-300 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{ord.delivery_instructions}</span>
                        </div>
                      )}

                      {ord.accepted_by_employee_name && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Assigned: <strong className="text-white">{ord.accepted_by_employee_name}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Total Bill
                          </span>
                          <span className="text-base font-black text-amber-400 font-mono">
                            ₹{grandTotal.toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 py-1 px-2.5 rounded-xl bg-slate-800/80 border border-white/10 shadow-xs hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View</span>
                        </button>
                      </div>

                      {/* Operational Action Button */}
                      <div className="space-y-1.5">
                        {(rawStatus === 'PLACED' || rawStatus === 'NEW' || rawStatus === 'ORDER PLACED') && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'ACCEPTED')}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Flame className="w-4 h-4 fill-slate-950" />
                            <span>ACCEPT ORDER</span>
                          </button>
                        )}

                        {rawStatus === 'ACCEPTED' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'PREPARING')}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <ChefHat className="w-4 h-4" />
                            <span>START PREPARING 👨‍🍳</span>
                          </button>
                        )}

                        {(rawStatus === 'PREPARING' || rawStatus === 'START_PREPARING') && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'FOOD_READY')}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>FOOD READY (SEND TO PACKING)</span>
                          </button>
                        )}

                        {rawStatus === 'FOOD_READY' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'PACKING')}
                            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Package className="w-4 h-4" />
                            <span>START PACKING</span>
                          </button>
                        )}

                        {rawStatus === 'PACKING' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'READY_FOR_DELIVERY')}
                            className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>PACKED & READY FOR DELIVERY</span>
                          </button>
                        )}

                        {rawStatus === 'READY_FOR_DELIVERY' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'OUT_FOR_DELIVERY')}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Bike className="w-4 h-4" />
                            <span>HANDOVER TO RIDER (OUT FOR DELIVERY 🛵)</span>
                          </button>
                        )}

                        {rawStatus === 'OUT_FOR_DELIVERY' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleTransition(ord, 'ARRIVED')}
                              className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                            >
                              Rider Arrived
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleTransition(ord, 'DELIVERED')}
                              className="py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Delivered</span>
                            </button>
                          </div>
                        )}

                        {rawStatus === 'ARRIVED' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleTransition(ord, 'DELIVERED')}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>CONFIRM DELIVERED & COLLECT PAYMENT ✅</span>
                          </button>
                        )}

                        {rawStatus !== 'DELIVERED' && rawStatus !== 'CANCELLED' && !rawStatus.includes('RETURN') && (
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <button
                              type="button"
                              onClick={() => handleCancelPrompt(ord)}
                              className="text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                            >
                              Cancel Order
                            </button>

                            {(rawStatus === 'OUT_FOR_DELIVERY' || rawStatus === 'ARRIVED') && (
                              <button
                                type="button"
                                onClick={() => handleReturnPrompt(ord)}
                                className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                              >
                                Return to Restaurant
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* DETAILED ORDER DRAWER / MODAL (Bold Luxury Dark Design)         */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D1322] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-amber-400 font-mono">
                    Order #{selectedOrder.id}
                  </h2>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed at {selectedOrder.time || selectedOrder.date || 'Today'} • {getElapsedString(selectedOrder)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details & Delivery Destination */}
            <div className="p-4 rounded-2xl bg-[#131B2E] border border-white/10 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                Customer & Delivery Destination
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Recipient Name</span>
                  <span className="text-white font-bold text-sm">
                    {selectedOrder.customer_name || selectedOrder.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Phone</span>
                  <span className="text-amber-400 font-bold font-mono">
                    {selectedOrder.customer_phone || selectedOrder.customerPhone || 'N/A'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Complete Address</span>
                  <p className="text-slate-200 font-semibold">
                    {selectedOrder.delivery_address || selectedOrder.deliveryAddress || 'No address specified'}
                  </p>
                  {(selectedOrder.delivery_building_details || selectedOrder.deliveryBuildingDetails) && (
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Building: {selectedOrder.delivery_building_details || selectedOrder.deliveryBuildingDetails}
                    </p>
                  )}
                  {(selectedOrder.delivery_landmark || selectedOrder.deliveryLandmark) && (
                    <p className="text-amber-300 text-[11px] mt-0.5 font-medium">
                      Landmark: {selectedOrder.delivery_landmark || selectedOrder.deliveryLandmark}
                    </p>
                  )}
                </div>
                {selectedOrder.delivery_instructions && (
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-amber-300">
                    <strong>Delivery Note:</strong> {selectedOrder.delivery_instructions}
                  </div>
                )}
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Food Items & Kitchen Customization
              </span>
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl bg-[#090D17] overflow-hidden shadow-inner">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-orange-500/30">
                        {it.quantity}×
                      </span>
                      <div>
                        <span className="text-white font-bold text-sm block">
                          {getDishEmoji(it.name)} {it.name}
                        </span>
                        {it.instructions && (
                          <span className="text-[11px] text-amber-400 italic block font-medium">
                            Customization: {it.instructions}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-emerald-400 font-mono font-black text-sm">
                      ₹{((Number(it.price) || 0) * (Number(it.quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-4 rounded-2xl bg-[#131B2E] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Payment Mode & Status
                </span>
                <span className="text-sm font-bold text-white">
                  {selectedOrder.payment_method || selectedOrder.paymentMethod || 'Cash on Delivery'} •{' '}
                  <span className={selectedOrder.payment_status === 'Paid' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {selectedOrder.payment_status || selectedOrder.paymentStatus || 'Pending'}
                  </span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Bill
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  ₹{Number(selectedOrder.grand_total || selectedOrder.grandTotal || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Assignment & Lifecycle Tracking History */}
            <div className="p-4 rounded-2xl bg-[#131B2E] border border-white/10 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Order Lifecycle Log
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Accepted By</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.accepted_by_employee_name || 'Pending Staff'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rider Assigned</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.rider_name || 'BiteCraze Express'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rider Contact</span>
                  <span className="font-semibold text-amber-400 font-mono">
                    {selectedOrder.rider_phone || '9840123456'}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CENTERED CANCELLATION MODAL DIALOG (Replacing browser prompt) */}
      {/* ============================================================== */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D1322] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-left space-y-5 animate-in fade-in zoom-in-95">
            {/* Warning Icon Badge & Title */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Cancel Order #{orderToCancel.id}</h3>
                  <p className="text-xs text-slate-400">
                    {orderToCancel.customer_name || orderToCancel.customerName || 'Customer'} • ₹{Number(orderToCancel.grand_total || orderToCancel.grandTotal || 0).toFixed(0)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Please enter or select cancellation reason:
              </label>

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Customer requested cancellation',
                  'Item out of stock',
                  'Kitchen delay / overloaded',
                  'Customer unreachable at address',
                  'Duplicate order placed',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCancelReason(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      cancelReason === preset
                        ? 'bg-rose-500/25 text-rose-300 border-rose-500/50'
                        : 'bg-slate-900/80 text-slate-400 border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Text Input / Reason Field */}
              <div className="relative">
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Specify cancellation reason..."
                  className="w-full p-3 bg-slate-950/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors shadow-inner resize-none"
                />
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>This will cancel the order and update the order history log.</span>
              </p>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={updatingId === orderToCancel.id}
                onClick={handleConfirmCancel}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{updatingId === orderToCancel.id ? 'Cancelling...' : 'Confirm Cancel'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
