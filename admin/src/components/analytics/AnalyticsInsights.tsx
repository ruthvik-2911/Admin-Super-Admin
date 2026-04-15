import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Target, MapPin, Users } from "lucide-react"
import type { AnalyticsData } from "../../services/analytics"

interface AnalyticsInsightsProps {
  data: AnalyticsData
}

export function AnalyticsInsights({ data }: AnalyticsInsightsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Breakdowns */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* By Publisher */}
           <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                Top Publishers
              </h4>
              <div className="space-y-4">
                 {data.breakdowns.byPublisher.map((item, i) => (
                   <div key={item.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold">
                         <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                         <span className="text-gray-400">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.percentage}%` }}
                           className="h-full bg-primary-500 rounded-full"
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* By Location */}
           <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Top Geographies
              </h4>
              <div className="space-y-4">
                 {data.breakdowns.byLocation.map((item, i) => (
                   <div key={item.name} className="flex items-center gap-4">
                      <div className="flex-1 text-xs font-bold text-gray-700 dark:text-gray-300">{item.name}</div>
                      <div className="w-24 text-right text-xs font-black text-gray-900 dark:text-white">{item.value.toLocaleString()}</div>
                      <ArrowRight className="w-3 h-3 text-gray-300" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Top Ad Performance */}
        <div className="bg-white dark:bg-[#1A1D24] p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
           <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
             <Target className="w-4 h-4 text-purple-500" />
             Content Efficiency
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.breakdowns.byAd.map(ad => (
                <div key={ad.name} className="p-4 bg-gray-50 dark:bg-[#1C1F26] rounded-2xl border border-transparent hover:border-primary-500/30 transition-all group">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{ad.name}</p>
                   <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-gray-900 dark:text-white">{ad.value}</span>
                      <span className="text-[10px] text-primary-500 font-bold">Clicks</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 2. Insights */}
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-full shadow-2xl">
           <Sparkles className="absolute right-4 top-4 w-12 h-12 text-white/10" />
           
           <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
             <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-[10px]">AI</div>
             Platform Insights
           </h3>

           <div className="space-y-3">
             {data.insights.map((insight, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors group"
               >
                 <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                 <p className="text-xs font-semibold leading-relaxed text-gray-300 italic group-hover:text-white">
                   {insight}
                 </p>
               </motion.div>
             ))}
           </div>

           <div className="mt-12 p-6 bg-primary-500/20 border border-primary-500/30 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2">Primary Optimization</p>
              <p className="text-sm font-bold text-white">Focus on Video inventory in Mumbai for 2.4x higher ROI.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
