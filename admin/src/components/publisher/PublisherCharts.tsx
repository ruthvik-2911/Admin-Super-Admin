import * as React from "react"
import { motion } from "framer-motion"
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  CartesianAxis
} from 'recharts'
import type { PublisherAnalytics } from "../../services/publishers"

interface PublisherChartsProps {
  trends: PublisherAnalytics['trends']
  campaigns: PublisherAnalytics['campaigns']
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1C1F26] p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 dark:text-gray-400 capitalize">{entry.name}:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function PublisherCharts({ trends, campaigns }: PublisherChartsProps) {
  const barData = campaigns.slice(0, 5).map(c => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + "..." : c.title,
    impressions: c.impressions,
    clicks: c.clicks
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Historical Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-[#1A1D24] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Historical Engagement</h3>
        <div className="h-[300px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6B7280', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              <Line 
                name="Impressions"
                type="monotone" 
                dataKey="impressions" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line 
                name="Clicks"
                type="monotone" 
                dataKey="clicks" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#F59E0B", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart - Campaign Spread */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-[#1A1D24] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Top Campaigns Reach</h3>
        <div className="h-[300px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#374151', opacity: 0.05 }} />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              <Bar name="Impressions" dataKey="impressions" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
