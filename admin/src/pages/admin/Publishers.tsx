import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Plus } from "lucide-react"
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
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-end mb-6 gap-4">
          <button 
            onClick={() => navigate('/admin/publishers/new')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-sm shadow-primary-500/20 transition-all active:scale-95"
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
    </>
  )
}
