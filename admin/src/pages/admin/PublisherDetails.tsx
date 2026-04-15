import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit3, Power, PowerOff, Loader2 } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

import { fetchPublisherAnalytics, togglePublisherStatus, type PublisherAnalytics } from "../../services/publishers"
import { PublisherInfoCard } from "../../components/publisher/PublisherInfoCard"
import { PublisherStats } from "../../components/publisher/PublisherStats"
import { PublisherCharts } from "../../components/publisher/PublisherCharts"
import { CampaignTable } from "../../components/publisher/CampaignTable"
import { Modal } from "../../components/ui/Modal"

export default function PublisherDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [data, setData] = React.useState<PublisherAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isToggling, setIsToggling] = React.useState(false)

  const loadAnalytics = React.useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await fetchPublisherAnalytics(id)
      setData(response)
    } catch (error) {
      toast.error("Failed to load publisher analytics.")
      navigate("/admin/publishers")
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  React.useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const handleToggleStatus = async () => {
    if (!id || !data) return
    setIsToggling(true)
    try {
      await togglePublisherStatus(id)
      toast.success(`${data.publisher.name} is now ${data.publisher.status === 'Active' ? 'Inactive' : 'Active'}`)
      setIsModalOpen(false)
      loadAnalytics() // Reload to get fresh data
    } catch (error) {
      toast.error("Failed to toggle status")
    } finally {
      setIsToggling(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Aggregating Publisher Analytics...</p>
      </div>
    )
  }

  const { publisher, stats, trends, campaigns } = data
  const isActive = publisher.status === "Active"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] pb-16 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Sticky Top Header */}
      

      {/* Main Analytics Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Info & Core KPIs Layer */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <PublisherInfoCard publisher={publisher} />
          </div>
          <div className="xl:col-span-2 flex flex-col justify-center">
            <PublisherStats stats={stats} />
          </div>
        </section>

        {/* Dynamic Charts Layer */}
        <section>
          <PublisherCharts trends={trends} campaigns={campaigns} />
        </section>

        {/* Campaign Data Table Layer */}
        <section>
          <CampaignTable campaigns={campaigns} />
        </section>

      </main>

      {/* Toggle Status Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isToggling && setIsModalOpen(false)}
        title="Confirm Status Change"
      >
        <div className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> publisher{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{publisher.name}</span>?
          {isActive && (
            <p className="mt-4 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-100 dark:border-amber-500/20 font-medium">
              ⚠️ Warning: This will instantaneously pause all of their currently active campaigns and revoke their dashboard login access until they are reactivated.
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
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`px-6 py-2 text-white rounded-lg transition-colors shadow-sm ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
            } disabled:opacity-50 flex items-center justify-center min-w-[120px]`}
          >
            {isToggling ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
            ) : (
              isActive ? 'Deactivate' : 'Activate'
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
