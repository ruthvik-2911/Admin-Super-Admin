
import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 glow-success', dot: 'bg-emerald-500' };
      case 'pending':
        return { style: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20', dot: 'bg-amber-500' };
      case 'rejected':
        return { style: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20', dot: 'bg-rose-500' };
      case 'suspended':
        return { style: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20 glow-warning', dot: 'bg-orange-500' };
      case 'inactive':
        return { style: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' };
      case 'expired':
        return { style: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20', dot: 'bg-indigo-500' };
      case 'draft':
        return { style: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-300' };
      
      /* Ticket Statuses */
      case 'open':
        return { style: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20 glow-info', dot: 'bg-blue-500' };
      case 'in progress':
        return { style: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20', dot: 'bg-indigo-500' };
      case 'resolved':
        return { style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 glow-success', dot: 'bg-emerald-500' };
      case 'closed':
        return { style: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' };

      /* Priorities */
      case 'urgent':
        return { style: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 shadow-sm shadow-rose-100 dark:shadow-none', dot: 'bg-rose-600 animate-pulse' };
      case 'high':
        return { style: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20', dot: 'bg-orange-500' };
      case 'medium':
        return { style: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20', dot: 'bg-amber-500' };
      case 'low':
        return { style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20', dot: 'bg-emerald-500' };

      default:
        return { style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${config.style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status?.toLowerCase() === 'active' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
