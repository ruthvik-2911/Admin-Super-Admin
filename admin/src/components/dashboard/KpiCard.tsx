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
      <Card className="p-6 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-xl">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={`flex items-center font-medium ${
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {trend.value}%
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
