import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Loader2, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  BarChart3, 
  Clock, 
  ExternalLink,
  Users,
  Eye,
  MousePointerClick,
  Monitor,
  Building2,
  ChevronDown
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { getAdById, archiveAd, type Advertisement } from "../../services/ads"
import { StatusBadge } from "../../components/ui/StatusBadge"

export default function AdDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ad, setAd] = React.useState<Advertisement | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const data = await getAdById(id)
        setAd(data)
      } catch (err) {
        toast.error("Failed to load campaign details")
        navigate("/admin/ads")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handleArchive = async () => {
    if (!ad) return
    if (!confirm(`Are you sure you want to archive "${ad.title}"?`)) return
    
    try {
      await archiveAd(ad.id)
      toast.success("Campaign archived")
      navigate("/admin/ads")
    } catch (err) {
      toast.error("Failed to archive campaign")
    }
  }

  if (loading || !ad) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Syncing Campaign Data...</p>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-8 pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button 
            onClick={() => navigate("/admin/ads")}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Campaigns
          </button>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => navigate(`/admin/ads/${ad.id}/edit`)}
               className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
             >
               <Edit3 className="w-4 h-4" /> Edit Campaign
             </button>
             <button 
               onClick={handleArchive}
               className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
             >
               <Trash2 className="w-4 h-4" /> Archive
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content: Info & Performance */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Summary Banner */}
            <div className="bg-white dark:bg-[#1A1D24] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -z-10" />
               
               <div className="flex items-start justify-between mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-full">Campaign ID: {ad.id}</span>
                      <StatusBadge status={ad.status} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">{ad.title}</h1>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Status</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                      ad.paymentStatus === "Paid" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-400/10" : "text-amber-600 bg-amber-50 dark:bg-amber-400/10"
                    }`}>
                      {ad.paymentStatus}
                    </span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Reach</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{ad.impressions.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Interactions</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{ad.clicks.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Engagement Rate</p>
                    <p className="text-xl font-black text-primary-500 tabular-nums">{ad.ctr}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Since</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">{new Date(ad.startDate).toLocaleDateString()}</p>
                  </div>
               </div>
            </div>

            {/* Campaign Breakdown Tabs (Mock UI for now) */}
            <div className="bg-white dark:bg-[#1A1D24] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
               <div className="flex items-center gap-8 mb-8 border-b border-gray-100 dark:border-gray-800">
                 {["Targeting", "Performance Trend", "Network Logs"].map((tab, i) => (
                   <button key={i} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                     i === 0 ? "text-primary-500 border-primary-500" : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200"
                   }`}>
                     {tab}
                   </button>
                 ))}
               </div>

               <div className="space-y-8">
                  {/* Targeting Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-3">
                           <MapPin className="w-4 h-4 text-primary-500" /> Geospatial Constraints
                        </h3>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0E1117] rounded-2xl border border-gray-100 dark:border-gray-800">
                              <span className="text-xs font-bold text-gray-500">Center Coordinates</span>
                              <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums">19.0760° N, 72.8777° E</span>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0E1117] rounded-2xl border border-gray-100 dark:border-gray-800">
                              <span className="text-xs font-bold text-gray-500">Coverage Radius</span>
                              <span className="text-xs font-black text-gray-900 dark:text-white">25 km (Regional)</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-3">
                           <Monitor className="w-4 h-4 text-blue-500" /> Device/Network Targets
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {["Mobile App", "Web Dashboard", "Public Displays", "IOS Icons"].map(tag => (
                             <span key={tag} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">
                               {tag}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar: Media & Creators */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Media Preview Card */}
             <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Campaign Media Asset</h3>
                <div className="aspect-square bg-gray-100 dark:bg-[#0E1117] rounded-3xl overflow-hidden relative group">
                   <img 
                     src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80`} 
                     alt="Campaign Visual"
                     className="w-full h-full object-cover transition-transform group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-4 bg-white rounded-full text-black shadow-2xl">
                        <ExternalLink className="w-6 h-6" />
                      </button>
                   </div>
                </div>
                <div className="mt-4 px-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500">campaign_visual_v1.png</p>
                  <p className="text-[10px] font-black text-gray-400">1.2 MB</p>
                </div>
             </div>

             {/* Network Distribution */}
             <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Assigned Network Branches</h3>
                <div className="space-y-3">
                  {ad.publishers.map((pub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0E1117] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                           <Building2 className="w-4 h-4" />
                         </div>
                         <span className="text-xs font-black text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors uppercase tracking-tight">{pub}</span>
                       </div>
                       <ChevronDown className="w-3 h-3 text-gray-400 -rotate-90" />
                    </div>
                  ))}
                  {ad.publishers.length === 0 && <p className="text-xs text-gray-400 italic p-4 text-center">No publishers assigned</p>}
                </div>
             </div>

             {/* Quick Stats Sidebar */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 dark:bg-orange-500/5 p-6 rounded-[2rem] border border-orange-100 dark:border-orange-500/10">
                   <Clock className="w-5 h-5 text-orange-500 mb-3" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Days to Expire</p>
                   <p className="text-xl font-black text-orange-700 dark:text-orange-400 tabular-nums">12</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/5 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-500/10">
                   <Users className="w-5 h-5 text-blue-500 mb-3" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Target Segment</p>
                   <p className="text-xl font-black text-blue-700 dark:text-blue-400 tabular-nums">ALL</p>
                </div>
             </div>

          </div>
        </div>

      </div>
    </>
  )
}
