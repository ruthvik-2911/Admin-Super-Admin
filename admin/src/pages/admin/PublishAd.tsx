import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, MapPin, Crosshair, HelpCircle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { getAdById, fetchPublisherNames, finalizeAdPublication, type Advertisement } from "../../services/ads"
import { publishSchema, type PublishFormData } from "../../schemas/publishSchema"

import { DatePicker } from "../../components/ui/DatePicker"
import { MultiSelect } from "../../components/ui/MultiSelect"
import { AdSummaryCard } from "../../components/ads/AdSummaryCard"

export default function PublishAd() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [ad, setAd] = React.useState<Advertisement | null>(null)
  const [publishers, setPublishers] = React.useState<{id: string, name: string}[]>([])
  const [loading, setLoading] = React.useState(true)

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      publisherIds: []
    }
  })

  const formData = watch()

  // Data Loading
  React.useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const [adData, pubs] = await Promise.all([
          getAdById(id),
          fetchPublisherNames()
        ])
        setAd(adData)
        setPublishers(pubs)
      } catch (err) {
        toast.error("Critical error starting publication flow")
        navigate("/admin/ads")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  // Calculation logic
  const days = React.useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }, [formData.startDate, formData.endDate])

  const onSubmit = async (data: PublishFormData) => {
    try {
      const costAmount = days * 1 * data.publisherIds.length // Example cost logic
      await finalizeAdPublication(id!, { ...data, cost: costAmount })
      toast.success("Publication saved! Proceeding to payment...")
      
      // Navigate to payment page with state
      setTimeout(() => navigate(`/admin/ads/${id}/pay`, { state: { cost: costAmount } }), 1000)
    } catch (err) {
      toast.error("Failed to finalize publication")
    }
  }

  if (loading || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/ads/${id}/edit`)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Edit
            </button>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 4 of 4: Finalize & Pay</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Configuration */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Assignment */}
              <section className="bg-white dark:bg-[#1A1D24] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-[10px]">1</span>
                   Network Assignment
                </h2>
                <Controller 
                  name="publisherIds"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect 
                      label="Assign Publishers" 
                      options={publishers}
                      selectedIds={field.value}
                      onChange={field.onChange}
                      error={errors.publisherIds?.message}
                    />
                  )}
                />
                <p className="mt-4 text-xs text-gray-500 leading-relaxed italic bg-gray-50 dark:bg-[#1C1F26] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <HelpCircle className="w-3.5 h-3.5 inline mr-1 mb-0.5 text-brand-500" />
                  Selected publishers will receive this ad content for their allocated slots. You can add more publishers later from the dashboard.
                </p>
              </section>

              {/* 2. Duration */}
              <section className="bg-white dark:bg-[#1A1D24] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-[10px]">2</span>
                   Campaign Duration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePicker 
                    label="Activation Date"
                    error={errors.startDate?.message}
                    {...control.register("startDate")}
                  />
                  <DatePicker 
                    label="Deactivation Date"
                    error={errors.endDate?.message}
                    {...control.register("endDate")}
                  />
                </div>
              </section>

              {/* 3. Targeting Review */}
              <section className="bg-white dark:bg-[#1A1D24] p-6 rounded-2xl border border-dotted border-gray-300 dark:border-gray-700 transition-colors opacity-90">
                 <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   Targeting Constraints (Locked)
                </h2>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><MapPin className="w-4 h-4 text-gray-500" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Coordinates</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">19.0760, 72.8777</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><Crosshair className="w-4 h-4 text-gray-500" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Coverage Radius</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">25 KM Radius</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Summary */}
            <aside className="lg:col-span-4">
               <AdSummaryCard 
                 ad={ad}
                 days={days}
                 numPublishers={formData.publisherIds.length}
                 costPerDay={1} // ₹365 / 365
                 onPublish={handleSubmit(onSubmit)}
                 isSubmitting={isSubmitting}
               />
            </aside>

          </div>
        </div>
      </div>
    </>
  )
}
