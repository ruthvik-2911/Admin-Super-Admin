import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Banner Ads', value: 512000, color: '#FF6B00' },
  { name: 'Video Ads', value: 345000, color: '#3B82F6' },
  { name: 'Thumbnail Ads', value: 124000, color: '#8B5CF6' },
  { name: 'Sponsored Lists', value: 264800, color: '#10B981' },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number; name: string }[]
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-gray-800 rounded-xl shadow-card-hover px-3.5 py-2.5">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

const renderLegend = (props: any) => {
  const { payload } = props
  return (
    <ul className="flex flex-col gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400 font-medium">{entry.value}</span>
          </div>
          <span className="text-gray-900 dark:text-gray-200 font-bold">
            ₹{entry.payload.value.toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function RevenueDistributionChart() {
  return (
    <div className="glass-card p-6 animate-fade-in h-full flex flex-col">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue by Ad Type</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Distribution across formats</p>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
