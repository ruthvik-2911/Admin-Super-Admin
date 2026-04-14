import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Plus, Bell, ChevronDown, Moon, Sun } from "lucide-react"
import { PublisherFilters } from "../../components/publisher/PublisherFilters"
import { PublisherTable } from "../../components/publisher/PublisherTable"
import { Modal } from "../../components/ui/Modal"
import { fetchPublishers, togglePublisherStatus, type Publisher } from "../../services/publishers"
import toast, { Toaster } from 'react-hot-toast'

export default function Publishers() {
  const navigate = useNavigate()
  const [data, setData] = React.useState<Publisher[]>([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)

  // State for Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedPublisher, setSelectedPublisher] = React.useState<{id: string, name: string, isCurrentlyActive: boolean} | null>(null)
  const [isToggling, setIsToggling] = React.useState(false)

  // Dark mode state
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

  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetchPublishers({ page, limit, search: searchTerm, status: statusFilter })
      setData(response.data)
      setTotalItems(response.totalItems)
    } catch (error) {
      toast.error("Failed to load publishers")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchTerm, statusFilter])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  const openToggleModal = (id: string, name: string, isCurrentlyActive: boolean) => {
    setSelectedPublisher({ id, name, isCurrentlyActive })
    setIsModalOpen(true)
  }

  const handleConfirmToggle = async () => {
    if (!selectedPublisher) return
    
    setIsToggling(true)
    try {
      await togglePublisherStatus(selectedPublisher.id)
      toast.success(`${selectedPublisher.name} is now ${selectedPublisher.isCurrentlyActive ? 'Inactive' : 'Active'}`)
      await loadData()
      setIsModalOpen(false)
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setIsToggling(false)
      setSelectedPublisher(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] transition-colors duration-200">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1C1F26]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold shadow-sm">
                K
              </div>
              <h1 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">
                KELIRI <span className="text-sm font-semibold text-brand-500 uppercase tracking-widest ml-1">Admin</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1C1F26]"></span>
              </button>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-300 font-semibold group-hover:bg-brand-200 dark:group-hover:bg-brand-800 transition-colors">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
                  <p className="text-xs text-brand-500 font-semibold">Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-600 dark:text-brand-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Publishers</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
              Manage all your business branches, locations, and their active status.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/admin/publishers/new')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-sm shadow-brand-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Publisher
          </button>
        </div>

        <PublisherFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <PublisherTable 
          data={data}
          loading={loading}
          totalItems={totalItems}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onToggleStatus={openToggleModal}
        />
      </main>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isToggling && setIsModalOpen(false)}
        title="Confirm Status Change"
      >
        <div className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to <strong>{selectedPublisher?.isCurrentlyActive ? 'deactivate' : 'activate'}</strong> publisher{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{selectedPublisher?.name}</span>?
          {selectedPublisher?.isCurrentlyActive && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg border border-amber-100 dark:border-amber-500/20">
              This will pause all their active ads and restrict their access until reactivated.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 font-medium">
          <button
            onClick={() => setIsModalOpen(false)}
            disabled={isToggling}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmToggle}
            disabled={isToggling}
            className={`px-6 py-2 text-white rounded-lg transition-colors shadow-sm ${
              selectedPublisher?.isCurrentlyActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
            } disabled:opacity-50 flex items-center justify-center min-w-[120px]`}
          >
            {isToggling ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              selectedPublisher?.isCurrentlyActive ? 'Deactivate' : 'Activate'
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
