import React from 'react';
import { Clock, ChefHat, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

export default function OrderStatusBadge({ status }) {
  const configs = {
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      label: 'Pending',
    },
    Preparing: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: ChefHat,
      label: 'Preparing',
    },
    Ready: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: CheckCircle2,
      label: 'Ready to Serve',
    },
    Completed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCheck,
      label: 'Completed',
    },
    Cancelled: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      label: 'Cancelled',
    },
  };

  const config = configs[status] || configs.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
