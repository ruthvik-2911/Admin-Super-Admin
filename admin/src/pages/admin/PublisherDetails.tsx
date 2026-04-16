import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Edit3, 
  Power, 
  PowerOff, 
  Loader2, 
  LayoutDashboard, 
  BarChart3, 
  History,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

import { fetchPublisherAnalytics, togglePublisherStatus, type PublisherAnalytics } from "../../services/publishers"
import { PublisherInfoCard } from "../../components/publisher/PublisherInfoCard"
import { PublisherStats } from "../../components/publisher/PublisherStats"
import { PublisherCharts } from "../../components/publisher/PublisherCharts"
import { CampaignTable } from "../../components/publisher/CampaignTable"
import { Modal } from "../../components/ui/Modal"

type TabType = "overview" | "performance" | "campaigns"

export default function PublisherDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [data, setData] = React.useState<PublisherAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<TabType>("overview")
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
      loadAnalytics()
    } catch (error) {
      toast.error("Failed to toggle status")
    } finally {
      setIsToggling(false)
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Syncing Branch Analytics...</p>
      </div>
    )
  }

  const { publisher, stats, trends, campaigns } = data
  const isActive = publisher.status === "Active"

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-8 pb-20">
        
        {/* Breadcrumb & Global Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/admin/publishers")}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Network
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{publisher.name}</h1>
                <div className="flex items-center gap-3">
                   <p className="text-xs font-bold text-gray-400">UUID: {publisher.id}</p>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                     isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                   }`}>
                     {publisher.status}
                   </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl border transition-all ${
                isActive 
                  ? "text-red-600 bg-white border-red-100 hover:bg-red-50 dark:bg-red-500/5 dark:border-red-500/20"
                  : "text-emerald-600 bg-white border-emerald-100 hover:bg-emerald-50 dark:bg-emerald-500/5 dark:border-emerald-500/20"
              }`}
            >
              {isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
              <span>{isActive ? "Deactivate Branch" : "Reactivate Branch"}</span>
            </button>
            <button
              onClick={() => navigate(`/admin/publishers/${id}/edit`)}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-100 dark:border-gray-800">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "performance", label: "Performance", icon: BarChart3 },
            { id: "campaigns", label: "Campaign History", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab.id
                  ? "text-primary-500 border-primary-500"
                  : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <main>
          <AnimatePresence mode="wait">
             {activeTab === "overview" && (
               <motion.div
                 key="overview"
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 10 }}
                 className="space-y-8"
               >
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   <div className="lg:col-span-4">
                     <PublisherInfoCard publisher={publisher} />
                   </div>
                   <div className="lg:col-span-8 space-y-8">
                      <div className="bg-white dark:bg-[#1A1D24] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 px-2">Key Performance Snapshot</h3>
                        <PublisherStats stats={stats} />
                      </div>
                      
                      {/* Secondary Info Card */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-[#1A1D24] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Compliance & Trust</h4>
                           <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                 <span className="text-xs font-bold text-gray-500">Security Audit</span>
                                 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PASSED</span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <span className="text-xs font-bold text-gray-500">Uptime (24h)</span>
                                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">99.9%</span>
                              </div>
                           </div>
                        </div>
                        <div className="bg-primary-500 p-6 rounded-3xl border border-primary-400 shadow-xl shadow-primary-500/10 text-white relative overflow-hidden group">
                           <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform"><Building2 className="w-24 h-24" /></div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-3">Live Feed Status</h4>
                           <div className="flex items-end justify-between">
                              <div className="space-y-1">
                                <p className="text-2xl font-black">Connected</p>
                                <p className="text-[10px] font-bold text-white/80">Last heartbeat: 2s ago</p>
                              </div>
                              <Clock className="w-5 h-5 animate-pulse" />
                           </div>
                        </div>
                      </div>
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === "performance" && (
               <motion.div
                 key="performance"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.98 }}
               >
                 <PublisherCharts trends={trends} campaigns={campaigns} />
               </motion.div>
             )}

             {activeTab === "campaigns" && (
               <motion.div
                 key="campaigns"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
               >
                 <CampaignTable campaigns={campaigns} />
               </motion.div>
             )}
          </AnimatePresence>
        </main>

        {/* Modal Fixes */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => !isToggling && setIsModalOpen(false)}
          title="Security Action Required"
        >
          <div className="flex flex-col items-center text-center gap-6 p-2">
             <div className={`p-4 rounded-full ${isActive ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
               {isActive ? <PowerOff className="w-10 h-10" /> : <Power className="w-10 h-10" />}
             </div>
             <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                   {isActive ? "Deactivate Network Branch?" : "Reactivate Network Branch?"}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Are you sure you want to change the operational status of <span className="font-bold text-gray-900 dark:text-white">{publisher.name}</span>?
                </p>
             </div>
             {isActive && (
                <div className="w-full bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 text-left">
                  <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Impact Awareness</p>
                  <ul className="text-xs space-y-2 text-amber-700 dark:text-amber-400">
                    <li className="flex gap-2">• Pauses all live ad rotation immediately</li>
                    <li className="flex gap-2">• Prevents branch staff from logging in</li>
                  </ul>
                </div>
             )}
             <div className="flex w-full gap-3 font-bold uppercase tracking-widest text-xs">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleToggleStatus}
                  className={`flex-1 py-4 text-white rounded-xl shadow-lg transition-all ${
                    isActive ? "bg-red-500 shadow-red-500/20 hover:bg-red-600" : "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600"
                  }`}
                >
                  {isToggling ? "Executing..." : "Confirm Action"}
                </button>
             </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
