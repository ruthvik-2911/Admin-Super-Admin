import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle, BarChart3 } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { fetchAnalytics, exportAnalyticsCSV, type AnalyticsData, type AnalyticsFilters as IFilters } from "../../services/analytics"
import { AnalyticsFilters } from "../../components/analytics/AnalyticsFilters"
import { KpiGrid } from "../../components/analytics/KpiGrid"
import { ChartsContainer } from "../../components/analytics/ChartsContainer"
import { AnalyticsInsights } from "../../components/analytics/AnalyticsInsights"

export default function AnalyticsDashboard() {
  const [filters, setFilters] = React.useState<IFilters>({
    dateRange: "Last 7 Days",
    adId: "All",
    publisherId: "All",
    adType: "All",
    status: "All"
  })

  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchAnalytics(filters)
      setData(res)
    } catch (err) {
      toast.error("Failed to sync analytics engine")
    } finally {
      setLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleReset = () => {
    setFilters({
      dateRange: "Last 7 Days",
      adId: "All",
      publisherId: "All",
      adType: "All",
      status: "All"
    })
    toast.success("Filters cleared")
  }

  const handleExport = () => {
    if (!data) return
    exportAnalyticsCSV(data)
    toast.success("Analytics exported successfully")
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <AnalyticsFilters 
          filters={filters}
          setFilters={setFilters}
          onReset={handleReset}
          onExport={handleExport}
        />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[60vh] flex flex-col items-center justify-center gap-4"
          >
             <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
             <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Syncing Performance Data...</p>
          </motion.div>
        ) : data ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-20"
          >
            <KpiGrid data={data.kpis} />
            <ChartsContainer data={data.trends} breakdowns={data.breakdowns} />
            <AnalyticsInsights data={data} />
            
            {/* Footer Trust */}
            <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex justify-center">
               <div className="flex items-center gap-3 text-gray-400 bg-white dark:bg-[#1A1D24] px-6 py-3 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Grade Data Accuracy Guaranteed</span>
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-[60vh] flex items-center justify-center">
            <p className="text-gray-500 italic">No analytics data found for the current selection.</p>
          </div>
        )}
      </AnimatePresence>
      </div>
    </>
  )
}
