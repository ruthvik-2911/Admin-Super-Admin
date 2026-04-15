import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  LocateFixed,
  MapPinned,
  Megaphone,
  Radio,
  Ruler,
  UserCircle2,
  Users,
} from 'lucide-react'
import KpiCard from '../components/dashboard/KpiCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import TopAdminsTable from '../components/dashboard/TopAdminsTable'
import KpiToggleDropdown from '../components/dashboard/KpiToggleDropdown'
import { AuthError } from '../lib/auth'
import { fetchSuperAdminDashboard, type BreakdownItem, type DashboardKpi, type SuperAdminDashboardPayload } from '../lib/dashboard'

const STORAGE_KEY = 'keliri_sa_visible_kpis'

const KPI_META = {
  ads: { icon: Megaphone, iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
  campaigns: { icon: Activity, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  activeCampaigns: { icon: LocateFixed, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  publishers: { icon: Radio, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  geoTargeted: { icon: MapPinned, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  locations: { icon: Users, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  users: { icon: UserCircle2, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  avgRadius: { icon: Ruler, iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
} as const

function loadVisibility(initialKpis: DashboardKpi[]): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = new Set(JSON.parse(raw) as string[])
      const available = new Set(initialKpis.map((kpi) => kpi.id))
      return new Set([...stored].filter((id) => available.has(id)))
    }
  } catch {
    // ignore invalid stored state
  }
  return new Set(initialKpis.map((kpi) => kpi.id))
}

function saveVisibility(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

function breakdownColor(index: number) {
  const colors = ['bg-primary-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500']
  return colors[index % colors.length]
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<SuperAdminDashboardPayload | null>(null)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const payload = await fetchSuperAdminDashboard()
        if (cancelled) return
        setDashboard(payload)
        setVisibleIds(loadVisibility(payload.kpis))
      } catch (err) {
        if (cancelled) return
        if (err instanceof AuthError) {
          setError(err.message)
        } else {
          setError('Unable to load the dashboard right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  const toggleKpi = useCallback((id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      saveVisibility(next)
      return next
    })
  }, [])

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (loading) {
    return (
      <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
        <div className="pt-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Loading live publishing data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-card p-5 min-h-[140px] animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
              <div className="h-7 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
        <div className="pt-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-red-500 mt-0.5">{error || 'Dashboard data is unavailable.'}</p>
        </div>
      </div>
    )
  }

  const visibleKpis = dashboard.kpis.filter((kpi) => visibleIds.has(kpi.id))
  const dropdownItems = dashboard.kpis.map((kpi) => ({
    id: kpi.id,
    title: kpi.title,
    visible: visibleIds.has(kpi.id),
  }))

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pt-1 scroll-animate delay-75 relative z-30">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Live view of how Keliri campaigns are being published and targeted • {today}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Publish flow connected
          </div>

          <KpiToggleDropdown items={dropdownItems} onChange={toggleKpi} />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {error}
        </div>
      )}

      {visibleKpis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {visibleKpis.map((kpi, index) => {
            const meta = KPI_META[kpi.id as keyof typeof KPI_META] ?? KPI_META.campaigns
            return (
              <div
                key={kpi.id}
                className="scroll-animate"
                style={{ transitionDelay: `${index * 50 + 100}ms` }}
              >
                <KpiCard
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeLabel={kpi.changeLabel}
                  icon={meta.icon}
                  iconBg={meta.iconBg}
                  iconColor={meta.iconColor}
                  prefix={kpi.prefix}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center animate-fade-in">
          <p className="text-sm font-medium text-gray-500">No KPI cards visible</p>
          <p className="text-xs text-gray-400 mt-1">Use the Customize button to show cards</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 scroll-animate delay-200">
        <div className="xl:col-span-2">
          <RevenueChart data={dashboard.publishingTrend} />
        </div>
        <div>
          <ActivityFeed activities={dashboard.recentActivities} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 scroll-animate delay-300">
        <div className="xl:col-span-2">
          <TopAdminsTable creators={dashboard.topCreators} />
        </div>

        <div className="glass-card p-6 animate-fade-in flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Ad Type Breakdown</h3>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">Active campaigns by creative format</p>
            <BreakdownList items={dashboard.adTypeBreakdown} />
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Target Location Focus
            </p>
            <BreakdownList items={dashboard.locationBreakdown} />
          </div>
        </div>
      </div>
    </div>
  )
}

function BreakdownList({ items }: { items: BreakdownItem[] }) {
  if (items.length === 0) {
    return <p className="text-xs text-gray-400">No live campaign data available yet.</p>
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${breakdownColor(index)}`} />
              <span className="text-xs text-gray-700 font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">{item.count}</span>
              <span className="text-xs font-bold text-gray-700">{item.percentage}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`${breakdownColor(index)} h-1.5 rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
