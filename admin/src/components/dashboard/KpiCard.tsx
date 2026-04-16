import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card } from "../ui/Card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: ReactNode
  delay?: number
}

export function KpiCard({ title, value, trend, icon, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="h-full"
    >
      <div className="glass-card p-7 h-full flex flex-col justify-between hover:bg-white dark:hover:bg-white/5 transition-all duration-300 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
          </div>
          <div className="p-4 bg-primary-100/50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-2xl group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-primary-500/10">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-6 flex items-center justify-between">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${
               trend.isPositive 
                ? "bg-green-100/80 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                : "bg-red-100/80 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            }`}>
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}%
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth rate</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
