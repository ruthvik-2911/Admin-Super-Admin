import type { ElementType } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  change: number
  changeLabel?: string
  icon: ElementType
  iconBg: string
  iconColor: string
  prefix?: string
}

export default function KpiCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  iconBg,
  iconColor,
  prefix = '',
}: KpiCardProps) {
  const isPositive = change >= 0

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 group cursor-pointer animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                        ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          {prefix}{value}
        </p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
        <p className="text-[11px] text-gray-400 mt-1">{changeLabel}</p>
      </div>
    </div>
  )
}
