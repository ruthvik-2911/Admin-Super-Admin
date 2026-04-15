import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Bell, ChevronDown, Moon, Sun, Loader2 } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'

import { AdsFilters } from "../../components/ads/AdsFilters"
import { AdsTable } from "../../components/ads/AdsTable"
import { Modal } from "../../components/ui/Modal"

import { 
  fetchAds, publishAd, duplicateAd, archiveAd,
  type Advertisement 
} from "../../services/ads"

export default function AdsList() {
  const navigate = useNavigate()
  const [data, setData] = React.useState<Advertisement[]>([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [publishersList, setPublishersList] = React.useState<string[]>([])
  
  // Filters State
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [publisherFilter, setPublisherFilter] = React.useState("All")
  const [dateFilterMode, setDateFilterMode] = React.useState("All Time")
  const [customDateRange, setCustomDateRange] = React.useState({ start: "", end: "" })
  
  // Pagination State
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedAd, setSelectedAd] = React.useState<{id: string, title: string} | null>(null)
  const [isArchiving, setIsArchiving] = React.useState(false)

  // Layout State
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Calculate generic date ranges
  const getDateRangeParams = () => {
    if (dateFilterMode === "All Time") return undefined
    
    const end = new Date()
    const start = new Date()
    
    if (dateFilterMode === "Today") {
      start.setHours(0, 0, 0, 0)
    } else if (dateFilterMode === "Last 7 days") {
      start.setDate(start.getDate() - 7)
    } else if (dateFilterMode === "Last 30 days") {
      start.setDate(start.getDate() - 30)
    } else if (dateFilterMode === "Custom Range") {
      if (!customDateRange.start && !customDateRange.end) return undefined
      return { 
        start: customDateRange.start || undefined, 
        end: customDateRange.end || undefined 
      }
    }
    
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0]
    }
  }

  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetchAds({ 
        page, 
        limit, 
        search: searchTerm, 
        status: statusFilter,
        publisher: publisherFilter,
        dateRange: getDateRangeParams()
      })
      setData(response.data)
      setTotalItems(response.totalItems)
      setPublishersList(response.uniquePublishers)
    } catch (error) {
      toast.error("Failed to load advertisements")
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchTerm, statusFilter, publisherFilter, dateFilterMode, customDateRange])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, publisherFilter, dateFilterMode, customDateRange])


  // Handlers
  const handleView = (id: string) => {
    toast(`Looking into Ad ${id}`, { icon: '👁️' })
  }

  const handleEdit = (id: string) => {
    navigate(`/admin/ads/${id}/edit`)
  }

  const handlePublish = (id: string, title: string) => {
    navigate(`/admin/ads/${id}/publish`)
  }

  const handleDuplicate = async (id: string, title: string) => {
    const promise = duplicateAd(id).then(() => loadData())
    toast.promise(promise, {
      loading: 'Duplicating payload...',
      success: `Created copy of "${title}"`,
      error: 'Failed to duplicate ad'
    })
  }

  const requestArchive = (id: string, title: string) => {
    setSelectedAd({ id, title })
    setIsModalOpen(true)
  }

  const confirmArchive = async () => {
    if (!selectedAd) return
    setIsArchiving(true)
    try {
      await archiveAd(selectedAd.id)
      toast.success(`Ad "${selectedAd.title}" has been archived`)
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      toast.error("Failed to archive ad")
    } finally {
      setIsArchiving(false)
      setSelectedAd(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] transition-colors duration-200">
      <Toaster position="top-right" />
      
      

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Advertisements</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
              Manage and monitor all your global ad campaigns from this unified datagrid.
            </p>
          </div>
          
          <button 
             onClick={() => navigate("/admin/ads/new")}
             className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-sm shadow-brand-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create New Ad
          </button>
        </div>

        {/* Dynamic Filters Component */}
        <AdsFilters 
           searchTerm={searchTerm} setSearchTerm={setSearchTerm}
           statusFilter={statusFilter} setStatusFilter={setStatusFilter}
           publisherFilter={publisherFilter} setPublisherFilter={setPublisherFilter}
           dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
           customDateRange={customDateRange} setCustomDateRange={setCustomDateRange}
           publishersList={publishersList}
        />

        {/* Dynamic Data Grid */}
        <AdsTable 
          data={data}
          loading={loading}
          totalItems={totalItems}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onView={handleView}
          onEdit={handleEdit}
          onPublish={handlePublish}
          onDuplicate={handleDuplicate}
          onArchive={requestArchive}
        />
      </main>

      {/* Action Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isArchiving && setIsModalOpen(false)}
        title="Confirm Archival"
      >
        <div className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to permanently archive the advertisement{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{selectedAd?.title}</span>?
          <p className="mt-4 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-100 dark:border-amber-500/20 font-medium">
            ⚠️ Archiving an ad immediately pulls it from public rotation without exception. Analytics will be preserved in historical aggregates.
          </p>
        </div>
        <div className="flex justify-end gap-3 font-medium">
          <button
            onClick={() => setIsModalOpen(false)}
            disabled={isArchiving}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={confirmArchive}
            disabled={isArchiving}
            className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isArchiving ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Archiving...</span>
            ) : "Archive Ad"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
