import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { customerDB } from '../api/customerDatabase';
import { INITIAL_PRODUCTS } from '../api/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import DeliveryMotorcycleTracker from '../components/orders/DeliveryMotorcycleTracker';
import { usePOS } from '../context/POSContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Check,
  Flame,
  FileText,
  MapPin,
  Bike,
  Clock,
  Star,
} from 'lucide-react';

const ORDER_STAGES = [
  { key: 'placed', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: Flame },
  { key: 'delivery', label: 'Out for Delivery', icon: Bike },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = searchParams.get('view') === 'history' ? 'history' : 'track';

  const { setActiveReceipt, addToCart } = usePOS();
  const { currentCustomer } = useCustomerAuth();
  const navigate = useNavigate();

  const setViewMode = (mode) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (mode === 'history') {
        next.set('view', 'history');
      } else {
        next.delete('view');
      }
      return next;
    });
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrders();
      const orderList = Array.isArray(data) ? data : data?.results || [];
      setOrders(orderList);
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleRealtimeUpdate = () => {
      loadOrders();
    };

    window.addEventListener('bitepos_order_status_change', handleRealtimeUpdate);
    window.addEventListener('bitepos_new_order', handleRealtimeUpdate);
    window.addEventListener('storage', handleRealtimeUpdate);

    return () => {
      window.removeEventListener('bitepos_order_status_change', handleRealtimeUpdate);
      window.removeEventListener('bitepos_new_order', handleRealtimeUpdate);
      window.removeEventListener('storage', handleRealtimeUpdate);
    };
  }, []);

  // Safe Date parser for order
  const getOrderDateObj = (order) => {
    if (!order) return new Date();
    const raw = order.created_at || order.createdAt;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d;
    }
    if (order.date) {
      const timeStr = order.time ? ` ${order.time}` : ' 12:00 PM';
      const d = new Date(`${order.date}${timeStr}`);
      if (!isNaN(d.getTime())) return d;
    }
    const num = parseInt((order.id || '').replace(/\D/g, '')) || 0;
    if (num > 1000000000) return new Date(num);
    return new Date(1727000000000 + num * 1000);
  };

  // Format order date & time cleanly (e.g. "Sep 28, 2026, 10:18 AM")
  const formatOrderDateTime = (order) => {
    if (!order) return '';
    const d = getOrderDateObj(order);
    const dateStr = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = order.time || d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr}, ${timeStr}`;
  };

  // Filter & sort customer orders strictly date & day wise (newest first)
  const customerOrders = useMemo(() => {
    let list = [...orders];

    if (currentCustomer?.phone) {
      const custPhone = currentCustomer.phone.replace(/\D/g, '');
      const custName = (currentCustomer.name || '').toLowerCase().trim();
      const ownOrders = list.filter((ord) => {
        const phone = (ord.customerPhone || ord.customer_phone || '').replace(/\D/g, '');
        const name = (ord.customerName || ord.customer_name || '').toLowerCase().trim();
        return (custPhone && phone === custPhone) || (custName && name === custName);
      });
      if (ownOrders.length > 0) {
        list = ownOrders;
      }
    }

    list.sort((a, b) => {
      const timeA = getOrderDateObj(a).getTime();
      const timeB = getOrderDateObj(b).getTime();
      if (timeB !== timeA) return timeB - timeA;
      const numA = parseInt((a.id || '').replace(/\D/g, '')) || 0;
      const numB = parseInt((b.id || '').replace(/\D/g, '')) || 0;
      return numB - numA;
    });

    return list;
  }, [orders, currentCustomer]);

  const targetOrderId = searchParams.get('orderId') || localStorage.getItem('bitepos_last_placed_order_id');

  // Active order currently being viewed in live track mode
  // Prioritizes matching orderId, then in-progress orders, then latest order
  const activeOrder = useMemo(() => {
    if (!customerOrders || customerOrders.length === 0) return null;
    if (targetOrderId) {
      const match = customerOrders.find((o) => o.id === targetOrderId);
      if (match) return match;
    }
    const inProgress = customerOrders.find((o) => {
      const s = (o.status || '').toLowerCase().trim();
      const isDeliveredOrDone =
        (s.includes('deliver') && !s.includes('out') && !s.includes('way')) ||
        s.includes('complete') ||
        s === 'done';
      return !isDeliveredOrDone && !s.includes('cancel');
    });
    if (inProgress) return inProgress;
    return customerOrders[0];
  }, [customerOrders, targetOrderId]);

  // Determine stage index for horizontal progress tracker
  const getStageIndex = (status) => {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('cancel') || s.includes('return')) return -1;
    if (s.includes('out') || s.includes('ready_for_delivery') || s.includes('dispatch') || s.includes('arrived') || s.includes('way')) return 2;
    if (s.includes('deliver') || s.includes('complete') || s === 'done') return 3;
    if (s.includes('prep') || s.includes('cook') || s.includes('kitchen') || s.includes('accept') || s.includes('food_ready') || s.includes('pack')) return 1;
    return 0;
  };

  // Lookup accurate food image for item from order, mock data, or fallback
  const getItemImage = (item) => {
    if (item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
      return item.image;
    }
    const cleanName = (item.name || '').toLowerCase().trim();
    const matched = INITIAL_PRODUCTS.find(
      (p) =>
        p.id === item.id ||
        p.name.toLowerCase().trim() === cleanName ||
        cleanName.includes(p.name.toLowerCase().trim()) ||
        p.name.toLowerCase().trim().includes(cleanName)
    );
    if (matched?.image) return matched.image;

    if (cleanName.includes('biryani') || cleanName.includes('briyani') || cleanName.includes('rice')) {
      return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80';
    }
    if (cleanName.includes('dosa') || cleanName.includes('idli') || cleanName.includes('vada')) {
      return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80';
    }
    if (cleanName.includes('chai') || cleanName.includes('tea') || cleanName.includes('coffee')) {
      return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80';
    }
    if (cleanName.includes('brownie') || cleanName.includes('cake') || cleanName.includes('dessert')) {
      return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80';
    }
    if (cleanName.includes('burger')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80';
    }
    if (cleanName.includes('pizza')) {
      return 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=300&q=80';
    }
    if (cleanName.includes('chicken') || cleanName.includes('curry') || cleanName.includes('gravy')) {
      return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80';
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
  };

  // One-click Re-order handler: adds items back into active cart and navigates to Billing
  const handleReorder = (order) => {
    if (!order?.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: getItemImage(item),
        stock: 50,
        available: true,
      });
    });
    navigate('/billing');
  };

  // Clean, Soft & Premium Status Badges
  const renderHeaderBadge = (status) => {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('cancel')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-xs font-bold shadow-sm">
          <span>Cancelled</span>
        </span>
      );
    }
    if (s.includes('out') || s.includes('ready') || s.includes('dispatch') || s.includes('way')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 text-xs font-bold shadow-sm">
          <Bike className="w-3.5 h-3.5 text-sky-600 animate-bounce" />
          <span>Out for Delivery</span>
        </span>
      );
    }
    if (s.includes('deliver') || s.includes('complete') || s === 'done') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold shadow-sm">
          <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
          <span>Delivered</span>
        </span>
      );
    }
    if (s.includes('prep') || s.includes('cook') || s.includes('kitchen') || s.includes('process')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/80 text-xs font-bold shadow-sm">
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse fill-orange-500" />
          <span>Preparing</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
        <span>Order Placed</span>
      </span>
    );
  };

  // Helper to compute bill breakdown for any order
  const computeBill = (order) => {
    if (!order) return { itemTotal: 0, discount: 0, grandTotal: 0, deliveryFee: 0 };
    const itTotal = (order.items && order.items.length > 0)
      ? order.items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)
      : Number(order.subtotal || 0);
    const disc = Number(order.discount || 0);
    const grTotal = Number(order.grandTotal || order.grand_total || itTotal);
    let fee = 0;
    if (order.deliveryFee !== undefined && order.deliveryFee !== null) {
      fee = Number(order.deliveryFee);
    } else if (order.delivery_fee !== undefined && order.delivery_fee !== null) {
      fee = Number(order.delivery_fee);
    } else {
      const diff = grTotal - (itTotal - disc);
      fee = diff > 0 ? diff : 0;
    }
    return { itemTotal: itTotal, discount: disc, grandTotal: grTotal, deliveryFee: fee };
  };

  // Helper to extract full delivery address & contact details for any order
  const getOrderDeliveryDetails = (order) => {
    if (!order) return null;
    const phone = order.customerPhone || order.customer_phone || '';
    const matchedCustomer = phone ? customerDB.findByPhone(phone) : null;
    const fallbackCustomer = matchedCustomer || currentCustomer || null;

    const name = order.customerName || order.customer_name || fallbackCustomer?.name || 'Customer';
    const building =
      order.deliveryBuildingDetails ||
      order.delivery_building_details ||
      order.buildingDetails ||
      fallbackCustomer?.buildingDetails ||
      fallbackCustomer?.deliveryBuildingDetails ||
      '';
    const address =
      order.deliveryAddress ||
      order.delivery_address ||
      order.address ||
      fallbackCustomer?.deliveryAddress ||
      fallbackCustomer?.address ||
      '';
    const district =
      order.deliveryDistrict ||
      order.delivery_district ||
      order.district ||
      fallbackCustomer?.district ||
      '';
    const area =
      order.deliveryArea ||
      order.delivery_area ||
      order.area ||
      fallbackCustomer?.area ||
      '';
    const landmark =
      order.deliveryLandmark ||
      order.delivery_landmark ||
      order.landmark ||
      fallbackCustomer?.deliveryLandmark ||
      fallbackCustomer?.landmark ||
      '';
    const instructions =
      order.deliveryInstructions ||
      order.delivery_instructions ||
      order.instructions ||
      fallbackCustomer?.deliveryInstructions ||
      '';
    const location =
      order.location ||
      ([area, district].filter(Boolean).join(', ')) ||
      fallbackCustomer?.location ||
      '';

    return {
      name,
      phone,
      building,
      address,
      district,
      area,
      landmark,
      instructions,
      location,
    };
  };

  // 2-second live ticker to drive real-time timers and auto-stage advancement
  const [tickerTime, setTickerTime] = useState(Date.now());
  const [manualOverrides, setManualOverrides] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTime(Date.now());
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Compute status based on employee action or 5-minute food prep rule
  const computeOrderStatus = (order, currentTime, manualStatus) => {
    if (!order) return 'Preparing';
    if (manualStatus) return manualStatus;

    const s = (order.status || '').toLowerCase().trim();
    if (s.includes('cancel')) return 'Cancelled';
    if (s.includes('return')) return 'Returned to Restaurant';

    // If order was explicitly updated by Employee in kitchen
    if (s === 'accepted') return 'Accepted (In Kitchen)';
    if (s === 'food_ready') return 'Food Ready (Packing)';
    if (s === 'packing') return 'Packing Order';
    if (s === 'ready_for_delivery') return 'Out for Delivery';
    if (s === 'arrived') return 'Rider Arrived';
    if (s.includes('out') || s.includes('dispatch')) return 'Out for Delivery';
    if ((s.includes('deliver') && !s.includes('out') && !s.includes('way')) || s.includes('complete') || s === 'done') {
      return 'Delivered';
    }

    const orderDate = getOrderDateObj(order);
    const elapsedMinutes = Math.max(0, (currentTime - orderDate.getTime()) / (60 * 1000));

    // Strict 5-minute food preparation rule
    if (elapsedMinutes >= 15) {
      return 'Delivered';
    } else if (elapsedMinutes >= 5) {
      return 'Out for Delivery';
    } else {
      return order.status || 'Order Placed';
    }
  };

  const effectiveStatus = useMemo(() => {
    if (!activeOrder) return 'Preparing';
    return computeOrderStatus(activeOrder, tickerTime, manualOverrides[activeOrder.id]);
  }, [activeOrder, tickerTime, manualOverrides]);

  const activeStageIndex = useMemo(() => getStageIndex(effectiveStatus), [effectiveStatus]);

  // Stage change handler (for manual fast buttons & step clicks)
  const handleStageChange = async (targetIdx) => {
    if (!activeOrder) return;
    const stageNames = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const newStatus = stageNames[targetIdx] || 'Preparing';

    setManualOverrides((prev) => ({ ...prev, [activeOrder.id]: newStatus }));
    setOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status: newStatus } : o))
    );

    try {
      await orderApi.updateOrderStatus(activeOrder.id, newStatus);
    } catch (err) {
      console.warn('Order status sync warning:', err);
    }
  };

  // Auto-sync status to backend when 5-min prep or 15-min delivery threshold is crossed
  useEffect(() => {
    if (!activeOrder) return;
    const currentBackendStatus = activeOrder.status;
    if (
      effectiveStatus &&
      effectiveStatus !== currentBackendStatus &&
      !manualOverrides[activeOrder.id]
    ) {
      orderApi.updateOrderStatus(activeOrder.id, effectiveStatus).catch(() => {});
      setOrders((prev) =>
        prev.map((o) => (o.id === activeOrder.id ? { ...o, status: effectiveStatus } : o))
      );
    }
  }, [effectiveStatus, activeOrder?.id]);

  const activeBill = useMemo(() => computeBill(activeOrder), [activeOrder]);

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] text-slate-800 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden">
      {/* Subtle Warm Amber/Orange Ambient Glows */}
      <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-orange-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 relative z-10">
        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size="lg" text="Loading your delicious orders..." />
          </div>
        ) : customerOrders.length === 0 ? (
          /* Empty State */
          <div className="bg-[#FFFDF9] border border-[#EAE3D6] rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <EmptyState
              icon={ShoppingBag}
              title="No Orders Found"
              description="You haven't placed any food orders yet. Ready to taste our artisan burgers, loaded pizzas, and creamy shakes?"
              action={
                <button
                  type="button"
                  onClick={() => navigate('/menu')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-white fill-white animate-bounce" />
                  <span>Explore Menu & Order Now</span>
                </button>
              }
            />
          </div>
        ) : (
          <>
            {/* Top Bar (Shown on My Orders view) */}
            {viewMode === 'history' && (
              <div className="flex items-center justify-end pb-1">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200/80 shadow-sm">
                  {customerOrders.length} {customerOrders.length === 1 ? 'Total Order Placed' : 'Total Orders Placed'}
                </span>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 1: MY PREVIOUS ORDERS (ALL ORDER DETAILS)                */}
            {/* ============================================================== */}
            {viewMode === 'history' ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#EAE2D5]">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    My Previous <span className="text-orange-600">Orders</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Complete history of your previous orders, dishes ordered, bills, and instant re-ordering.
                  </p>
                </div>

                <div className="space-y-4">
                  {customerOrders.map((ord) => {
                    const bill = computeBill(ord);
                    return (
                      <div
                        key={ord.id}
                        className="bg-[#FFFDF9] border border-[#EAE3D6] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-row items-center justify-between gap-3 pb-3 border-b border-[#F0E9DC]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-900">
                                Order #{ord.id}
                              </span>
                              {(ord.tokenNo || ord.token_no) && (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-lg border border-amber-200">
                                  Token {ord.tokenNo || ord.token_no}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              {formatOrderDateTime(ord)}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {renderHeaderBadge(ord.status)}
                          </div>
                        </div>

                        {/* Dishes List */}
                        <div className="space-y-1">
                          <div className="divide-y divide-[#F2EBE0]">
                            {ord.items?.map((item, idx) => {
                              const itemImg = getItemImage(item);
                              const subtotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                              return (
                                <div
                                  key={idx}
                                  className="py-2.5 flex items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                      <img
                                        src={itemImg}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src =
                                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <h3 className="text-xs font-bold text-slate-900 truncate">
                                        {item.name}
                                      </h3>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        {item.quantity} × ₹{Number(item.price).toFixed(0)}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-xs font-black text-slate-900 shrink-0">
                                    ₹{subtotal.toFixed(0)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {(() => {
                          const delivery = getOrderDeliveryDetails(ord);
                          if (!delivery || (!delivery.address && !delivery.location && !delivery.building)) return null;

                          return (
                            <div className="p-3.5 bg-[#F9F5EE] rounded-xl border border-[#ECE4D8] flex items-start gap-2.5 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                              <div className="min-w-0 text-slate-600 space-y-1 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    DELIVERY ADDRESS
                                  </span>
                                  {delivery.phone && (
                                    <span className="text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                                      {delivery.phone}
                                    </span>
                                  )}
                                </div>
                                {delivery.building && (
                                  <p className="font-bold text-slate-800 leading-snug">
                                    {delivery.building}
                                  </p>
                                )}
                                {delivery.address && (
                                  <p className="font-bold text-slate-800 leading-snug">
                                    {delivery.address}
                                  </p>
                                )}
                                {delivery.location && (
                                  <p className="text-slate-600 text-[11px] font-semibold">
                                    {delivery.location}
                                  </p>
                                )}
                                {delivery.landmark && (
                                  <p className="text-orange-700 text-[11px] font-medium">
                                    Landmark: <span className="font-bold text-orange-900">{delivery.landmark}</span>
                                  </p>
                                )}
                                {delivery.instructions && (
                                  <p className="text-slate-400 text-[10px] italic">
                                    Instructions: &ldquo;{delivery.instructions}&rdquo;
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Bill Total & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F0E9DC]">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              TOTAL PAID
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-orange-600">
                                ₹{bill.grandTotal.toFixed(2)}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                via {ord.paymentMethod || 'Cash on Delivery'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Track Current Order only if this is the active/latest order */}
                            {ord.id === customerOrders[0]?.id && (
                              <button
                                type="button"
                                onClick={() => setViewMode('track')}
                                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                              >
                                <Clock className="w-3.5 h-3.5 text-white" />
                                <span>Track Current Order</span>
                              </button>
                            )}

                            {/* View Bill */}
                            <button
                              type="button"
                              onClick={() => setActiveReceipt(ord)}
                              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span>View Bill</span>
                            </button>

                            {/* Rate & Review button for completed/delivered orders */}
                            {getStageIndex(ord.status) === 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigate('/menu#reviews');
                                  setTimeout(() => {
                                    window.dispatchEvent(
                                      new CustomEvent('bitepos_open_review_modal', {
                                        detail: {
                                          dish: ord.items?.[0]?.name || '',
                                        },
                                      })
                                    );
                                  }, 150);
                                }}
                                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                                title="Leave a review for this delivered meal"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>Review Food</span>
                              </button>
                            )}

                            {/* Re-Order Dishes */}
                            <button
                              type="button"
                              onClick={() => handleReorder(ord)}
                              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                              <span>Re-Order</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* VIEW 2: LIVE TRACK ORDER (ONLY CURRENT FOOD ORDER DETAILS)     */
              /* ============================================================== */
              <>

                {/* 1. Page Header */}
                <div className="flex flex-row items-center justify-between gap-3 pb-3 border-b border-[#EAE2D5]">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Your <span className="text-orange-600">Order</span>
                    </h1>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-800">
                        Order #{activeOrder.id}
                      </span>
                      <span>•</span>
                      <span>{formatOrderDateTime(activeOrder)}</span>
                      {(activeOrder.tokenNo || activeOrder.token_no) && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline text-amber-800 font-semibold bg-amber-100/90 px-2 py-0.5 rounded-lg border border-amber-200">
                            Token {activeOrder.tokenNo || activeOrder.token_no}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {renderHeaderBadge(effectiveStatus)}
                  </div>
                </div>

                {/* 2. Order Status Progress Tracker with Animated Delivery Motorcycle */}
                <DeliveryMotorcycleTracker
                  activeStageIndex={activeStageIndex}
                  order={{ ...activeOrder, status: effectiveStatus }}
                  onStageSelect={handleStageChange}
                />

                {/* 3. Your Items Section */}
                <div className="bg-[#FFFDF9] border border-[#EAE3D6] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0E9DC]">
                    <h2 className="text-sm font-black text-slate-900 tracking-wide uppercase">
                      Your Items
                    </h2>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeOrder.items?.length || 0} {activeOrder.items?.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="divide-y divide-[#F2EBE0]">
                    {activeOrder.items?.map((item, idx) => {
                      const itemImg = getItemImage(item);
                      const itemSubtotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

                      return (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between gap-3 group first:pt-1 last:pb-1"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Prominent Food Image */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img
                                src={itemImg}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src =
                                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
                                }}
                              />
                            </div>

                            {/* Food Name & Quantity × Price */}
                            <div className="min-w-0">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {item.name}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                {item.quantity} × ₹{Number(item.price).toFixed(0)}
                              </p>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              ₹{itemSubtotal.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Full Delivery Address & Contact Details Section */}
                {(() => {
                  const delivery = getOrderDeliveryDetails(activeOrder);
                  if (!delivery) return null;

                  return (
                    <div className="bg-[#FFFDF9] border border-[#EAE3D6] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0E9DC]">
                        <h2 className="text-sm font-black text-slate-900 tracking-wide uppercase">
                          Delivery Address & Contact
                        </h2>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                          Doorstep Delivery
                        </span>
                      </div>

                      <div className="flex items-start gap-3 pt-1">
                        <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <MapPin className="w-4 h-4" />
                        </div>

                        <div className="space-y-1.5 text-xs flex-1">
                          {/* Recipient Name & Phone Badge */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {delivery.name}
                            </span>
                            {delivery.phone && (
                              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Mobile:</span>
                                <span className="font-black text-slate-900">{delivery.phone}</span>
                              </span>
                            )}
                          </div>

                          {/* Building / Flat / Floor Details */}
                          {delivery.building && (
                            <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                              {delivery.building}
                            </p>
                          )}

                          {/* Complete Street Address */}
                          {delivery.address ? (
                            <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-snug">
                              {delivery.address}
                            </p>
                          ) : (
                            <p className="text-slate-400 italic">No street address provided</p>
                          )}

                          {/* Area & District / Location */}
                          {delivery.location && (
                            <p className="text-slate-600 font-bold text-[11px]">
                              {delivery.location}
                            </p>
                          )}

                          {/* Landmark Highlight */}
                          {delivery.landmark && (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center gap-1 text-orange-800 font-bold text-xs bg-orange-50/80 px-2.5 py-1 rounded-xl border border-orange-200/70">
                                <span className="text-orange-500 font-extrabold">Landmark:</span>
                                <span className="font-extrabold text-orange-950">{delivery.landmark}</span>
                              </span>
                            </div>
                          )}

                          {/* Delivery Instructions */}
                          {delivery.instructions && (
                            <p className="text-slate-500 text-[11px] italic pt-1 border-t border-slate-100 mt-1">
                              Instructions: &ldquo;{delivery.instructions}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 5. Bill Summary Section */}
                <div className="bg-[#FFFDF9] border border-[#EAE3D6] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                  <h2 className="text-sm font-black text-slate-900 tracking-wide uppercase pb-2 border-b border-[#F0E9DC]">
                    Bill Summary
                  </h2>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Item Total</span>
                      <span className="font-bold text-slate-800">₹{activeBill.itemTotal.toFixed(0)}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-slate-800">
                        {activeBill.deliveryFee > 0 ? `₹${activeBill.deliveryFee.toFixed(0)}` : '₹0'}
                      </span>
                    </div>

                    {activeBill.discount > 0 ? (
                      <div className="flex items-center justify-between text-emerald-600 font-bold">
                        <span>Discount</span>
                        <span>-₹{activeBill.discount.toFixed(0)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Discount</span>
                        <span className="font-bold text-slate-400">₹0</span>
                      </div>
                    )}

                    <div className="pt-2.5 border-t border-[#EAE2D5] flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-black text-slate-900 tracking-wider block">
                          Total Paid
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Payment: {activeOrder.paymentMethod || 'Cash on Delivery'}</span>
                        </span>
                      </div>

                      <span className="text-xl sm:text-2xl font-black text-orange-600">
                        ₹{activeBill.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Action Buttons: View Bill, Review & Re-Order Dishes */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {/* Secondary Action: View Bill */}
                  <button
                    type="button"
                    onClick={() => setActiveReceipt(activeOrder)}
                    className="w-full sm:flex-1 py-3 px-5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>View Bill</span>
                  </button>

                  {/* Rate & Review if Delivered */}
                  {activeStageIndex === 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/menu#reviews');
                        setTimeout(() => {
                          window.dispatchEvent(
                            new CustomEvent('bitepos_open_review_modal', {
                              detail: {
                                dish: activeOrder.items?.[0]?.name || '',
                              },
                            })
                          );
                        }, 150);
                      }}
                      className="w-full sm:flex-1 py-3 px-5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold rounded-xl text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>Review Food ⭐</span>
                    </button>
                  )}

                  {/* Primary Action: Re-Order Dishes */}
                  <button
                    type="button"
                    onClick={() => handleReorder(activeOrder)}
                    className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-white stroke-[2.5]" />
                    <span>Re-Order Dishes</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
