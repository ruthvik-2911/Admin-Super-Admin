import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Filter, CalendarDays, Download, Shield, FileText, Settings, Users, Monitor, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react'

// ─── Types & Mock Data ─────────────────────────────────────────────
type LogCategory = 'Security' | 'Content' | 'System' | 'Users' | 'All'

interface AuditLog {
  id: string
  adminName: string
  adminEmail: string
  action: string
  category: LogCategory
  ip: string
  timestamp: string
}

const MOCK_LOGS: AuditLog[] = [
  { id: 'LOG-8991', adminName: 'System Operator', adminEmail: 'admin@keliri.com', action: 'Approved Ad Campaign #1092', category: 'Content', ip: '192.168.1.45', timestamp: '2026-04-14T14:15:21' },
  { id: 'LOG-8990', adminName: 'Arjun M.', adminEmail: 'arjun@keliri.com', action: 'Suspended Publisher "Vidya Media"', category: 'Users', ip: '10.0.0.2', timestamp: '2026-04-14T11:05:00' },
  { id: 'LOG-8989', adminName: 'System Operator', adminEmail: 'admin@keliri.com', action: 'Updated Global Revenue Share configuration to 15%', category: 'System', ip: '192.168.1.45', timestamp: '2026-04-13T09:44:11' },
  { id: 'LOG-8988', adminName: 'Priya K.', adminEmail: 'priya@keliri.com', action: 'Failed login attempt (Invalid Password)', category: 'Security', ip: '45.22.11.90', timestamp: '2026-04-13T08:30:00' },
  { id: 'LOG-8987', adminName: 'System Operator', adminEmail: 'admin@keliri.com', action: 'Created Sub-Admin account for "Arjun M."', category: 'Users', ip: '192.168.1.45', timestamp: '2026-04-12T16:22:15' },
  { id: 'LOG-8986', adminName: 'Arjun M.', adminEmail: 'arjun@keliri.com', action: 'Logged in securely via 2FA', category: 'Security', ip: '10.0.0.2', timestamp: '2026-04-12T16:25:01' },
  { id: 'LOG-8985', adminName: 'System Operator', adminEmail: 'admin@keliri.com', action: 'Rejected Ad Campaign #1088 (Violation: Graphic Content)', category: 'Content', ip: '192.168.1.45', timestamp: '2026-04-12T14:10:00' },
  // ... extra dummy logs for pagination testing
]

Array.from({ length: 45 }).forEach((_, i) => {
  MOCK_LOGS.push({
    id: `LOG-80${i}`,
    adminName: i % 3 === 0 ? 'Priya K.' : 'Arjun M.',
    adminEmail: i % 3 === 0 ? 'priya@keliri.com' : 'arjun@keliri.com',
    action: `System automated backup sequence #${1000 + i}`,
    category: 'System',
    ip: '127.0.0.1',
    timestamp: new Date(Date.now() - i * 10000000).toISOString(),
  })
})

const getCategoryBadge = (category: LogCategory) => {
  switch (category) {
    case 'Security': return <span className="badge-primary px-2.5 py-0.5"><Shield size={12} className="mr-1" /> Security</span>
    case 'Content': return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center w-max"><FileText size={12} className="mr-1" /> Content</span>
    case 'System': return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800 flex items-center w-max"><Settings size={12} className="mr-1" /> System</span>
    case 'Users': return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800 flex items-center w-max"><Users size={12} className="mr-1" /> Users</span>
    default: return null
  }
}

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<LogCategory>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Close custom dropdowns on outside click
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Derived state
  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchSearch = 
        log.adminName.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.includes(search) ||
        log.id.toLowerCase().includes(search.toLowerCase())
      
      const matchCategory = filterCategory === 'All' || log.category === filterCategory

      return matchSearch && matchCategory
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [search, filterCategory])

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 scroll-animate delay-75 relative z-30">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Audit Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Immutable system-wide activity monitoring.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm">
          <Download size={16} /> Export Logs (CSV)
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between relative z-20 scroll-animate delay-150">
        <div className="flex items-center w-full gap-4 flex-col sm:flex-row">
          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, IP, or Admin..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-700 dark:text-gray-300 placeholder:font-normal"
            />
          </div>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

          {/* Custom Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              <Filter size={16} className="text-gray-400" />
              {filterCategory === 'All' ? 'All Categories' : filterCategory}
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in" style={{ animationDuration: '0.15s' }}>
                <div className="p-1">
                  {(['All', 'Security', 'Content', 'System', 'Users'] as LogCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setFilterCategory(cat); setShowCategoryDropdown(false); setCurrentPage(1) }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filterCategory === cat ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 font-medium'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Active Filters Summary ── */}
      {(search || filterCategory !== 'All') && (
        <div className="flex items-center gap-2 scroll-animate delay-200">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Query: "{search}"
              <button onClick={() => setSearch('')} className="hover:text-red-500 dark:hover:text-red-400"><X size={12} /></button>
            </span>
          )}
          {filterCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Category: {filterCategory}
              <button onClick={() => setFilterCategory('All')} className="hover:text-red-500 dark:hover:text-red-400"><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      {/* ── Data Table ── */}
      <div className="glass-card flex-1 overflow-hidden flex flex-col p-0 scroll-animate delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">Log Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">Administrator</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">Action Description</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">Source IP</th>
              </tr>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => {
                  const dateObj = new Date(log.timestamp)
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                            {log.adminName.substring(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">{log.adminName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{log.adminEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(log.category)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-md">
                          {log.action}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                          {log.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium font-mono">
                          <Monitor size={12} className="text-gray-400 dark:text-gray-500" />
                          {log.ip}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-600">
                      <Search size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No logs found</p>
                      <p className="text-xs mt-1 dark:text-gray-400">Try adjusting your active filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Showing <span className="text-gray-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of <span className="text-gray-900 dark:text-white">{filteredLogs.length}</span> logs
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="px-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
