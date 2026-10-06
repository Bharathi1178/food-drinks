import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, Flame, Bike, Sparkles, Navigation } from 'lucide-react';

const TRACKING_STAGES = [
  { key: 'placed', label: 'Order Placed', icon: CheckCircle2, desc: 'Confirmed by kitchen' },
  { key: 'preparing', label: 'Preparing', icon: Flame, desc: 'Cooking fresh & hot' },
  { key: 'delivery', label: 'Out for Delivery', icon: Bike, desc: 'On the way to you' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy your meal!' },
];

export default function DeliveryMotorcycleTracker({
  activeStageIndex = 0,
  order = null,
  onStageSelect = null,
}) {
  // Smooth animated motorcycle travel position (0 to 3)
  const [motorcyclePos, setMotorcyclePos] = useState(0);
  const [isDriving, setIsDriving] = useState(false);
  const [nowSec, setNowSec] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const t = setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const getOrderTimestampSec = () => {
    if (!order) return Math.floor(Date.now() / 1000);
    const raw = order.created_at || order.createdAt;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
    }
    if (order.date) {
      const timeStr = order.time ? ` ${order.time}` : ' 12:00 PM';
      const d = new Date(`${order.date}${timeStr}`);
      if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
    }
    return Math.floor(Date.now() / 1000);
  };

  const elapsedSec = Math.max(0, nowSec - getOrderTimestampSec());
  const prepTotalSec = 300; // 5 minutes food preparation rule = 300 seconds
  const remainingPrepSec = Math.max(0, prepTotalSec - elapsedSec);
  const prepMins = Math.floor(remainingPrepSec / 60);
  const prepSecs = remainingPrepSec % 60;
  const prepCountdownStr = `${prepMins}:${prepSecs < 10 ? '0' : ''}${prepSecs}`;

  // When activeStageIndex changes, animate motorcycle driving to the target stage
  useEffect(() => {
    const target = Math.max(0, Math.min(3, activeStageIndex));
    setIsDriving(true);
    
    // Smooth stepping towards target stage
    const timer = setTimeout(() => {
      setMotorcyclePos(target);
    }, 100);

    const driveDoneTimer = setTimeout(() => {
      // Keep driving animation active if currently out for delivery
      if (target !== 2) {
        setIsDriving(false);
      }
    }, 1600);

    return () => {
      clearTimeout(timer);
      clearTimeout(driveDoneTimer);
    };
  }, [activeStageIndex]);

  // If in 'Out for Delivery' (stage 2), motorcycle is actively cruising!
  const isOutForDelivery = activeStageIndex === 2;
  const isDelivered = activeStageIndex === 3;
  const isMoving = isDriving || isOutForDelivery;

  // Percentage along the span between first node (12.5%) and last node (87.5%)
  // Math: 12.5% + (motorcyclePos / 3) * 75%
  const bikePercent = 12.5 + (Math.max(0, Math.min(3, motorcyclePos)) / 3) * 75;
  const linePercent = (Math.max(0, Math.min(3, motorcyclePos)) / 3) * 100;

  return (
    <div className="bg-[#FFFDF9] border border-[#EAE3D6] rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden relative">
      {/* Background road ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-72 h-16 bg-amber-400/10 blur-2xl pointer-events-none -translate-y-1/2" />

      {/* Main Track Section */}
      <div className="relative pt-12 pb-2 px-1 sm:px-2">
        {/* The Road / Track Line Container (12.5% to 87.5%) */}
        <div className="absolute top-[76px] sm:top-[80px] left-[12.5%] right-[12.5%] h-1.5 z-0">
          {/* Base Unfilled Road Line */}
          <div className="w-full h-full bg-slate-200/90 rounded-full" />

          {/* Active Completed Road Line with Glowing Orange Gradient */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all duration-1000 ease-out"
            style={{ width: `${linePercent}%` }}
          />

          {/* Animated road dashes effect when motorcycle is actively on the road */}
          {isOutForDelivery && (
            <div
              className="absolute top-0 left-0 h-full rounded-full animate-road-move opacity-40 pointer-events-none"
              style={{
                width: `${linePercent}%`,
                backgroundImage:
                  'repeating-linear-gradient(90deg, #fff 0, #fff 6px, transparent 6px, transparent 14px)',
              }}
            />
          )}
        </div>

        {/* ======================================================== */}
        {/* ANIMATED TRAVELLING DELIVERY MOTORCYCLE                  */}
        {/* ======================================================== */}
        <div
          className="absolute z-20 pointer-events-none select-none transition-all duration-1000 ease-out"
          style={{
            left: `${bikePercent}%`,
            top: '20px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Express Delivery Floating Tag */}
            <div
              className={`px-2 py-0.5 mb-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border transition-all ${
                isDelivered
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
                  : isOutForDelivery
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-orange-500/30 animate-pulse'
                  : 'bg-white/95 text-slate-700 border-amber-200'
              }`}
            >
              {isDelivered ? (
                <>
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Arrived!</span>
                </>
              ) : isOutForDelivery ? (
                <>
                  <Navigation className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>En Route</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>BiteCraze Rider</span>
                </>
              )}
            </div>

            {/* Motorcycle & Rider SVG Container */}
            <div className={`relative ${isMoving ? 'animate-bike-bounce' : ''}`}>
              {/* Headlight beam projection */}
              <div
                className={`absolute right-[-24px] top-[18px] w-8 h-4 bg-gradient-to-r from-amber-300/60 to-transparent rounded-r-full blur-[2px] pointer-events-none transition-opacity ${
                  isMoving ? 'opacity-100 animate-headlight' : 'opacity-0'
                }`}
                style={{ clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 70%)' }}
              />

              {/* Speed Wind Lines Behind Bike */}
              {isMoving && (
                <div className="absolute left-[-18px] top-[14px] flex flex-col gap-1 pointer-events-none opacity-70">
                  <div className="w-4 h-[1.5px] bg-gradient-to-l from-orange-400 to-transparent rounded-full animate-pulse" />
                  <div className="w-6 h-[1.5px] bg-gradient-to-l from-amber-400 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <div className="w-3 h-[1.5px] bg-gradient-to-l from-orange-300 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              )}

              {/* Exhaust Puffs */}
              {isMoving && (
                <div className="absolute left-[-4px] bottom-[6px] pointer-events-none">
                  <span className="absolute w-2 h-2 rounded-full bg-slate-400/50 animate-exhaust-1" />
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-400/40 animate-exhaust-2" />
                </div>
              )}

              {/* SVG Motorcycle Illustration */}
              <svg
                width="64"
                height="44"
                viewBox="0 0 64 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md"
              >
                {/* Rider Helmet */}
                <ellipse cx="26" cy="11" rx="5.5" ry="6" fill="#F97316" />
                {/* Helmet visor */}
                <path
                  d="M27.5 10.5 C29.5 10.5, 31 11.5, 31.5 13 L27 13.5 Z"
                  fill="#1E293B"
                />
                {/* Helmet white highlight */}
                <path
                  d="M23 8 C25 6.5, 28 6.5, 29.5 7.5"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeLinecap="round"
                />

                {/* Rider Body / Jacket */}
                <path
                  d="M22 17 C22 17, 25 15, 28 17 L34 23 C34 23, 31 25, 25 25 L21 21 Z"
                  fill="#334155"
                />
                {/* Rider arm reaching to handlebars */}
                <path
                  d="M27 18 L36 21"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Delivery Box (BiteCraze Insulated Box) */}
                <rect
                  x="7"
                  y="12"
                  width="13"
                  height="13"
                  rx="2.5"
                  fill="#EA580C"
                  stroke="#C2410C"
                  strokeWidth="1"
                />
                {/* Delivery Box Handle & White Logo stripe */}
                <line x1="9" y1="18.5" x2="18" y2="18.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="11.5" y="10" width="4" height="2" rx="0.5" fill="#9A3412" />

                {/* Steam puffs from hot food box */}
                <path
                  d="M11 9 C11 7.5, 12 7, 12 5.5"
                  stroke="#FDBA74"
                  strokeWidth="1"
                  strokeLinecap="round"
                  className={isMoving ? 'animate-pulse' : ''}
                />
                <path
                  d="M15 9.5 C15 8, 16 7.5, 16 6"
                  stroke="#FDBA74"
                  strokeWidth="1"
                  strokeLinecap="round"
                  className={isMoving ? 'animate-pulse' : ''}
                  style={{ animationDelay: '0.2s' }}
                />

                {/* Motorcycle Frame & Body */}
                <path
                  d="M18 24 L26 24 L36 21 L43 27 L33 28 L23 27 Z"
                  fill="#EA580C"
                />
                {/* Metal Chassis / Engine */}
                <rect x="23" y="27" width="9" height="5" rx="1.5" fill="#475569" />
                {/* Exhaust Pipe */}
                <path
                  d="M24 30 L16 30 L13 28"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Steering column and Handlebar */}
                <line x1="36" y1="21" x2="42" y2="30" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M34 19 L38 21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

                {/* Front Headlight */}
                <circle cx="43.5" cy="24.5" r="2.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" />

                {/* REAR WHEEL */}
                <g className={isMoving ? 'animate-bike-wheel' : ''} style={{ transformOrigin: '15px 33px' }}>
                  {/* Tire */}
                  <circle cx="15" cy="33" r="7.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                  {/* Rim */}
                  <circle cx="15" cy="33" r="4.5" fill="#94A3B8" />
                  {/* Hub */}
                  <circle cx="15" cy="33" r="2" fill="#334155" />
                  {/* Spokes */}
                  <line x1="15" y1="26" x2="15" y2="40" stroke="#E2E8F0" strokeWidth="0.8" />
                  <line x1="8" y1="33" x2="22" y2="33" stroke="#E2E8F0" strokeWidth="0.8" />
                </g>

                {/* FRONT WHEEL */}
                <g className={isMoving ? 'animate-bike-wheel' : ''} style={{ transformOrigin: '44px 33px' }}>
                  {/* Tire */}
                  <circle cx="44" cy="33" r="7.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                  {/* Rim */}
                  <circle cx="44" cy="33" r="4.5" fill="#94A3B8" />
                  {/* Hub */}
                  <circle cx="44" cy="33" r="2" fill="#334155" />
                  {/* Spokes */}
                  <line x1="44" y1="26" x2="44" y2="40" stroke="#E2E8F0" strokeWidth="0.8" />
                  <line x1="37" y1="33" x2="51" y2="33" stroke="#E2E8F0" strokeWidth="0.8" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4 TRACKING STAGE NODES (Exact visual match to screenshot) */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between relative z-10">
          {TRACKING_STAGES.map((stage, idx) => {
            const isCompleted = activeStageIndex > idx;
            const isCurrent = activeStageIndex === idx;
            const StageIcon = stage.icon;

            return (
              <div
                key={stage.key}
                onClick={() => onStageSelect && onStageSelect(idx)}
                className={`flex flex-col items-center text-center flex-1 transition-all ${
                  onStageSelect ? 'cursor-pointer hover:opacity-90' : ''
                }`}
              >
                {/* Node Circle */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-4 ring-orange-500/25 shadow-lg shadow-orange-500/30 font-black scale-110'
                      : isCompleted
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] text-white" />
                  ) : isCurrent ? (
                    <StageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                  ) : (
                    <StageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  )}
                </div>

                {/* Node Label */}
                <span
                  className={`mt-2.5 text-[11px] sm:text-xs tracking-tight transition-colors line-clamp-1 ${
                    isCurrent
                      ? 'text-orange-600 font-black'
                      : isCompleted
                      ? 'text-slate-800 font-bold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  {stage.label}
                </span>

                {/* Subtle Subtitle for Current Stage */}
                <span className="hidden sm:block text-[10px] text-slate-400 mt-0.5">
                  {stage.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Delivery Status Banner & Fast Action Controls */}
      <div className="mt-4 pt-3 border-t border-[#F0E9DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping shrink-0" />
          <div className="text-slate-700 font-medium">
            {activeStageIndex === 3 ? (
              <span className="text-emerald-800 font-bold flex items-center gap-2 flex-wrap">
                <span>🎉 Your order has been delivered! Bon appétit!</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] border border-emerald-200">
                  <Check className="w-3 h-3 stroke-[3]" /> Delivered
                </span>
              </span>
            ) : activeStageIndex === 2 ? (
              <span className="text-orange-900 font-bold flex items-center gap-2 flex-wrap">
                <span>🛵 Delivery rider is on the way cruising to your doorstep!</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-black text-[10px] border border-sky-200">
                  <Bike className="w-3 h-3 text-sky-600 animate-bounce" /> Out for Delivery (~10 mins)
                </span>
              </span>
            ) : activeStageIndex === 1 ? (
              <span className="text-amber-950 font-bold flex items-center gap-2 flex-wrap">
                <span>👨‍🍳 Fresh cooking in kitchen:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-black text-[10px] border border-orange-200 shadow-xs">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" />
                  {remainingPrepSec > 0 ? `${prepCountdownStr} left of 5 min prep` : 'Prep done! Ready for rider'}
                </span>
                <span className="text-slate-500 text-[11px] font-medium hidden md:inline">
                  • Dispatches automatically after 5 mins
                </span>
              </span>
            ) : (
              <span className="text-slate-700 font-medium">
                📝 Order verified and queued for preparation.
              </span>
            )}
          </div>
        </div>

        {/* Live action controls & fast forward buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {activeStageIndex <= 1 && onStageSelect && (
            <button
              type="button"
              onClick={() => onStageSelect(2)}
              className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Dispatch order out for delivery"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Out for Delivery 🛵</span>
            </button>
          )}

          {activeStageIndex === 2 && onStageSelect && (
            <button
              type="button"
              onClick={() => onStageSelect(3)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Complete and mark order delivered"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark Delivered ✅</span>
            </button>
          )}

          {activeStageIndex === 3 && onStageSelect && (
            <button
              type="button"
              onClick={() => onStageSelect(1)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer border border-slate-200"
              title="Reset order to preparing stage"
            >
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Test Prep 🔄</span>
            </button>
          )}

          {activeStageIndex === 2 && (
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 px-2.5 py-1 rounded-full font-bold text-[11px]">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>Cruising Live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
