import * as React from "react"
import { Search, RefreshCw, Calendar, ChevronDown, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AdsFiltersProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  statusFilter: string[]
  setStatusFilter: (v: string[]) => void
  publisherFilter: string
  setPublisherFilter: (v: string) => void
  dateFilterMode: string
  setDateFilterMode: (v: string) => void
  customDateRange: { start: string; end: string }
  setCustomDateRange: (v: { start: string; end: string }) => void
  publishersList: string[]
}

const STATUS_OPTIONS = ["Active", "Pending", "Expired"]
const DATE_OPTIONS = ["All Time", "Today", "Last 7 days", "Last 30 days", "Custom Range"]

export function AdsFilters({
  searchTerm, setSearchTerm,
  statusFilter, setStatusFilter,
  publisherFilter, setPublisherFilter,
  dateFilterMode, setDateFilterMode,
  customDateRange, setCustomDateRange,
  publishersList
}: AdsFiltersProps) {
  
  const [localSearch, setLocalSearch] = React.useState(searchTerm)
  const [showAdvanceFilters, setShowAdvanceFilters] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch)
    }, 400)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchTerm])

  const handleReset = () => {
    setLocalSearch("")
    setSearchTerm("")
    setStatusFilter([])
    setPublisherFilter("All")
    setDateFilterMode("All Time")
    setCustomDateRange({ start: "", end: "" })
  }

  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        {/* Unified Search & Multi-Status Pills */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#1A1D24] p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search campaigns..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0E1117] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            />
          </div>
          
          <div className="hidden md:block w-px h-8 bg-gray-100 dark:bg-gray-800 mx-1" />

          {/* Status Pills */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setStatusFilter([])}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                statusFilter.length === 0 
                  ? "bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900" 
                  : "bg-transparent border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              All
            </button>
            {STATUS_OPTIONS.map(status => {
              const isActive = statusFilter.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                    isActive 
                      ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20" 
                      : "bg-transparent border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {status}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowAdvanceFilters(!showAdvanceFilters)}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
               showAdvanceFilters 
                ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 border-primary-200 dark:border-primary-500/20" 
                : "bg-white dark:bg-[#1A1D24] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"
             }`}
           >
             <Filter className="w-4 h-4" />
             Filters
             <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanceFilters ? "rotate-180" : ""}`} />
           </button>

           <button 
              onClick={handleReset}
              className="p-3 bg-white dark:bg-[#1A1D24] text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-800 rounded-xl transition-all"
              title="Reset All"
            >
              <RefreshCw className="w-4 h-4" />
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdvanceFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 dark:bg-[#1A1D24]/30 p-5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
               {/* Publisher Filter */}
               <div className="space-y-1.5 min-w-[200px]">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Publisher</label>
                 <select 
                    value={publisherFilter}
                    onChange={(e) => setPublisherFilter(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E1117] border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20"
                 >
                    <option value="All">All Network Branches</option>
                    {publishersList.map(pub => <option key={pub} value={pub}>{pub}</option>)}
                 </select>
               </div>

               {/* Date Mode */}
               <div className="space-y-1.5 min-w-[200px]">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Date Range</label>
                 <div className="relative">
                   <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                   <select 
                      value={dateFilterMode}
                      onChange={(e) => setDateFilterMode(e.target.value)}
                      className="w-full bg-white dark:bg-[#0E1117] border border-gray-100 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none"
                   >
                      {DATE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                 </div>
               </div>

               {/* Custom Picker */}
               {dateFilterMode === "Custom Range" && (
                 <div className="space-y-1.5 flex-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Start & End Selection</label>
                   <div className="flex items-center gap-2 bg-white dark:bg-[#0E1117] border border-gray-100 dark:border-gray-800 rounded-xl px-2">
                      <input 
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="bg-transparent text-xs font-bold w-full outline-none p-2 dark:text-white dark:[color-scheme:dark]"
                      />
                      <span className="text-gray-300 font-bold">-</span>
                      <input 
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                        className="bg-transparent text-xs font-bold w-full outline-none p-2 dark:text-white dark:[color-scheme:dark]"
                      />
                   </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
