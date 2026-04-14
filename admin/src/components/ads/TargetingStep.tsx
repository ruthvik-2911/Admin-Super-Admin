import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Crosshair, MapPin, Navigation, Map } from "lucide-react"
import toast from "react-hot-toast"

export function TargetingStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()

  const locationMode = watch("locationMode")
  const radius = watch("radius")

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    const toastId = toast.loading("Detecting your location...")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude, { shouldValidate: true })
        setValue("longitude", position.coords.longitude, { shouldValidate: true })
        toast.success("Location pinpointed accurately", { id: toastId })
      },
      (error) => {
        toast.error("Failed to detect location. Please ensure permissions are granted.", { id: toastId })
        setValue("locationMode", "manual")
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Geo-Targeting</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define the precise epicenter and broadcast radius for this advertisement payload.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-800">
        
        {/* Location Mode Toggle */}
        <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl w-fit mb-8">
          <label className={`cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${locationMode === 'manual' ? 'bg-white dark:bg-[#1A1D24] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
            <input type="radio" value="manual" {...register("locationMode")} className="hidden" />
            <Map className="w-4 h-4" /> Manual Entry
          </label>
          <label className={`cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${locationMode === 'auto' ? 'bg-white dark:bg-[#1A1D24] text-brand-600 dark:text-brand-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
             <input 
               type="radio" 
               value="auto" 
               {...register("locationMode")} 
               className="hidden" 
               onClick={() => {
                 if (locationMode !== "auto") handleAutoDetect()
               }}
             />
             <Navigation className="w-4 h-4" /> Auto-Detect
          </label>
        </div>

        {/* Coordinates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Latitude Epicenter</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="number"
                step="any"
                disabled={locationMode === 'auto'}
                {...register("latitude")}
                placeholder="e.g. 19.0760"
                className={`w-full pl-9 pr-4 py-3 rounded-xl border bg-white dark:bg-[#1A1D24] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.latitude 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-900/50" 
                    : "border-gray-200 dark:border-gray-800 focus:border-brand-500 focus:ring-brand-500/20"
                }`}
              />
            </div>
            {errors.latitude && <p className="mt-1.5 text-sm text-red-500">{errors.latitude.message as string}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Longitude Epicenter</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="number"
                step="any"
                disabled={locationMode === 'auto'}
                {...register("longitude")}
                placeholder="e.g. 72.8777"
                className={`w-full pl-9 pr-4 py-3 rounded-xl border bg-white dark:bg-[#1A1D24] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.longitude 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-900/50" 
                    : "border-gray-200 dark:border-gray-800 focus:border-brand-500 focus:ring-brand-500/20"
                }`}
              />
            </div>
            {errors.longitude && <p className="mt-1.5 text-sm text-red-500">{errors.longitude.message as string}</p>}
          </div>
        </div>

        {/* Radius Slider Row */}
        <div>
           <div className="flex items-center justify-between mb-4">
             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
               <Crosshair className="w-4 h-4 text-brand-500" />
               Broadcast Radius (KM)
             </label>
             <span className="text-brand-600 dark:text-brand-400 font-bold text-lg bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-lg">
               {radius} km
             </span>
           </div>
           
           <div className="relative py-4">
             <input 
               type="range"
               min="1"
               max="100"
               step="1"
               {...register("radius")}
               className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-500 relative z-10"
             />
             <div className="flex justify-between text-xs text-gray-400 mt-2 absolute w-full top-8 -z-10 px-1">
               <span>1 km (Hyperlocal)</span>
               <span>50 km (City)</span>
               <span>100 km (Region)</span>
             </div>
           </div>
           {errors.radius && <p className="mt-6 text-sm text-red-500">{errors.radius.message as string}</p>}
        </div>

      </div>
    </div>
  )
}
