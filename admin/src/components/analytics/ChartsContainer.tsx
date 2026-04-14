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
  Area 
} from "recharts"
import type { TrendData } from "../../services/analytics"

interface ChartsContainerProps {
  data: TrendData[]
}

export function ChartsContainer({ data }: ChartsContainerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* 1. Performance Trend (Line) */}
      <div className="bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
             <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Performance Trend</h3>
             <p className="text-xs text-gray-400 font-medium">Daily impressions vs Click transitions</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-500 rounded-full" />
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

      {/* 2. Spend vs Engagement (Bar) */}
      <div className="bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Budget Efficiency</h3>
              <p className="text-xs text-gray-400 font-medium">Tracking spend velocity against clicks</p>
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
               <Bar dataKey="spend" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
               <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Engagement (Area) */}
      <div className="lg:col-span-2 bg-white dark:bg-[#1A1D24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-8">Reach Accumulation</h3>
        <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
               <defs>
                 <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
               <XAxis 
                 dataKey="time" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                 dy={10}
               />
               <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#111827' }} />
               <Area 
                 type="monotone" 
                 dataKey="impressions" 
                 stroke="#6366f1" 
                 fillOpacity={1} 
                 fill="url(#colorImp)" 
                 strokeWidth={3}
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
