import { useState, useRef, useEffect } from 'react'
import {
  ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, XCircle,
  Download, Search, Filter, Calendar as CalendarIcon, ChevronDown
} from 'lucide-react'

// Extended mock dataset
const allTransactions = [
  { id: 'TXN-9021', date: '14 Apr 2026, 11:30 AM', admin: 'Arjun Mehta', type: 'Banner Ad', amount: '₹14,500', status: 'Completed', incoming: true },
  { id: 'TXN-9022', date: '14 Apr 2026, 10:15 AM', admin: 'Priya Sharma', type: 'Video Ad', amount: '₹8,200', status: 'Completed', incoming: true },
  { id: 'TXN-9024', date: '13 Apr 2026, 02:20 PM', admin: 'Sneha Patel', type: 'Thumbnail Ad', amount: '₹3,400', status: 'Failed', incoming: true },
  { id: 'TXN-9025', date: '12 Apr 2026, 09:10 AM', admin: 'Ravi Kumar', type: 'Banner Ad', amount: '₹12,800', status: 'Completed', incoming: true },
  { id: 'TXN-9026', date: '11 Apr 2026, 01:05 PM', admin: 'Neha Gupta', type: 'Sponsored List', amount: '₹22,000', status: 'Completed', incoming: true },
  { id: 'TXN-9027', date: '10 Apr 2026, 05:30 PM', admin: 'Vikram Singh', type: 'Video Ad', amount: '₹16,500', status: 'Completed', incoming: true },
  { id: 'TXN-9029', date: '09 Apr 2026, 03:22 PM', admin: 'Ankit Desai', type: 'Banner Ad', amount: '₹5,600', status: 'Completed', incoming: true },
]

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterDirection, setFilterDirection] = useState('All')

  // Date Calendar state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState('Any Date')
  const [customDate, setCustomDate] = useState('')
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Handle click outside for date picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Simple filtering
  const filteredTx = allTransactions.filter(tx => {
    const matchSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.admin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'All' || tx.status === filterStatus
    const matchType = filterType === 'All' || tx.type === filterType
    let matchDirection = true
    if (filterDirection === 'Incoming') matchDirection = tx.incoming === true
    if (filterDirection === 'Outgoing') matchDirection = tx.incoming === false

    return matchSearch && matchStatus && matchType && matchDirection
  })

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 scroll-animate delay-75">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">All Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Full history of platform revenue and incoming payments
          </p>
        </div>

        <button className="flex items-center justify-center sm:justify-start gap-2 bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-500/30 text-primary-600 dark:text-primary-400
                         px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between relative z-20 scroll-animate delay-150">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm
                     focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400
                     transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Ad Type Filter */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Banner Ad">Banner Ad</option>
              <option value="Video Ad">Video Ad</option>
              <option value="Thumbnail Ad">Thumbnail Ad</option>
              <option value="Sponsored List">Sponsored List</option>
            </select>
          </div>



          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${showDatePicker || dateRange !== 'Any Date'
                  ? 'bg-primary-50 dark:bg-primary-900/40 border-primary-100 dark:border-primary-500/30 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <CalendarIcon size={14} className={showDatePicker || dateRange !== 'Any Date' ? 'text-primary-500' : 'text-gray-400'} />
              {dateRange !== 'Custom' ? dateRange : customDate || 'Select Date'}
              <ChevronDown size={14} className={`transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>

            {/* Date Popover */}
            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-card-hover z-50 p-2 animate-fade-in origin-top-right">
                <div className="flex flex-col gap-1">
                  {['Any Date', 'Today', 'Yesterday', 'Last 7 Days', 'This Month'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range)
                        setCustomDate('')
                        setShowDatePicker(false)
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${dateRange === range && !customDate 
                          ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-semibold' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
                    >
                      {range}
                    </button>
                  ))}

                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2" />

                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Custom Date</p>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value)
                        setDateRange('Custom')
                        setShowDatePicker(false)
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300
                               focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="glass-card flex-1 overflow-hidden flex flex-col p-0 scroll-animate delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 px-6 border-b border-gray-100 dark:border-gray-800">Transaction</th>
                <th className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 px-6 border-b border-gray-100 dark:border-gray-800">Admin</th>
                <th className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 px-6 border-b border-gray-100 dark:border-gray-800">Ad Type</th>
                <th className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 px-6 border-b border-gray-100 dark:border-gray-800 text-right">Amount</th>
                <th className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-4 px-6 border-b border-gray-100 dark:border-gray-800 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-sm">
              {filteredTx.length > 0 ? (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${tx.incoming ? 'bg-green-50 dark:bg-green-900/20 text-green-500' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                          {tx.incoming ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white leading-none">{tx.id}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{tx.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">{tx.admin}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">{tx.type}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-bold ${tx.incoming ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                        {tx.incoming ? '+' : '-'}{tx.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {tx.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-green-100 dark:border-green-800">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                      {tx.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-yellow-100 dark:border-yellow-800">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {tx.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-red-100 dark:border-red-800">
                          <XCircle size={12} /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Mock Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
          <p>Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredTx.length}</span> results</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

    </div>
  )
}
