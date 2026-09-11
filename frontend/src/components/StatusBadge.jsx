import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const getStyle = (st) => {
    switch (st) {
      case 'PENDING_ASSIGNMENT':
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ASSIGNED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'PICKED_UP':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'IN_TRANSIT':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 animate-pulse';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'DELIVERED':
      case 'VERIFIED':
      case 'PAID':
      case 'AVAILABLE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED':
      case 'REJECTED':
      case 'EXPIRED':
      case 'FAILED':
      case 'OUT_OF_SERVICE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'DELIVERY_FAILED':
      case 'UNDER_MAINTENANCE':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'RETURN_TO_SENDER':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const formatText = (st) => {
    return st.replace(/_/g, ' ');
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle(status)}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />
      {formatText(status)}
    </motion.span>
  );
};

export default StatusBadge;
