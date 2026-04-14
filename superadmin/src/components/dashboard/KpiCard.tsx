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
    <div className="glass-card-hover p-5 group animate-fade-in flex flex-col justify-between h-full min-h-[140px]">
      {/* Top row: icon + badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold
                         ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </div>
      </div>

      {/* Value */}
      <p className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
        {prefix}{value}
      </p>

      {/* Labels */}
      <p className="text-[13px] font-medium text-gray-600 mt-1.5">{title}</p>
      <p className="text-[11px] text-gray-400 mt-0.5 truncate">{changeLabel}</p>
    </div>
  )
}
