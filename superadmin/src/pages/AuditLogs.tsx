import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Download,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Shield,
  FileText,
  Wallet,
  LogIn,
  BadgeCheck,
} from 'lucide-react';
import { fetchAuditLogs } from '../lib/management';
import type { AuditLogRecord } from '../lib/management';

type ActionType = 'Ad Creation' | 'Ad Update' | 'Payment' | 'Login' | 'Approval';
type ActorRole = 'Super Admin' | 'Admin' | 'Publisher';
type EntityType = 'Ad' | 'Payment' | 'Account' | 'Session';

const getActionBadge = (actionType: string) => {
  if (actionType === 'Ad Creation') {
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center w-max">
        <FileText size={12} className="mr-1" /> Ad Creation
      </span>
    );
  }

  if (actionType === 'Ad Update') {
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center w-max">
        <FileText size={12} className="mr-1" /> Ad Update
      </span>
    );
  }

  if (actionType === 'Payment') {
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center w-max">
        <Wallet size={12} className="mr-1" /> Payment
      </span>
    );
  }

  if (actionType === 'Login') {
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 flex items-center w-max">
        <LogIn size={12} className="mr-1" /> Login
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100 flex items-center w-max">
      <BadgeCheck size={12} className="mr-1" /> Approval
    </span>
  );
};

const escapeCsv = (value: string) => `"${String(value).replaceAll('"', '""')}"`;

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState<ActionType | ''>('');
  const [actorRole, setActorRole] = useState<ActorRole | ''>('');
  const [entityType, setEntityType] = useState<EntityType | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAuditLogs({
          search: search || undefined,
          actionType: actionType || undefined,
          actorRole: actorRole || undefined,
          entityType: entityType || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        });
        setLogs(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [search, actionType, actorRole, entityType, fromDate, toDate]);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = useMemo(
    () => logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [logs, currentPage],
  );

  useEffect(() => {
    if (currentPage > 1 && currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const activeFiltersCount = [search, actionType, actorRole, entityType, fromDate, toDate].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setActionType('');
    setActorRole('');
    setEntityType('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };

  const exportCsv = () => {
    const header = ['Log ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action Type', 'Entity Type', 'Entity ID', 'Action', 'IP'];
    const rows = logs.map((log) => ([
      log.id,
      log.timestamp,
      log.actorName,
      log.actorRole,
      log.actionType,
      log.entityType,
      log.entityId,
      log.action,
      log.ip,
    ].map((value) => escapeCsv(String(value))).join(',')));

    const csv = [header.map((column) => escapeCsv(column)).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 relative z-30">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Read-only audit trail of ads, payments, logins, and approvals.</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <Download size={16} /> Export Logs (CSV)
        </button>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search actor, action, id, ip..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <select value={actionType} onChange={(e) => { setActionType(e.target.value as ActionType | ''); setCurrentPage(1); }} className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none">
            <option value="">All Action Types</option>
            <option value="Ad Creation">Ad Creation</option>
            <option value="Ad Update">Ad Update</option>
            <option value="Payment">Payment</option>
            <option value="Login">Login</option>
            <option value="Approval">Approval</option>
          </select>

          <select value={actorRole} onChange={(e) => { setActorRole(e.target.value as ActorRole | ''); setCurrentPage(1); }} className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none">
            <option value="">All Actors</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Publisher">Publisher</option>
          </select>

          <select value={entityType} onChange={(e) => { setEntityType(e.target.value as EntityType | ''); setCurrentPage(1); }} className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none">
            <option value="">All Entities</option>
            <option value="Ad">Ad</option>
            <option value="Payment">Payment</option>
            <option value="Account">Account</option>
            <option value="Session">Session</option>
          </select>

          <div className="flex items-center gap-2 xl:col-span-1">
            <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
            <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <Shield size={14} className="text-primary-500" />
            Immutable logs: entries cannot be edited or deleted.
          </div>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-200">
              <Filter size={12} /> Clear Filters <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="glass-card flex-1 overflow-hidden flex flex-col p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Actor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Action Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Entity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-56" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                  </tr>
                ))
              ) : paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{log.actorName}</div>
                        <div className="text-xs text-gray-500">{log.actorRole}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getActionBadge(log.actionType)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-700">{log.entityType}</div>
                        <div className="text-xs text-gray-500">{log.entityId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-700">{log.action}</div>
                        <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">{log.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium font-mono">
                          {log.ip}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search size={40} className="text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-900">No logs found</p>
                      <p className="text-xs mt-1">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              Showing <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, logs.length)}</span> of <span className="text-gray-900">{logs.length}</span> logs
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="px-3 text-xs font-bold text-gray-700">Page {currentPage} of {totalPages}</div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
