import { useState, useCallback } from 'react'
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
import KpiToggleDropdown from '../components/dashboard/KpiToggleDropdown'

// ─── KPI definitions ────────────────────────────────────────────────────────
const ALL_KPIS = [
  {
    id: 'revenue',
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
    id: 'ads',
    title: 'Total Ads',
    value: '1,284',
    change: 8.7,
    icon: Megaphone,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
    changeLabel: 'Active · Pending · Expired',
  },
  {
    id: 'admins',
    title: 'Total Admins',
    value: '148',
    change: 3.1,
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    changeLabel: 'Active: 132 · Pending: 16',
  },
  {
    id: 'publishers',
    title: 'Total Publishers',
    value: '392',
    change: 11.5,
    icon: Radio,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    changeLabel: 'Across 24 cities',
  },
  {
    id: 'clicks',
    title: 'Ad Clicks Today',
    value: '28,940',
    change: 22.3,
    icon: MousePointerClick,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    changeLabel: 'vs yesterday',
  },
  {
    id: 'campaigns',
    title: 'Active Campaigns',
    value: '87',
    change: -2.4,
    icon: Activity,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    changeLabel: 'Currently running',
  },
  {
    id: 'users',
    title: 'Total Users',
    value: '4,21,300',
    change: 18.9,
    icon: UserCircle2,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    changeLabel: 'Registered users',
  },
]

const STORAGE_KEY = 'keliri_sa_visible_kpis'

function loadVisibility(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch { /* ignore */ }
  // Default: all visible
  return new Set(ALL_KPIS.map((k) => k.id))
}

function saveVisibility(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

// ─── Ad type & platform data ─────────────────────────────────────────────────
const adTypes = [
  { label: 'Banner Ads',    count: 512, pct: 64, color: 'bg-primary-500' },
  { label: 'Video Ads',     count: 198, pct: 25, color: 'bg-blue-500'    },
  { label: 'Thumbnail Ads', count: 88,  pct: 11, color: 'bg-purple-500'  },
]

const platformStats = [
  { label: 'API Response',    value: '98ms',   ok: true },
  { label: 'Uptime (30d)',    value: '99.97%', ok: true },
  { label: 'Failed Payments', value: '0.2%',   ok: true },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(loadVisibility)

  const toggleKpi = useCallback((id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        // Don't allow hiding all cards
        if (next.size === 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      saveVisibility(next)
      return next
    })
  }, [])

  const visibleKpis = ALL_KPIS.filter((k) => visibleIds.has(k.id))

  const dropdownItems = ALL_KPIS.map((k) => ({
    id: k.id,
    title: k.title,
    visible: visibleIds.has(k.id),
  }))

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between pt-1 scroll-animate delay-75 relative z-30">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Welcome back, Super Admin · {today}
          </p>
        </div>

        {/* Right side: status badge + customize */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400
                          px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            All systems operational
          </div>

          <KpiToggleDropdown items={dropdownItems} onChange={toggleKpi} />
        </div>
      </div>

      {/* ── KPI Grid ── */}
      {visibleKpis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {visibleKpis.map((kpi, i) => (
            <div
              key={kpi.id}
              className="scroll-animate"
              style={{ transitionDelay: `${i * 50 + 100}ms` }}
            >
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
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed
                        border-gray-200 py-12 text-center animate-fade-in">
          <p className="text-sm font-medium text-gray-500">No KPI cards visible</p>
          <p className="text-xs text-gray-400 mt-1">Use the Customize button to show cards</p>
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 scroll-animate delay-200">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 scroll-animate delay-300">
        <div className="xl:col-span-2">
          <TopAdminsTable />
        </div>

        <div className="glass-card p-6 animate-fade-in flex flex-col gap-6">

          {/* Ad Type Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Ad Type Breakdown</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-4">Distribution of active ad types</p>
            <div className="space-y-3">
              {adTypes.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{item.count}</span>
                      <span className="text-xs font-bold text-gray-700 dark:text-white">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`${item.color} h-1.5 rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Platform Health */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Platform Health
            </p>
            <div className="space-y-2.5">
              {platformStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                  <span className={`text-xs font-bold ${stat.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
