import * as React from "react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import type { TrendData, AnalyticsData } from "../../services/analytics"

interface ChartsContainerProps {
  data: TrendData[]
  breakdowns?: AnalyticsData["breakdowns"]
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ChartsContainer({ data, breakdowns }: ChartsContainerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
      
      {/* 1. Performance Trend (Line) */}
      <div className="lg:col-span-8 bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
             <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Performance Trend</h3>
             <p className="text-xs text-gray-400 font-medium">Daily impressions vs Click transitions</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Impressions</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Clicks</span>
             </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#111827',
                  color: '#fff'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Geo-Spatial Breakdown (Pie) */}
      <div className="lg:col-span-4 bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-2">Location Affinity</h3>
        <p className="text-xs text-gray-400 font-medium mb-8">Reach distribution by major city hubs</p>
        
        <div className="h-[250px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={breakdowns?.byLocation}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={85}
                 paddingAngle={8}
                 dataKey="value"
                 stroke="none"
               >
                 {breakdowns?.byLocation?.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#111827' }} />
               <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
             </PieChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Spend vs Engagement (Bar) */}
      <div className="lg:col-span-12 bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Budget Efficiency</h3>
              <p className="text-xs text-gray-400 font-medium">Tracking spend velocity against clicks across the duration</p>
           </div>
        </div>

        <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
               <XAxis 
                 dataKey="time" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
                 dy={10}
               />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
               <Tooltip 
                 cursor={{ fill: 'transparent' }}
                 contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#111827' }} 
               />
               <Bar dataKey="spend" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={35} />
               <Bar dataKey="clicks" fill="rgba(99, 102, 241, 0.2)" radius={[6, 6, 0, 0]} barSize={35} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
