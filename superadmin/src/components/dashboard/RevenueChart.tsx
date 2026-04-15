import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TrendPoint } from '../../lib/dashboard'

interface TrendChartProps {
  data?: TrendPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover px-3.5 py-2.5">
        <p className="text-[11px] text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">{payload[0].value.toLocaleString()} campaigns</p>
      </div>
    )
  }
  return null
}

export default function RevenueChart({ data = [] }: TrendChartProps) {
  return (
    <div className="glass-card p-6 animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Publishing Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Campaigns created from the live Keliri publish flow</p>
        </div>
      </div>

      <div className="flex-1 min-h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FF6B00"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={{ fill: '#FF6B00', strokeWidth: 2, r: 3.5, stroke: 'white' }}
              activeDot={{ r: 6, fill: '#FF6B00', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
