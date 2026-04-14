import {
  DollarSign,
  Megaphone,
  Users,
  Radio,
  MousePointerClick,
  Activity,
  UserCircle2,
} from 'lucide-react'
import KpiCard from '../components/dashboard/KpiCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import TopAdminsTable from '../components/dashboard/TopAdminsTable'

const kpis = [
  {
    title: 'Total Revenue',
    value: '12,45,800',
    change: 14.2,
    icon: DollarSign,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    prefix: '₹',
    changeLabel: 'vs last month',
  },
  {
    title: 'Total Ads',
    value: '1,284',
    change: 8.7,
    icon: Megaphone,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
    changeLabel: 'Active / Pending / Expired',
  },
  {
    title: 'Total Admins',
    value: '148',
    change: 3.1,
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    changeLabel: 'Active: 132 · Pending: 16',
  },
  {
    title: 'Total Publishers',
    value: '392',
    change: 11.5,
    icon: Radio,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    changeLabel: 'Across 24 cities',
  },
  {
    title: 'Ad Clicks Today',
    value: '28,940',
    change: 22.3,
    icon: MousePointerClick,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    changeLabel: 'vs yesterday',
  },
  {
    title: 'Active Campaigns',
    value: '87',
    change: -2.4,
    icon: Activity,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    changeLabel: 'Currently running',
  },
  {
    title: 'Total Users',
    value: '4,21,300',
    change: 18.9,
    icon: UserCircle2,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    changeLabel: 'Registered users',
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, Super Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-xl text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.title} style={{ animationDelay: `${i * 60}ms` }}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              changeLabel={kpi.changeLabel}
              icon={kpi.icon}
              iconBg={kpi.iconBg}
              iconColor={kpi.iconColor}
              prefix={kpi.prefix}
            />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <TopAdminsTable />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-card p-6 animate-fade-in">
          <h3 className="font-semibold text-gray-900 mb-1">Ad Type Breakdown</h3>
          <p className="text-xs text-gray-400 mb-5">Distribution of active ad types</p>

          {[
            { label: 'Banner Ads', count: 512, pct: 64, color: 'bg-primary-500' },
            { label: 'Video Ads', count: 198, pct: 25, color: 'bg-blue-500' },
            { label: 'Thumbnail Ads', count: 88, pct: 11, color: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.label} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.count}</span>
                  <span className="text-xs font-semibold text-gray-700">{item.pct}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`${item.color} h-1.5 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}

          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform Health</p>
            {[
              { label: 'API Response', value: '98ms', ok: true },
              { label: 'Uptime (30d)', value: '99.97%', ok: true },
              { label: 'Failed Payments', value: '0.2%', ok: true },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{stat.label}</span>
                <span className={`text-xs font-semibold ${stat.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
