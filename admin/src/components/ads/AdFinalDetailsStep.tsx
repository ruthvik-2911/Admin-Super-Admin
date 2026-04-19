import * as React from "react"
import { useFormContext } from "react-hook-form"
import { CTASelector, type CTAType } from "./CTASelector"
import { CustomSectionsBuilder } from "./CustomSectionsBuilder"
import { Tag, Link as LinkIcon, Map as MapIcon, Info } from "lucide-react"

export function AdFinalDetailsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  
  const ctaType = watch("ctaType") as CTAType

  const getActionLabel = () => {
    switch (ctaType) {
      case "Redirect": return "Website URL"
      case "Dial": return "Phone Number"
      case "WhatsApp": return "WhatsApp Number"
      case "Email": return "Email Address"
      case "Map": return "Map Location Coordinates"
      default: return "Action Value"
    }
  }

  const getPlaceholder = () => {
    switch (ctaType) {
      case "Redirect": return "https://example.com"
      case "Dial": 
      case "WhatsApp": return "e.g. 9876543210"
      case "Email": return "e.g. contact@business.com"
      case "Map": return "e.g. 19.0760, 72.8777"
      default: return ""
    }
  }

  return (
    <div className="space-y-10">
      {/* ── Section 1: CTA Configuration ── */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Call to Action (CTA)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure the main action button for your advertisement</p>
        </div>

        <CTASelector 
          value={ctaType} 
          onChange={(val) => setValue("ctaType", val, { shouldValidate: true })} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-800 rounded-2xl">
          {/* Button Label */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 text-brand-500" />
              Button Label
            </label>
            <input
              {...register("ctaLabel")}
              placeholder="e.g. Shop Now, Contact Us..."
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#1A1D24] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.ctaLabel 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.ctaLabel && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.ctaLabel.message as string}</p>}
          </div>

          {/* Action Value */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <LinkIcon className="w-4 h-4 text-brand-500" />
              {getActionLabel()}
            </label>
            <input
              {...register("ctaActionValue")}
              placeholder={getPlaceholder()}
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#1A1D24] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.ctaActionValue 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
              }`}
            />
            {errors.ctaActionValue && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.ctaActionValue.message as string}</p>}
          </div>
        </div>

        {/* Dummy Map Preview when CTA is Map */}
        {ctaType === "Map" && (
          <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center group">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               {/* Pattern for placeholder map */}
               <div className="w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>
            <div className="flex flex-col items-center gap-3 relative z-10 text-center px-6">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full shadow-xl shadow-brand-500/10 flex items-center justify-center text-brand-500 animate-bounce">
                <MapIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Map Preview (Demo Mode)</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Map selection is running in placeholder mode as no API key is configured.</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-[#1A1D24]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Dummy Integration</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

      {/* ── Section 2: Dynamic Content ── */}
      <CustomSectionsBuilder />

      {/* Helper Alert */}
      <div className="flex items-start gap-4 p-5 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-100 leading-tight">Advanced Customization</p>
          <p className="text-xs text-blue-700/70 dark:text-blue-400/70 leading-relaxed">
            Unlike standard ads, Keliri allows you to add multiple descriptive blocks. 
            Use these to highlight key product features or unique selling points.
          </p>
        </div>
      </div>
    </div>
  )
}
