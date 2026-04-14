import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const dailyData = [
  { name: 'Mon', revenue: 4200 },
  { name: 'Tue', revenue: 5800 },
  { name: 'Wed', revenue: 4900 },
  { name: 'Thu', revenue: 7200 },
  { name: 'Fri', revenue: 6800 },
  { name: 'Sat', revenue: 8500 },
  { name: 'Sun', revenue: 7100 },
]

const weeklyData = [
  { name: 'Wk 1', revenue: 28000 },
  { name: 'Wk 2', revenue: 35000 },
  { name: 'Wk 3', revenue: 31000 },
  { name: 'Wk 4', revenue: 42000 },
]

const monthlyData = [
  { name: 'Jan', revenue: 95000 },
  { name: 'Feb', revenue: 112000 },
  { name: 'Mar', revenue: 98000 },
  { name: 'Apr', revenue: 135000 },
  { name: 'May', revenue: 128000 },
  { name: 'Jun', revenue: 156000 },
]

type Period = 'daily' | 'weekly' | 'monthly'

const dataMap: Record<Period, typeof dailyData> = {
  daily: dailyData,
  weekly: weeklyData,
  monthly: monthlyData,
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover px-3 py-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">₹{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  const [period, setPeriod] = useState<Period>('daily')

  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Total earnings over time</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${period === p.key
                  ? 'bg-white text-primary-600 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={dataMap[period]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
                 tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#FF6B00"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={{ fill: '#FF6B00', strokeWidth: 2, r: 4, stroke: 'white' }}
            activeDot={{ r: 6, fill: '#FF6B00', stroke: 'white', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
