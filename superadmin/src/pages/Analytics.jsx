import React, { useEffect, useMemo, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Download, Calendar, Globe, Clock, BarChart2 as BarChart3, Radio, ChevronDown, Users } from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import StatusBadge from '../components/shared/StatusBadge'
import { AuthError } from '../lib/auth'
import { fetchSuperAdminAnalytics } from '../lib/analytics'

const TABS = [
  { id: 'ad-performance', label: 'Campaign Performance', icon: BarChart3 },
  { id: 'geo-based', label: 'Geo-Based Analytics', icon: Globe },
  { id: 'admin-level', label: 'Creator-Level Analytics', icon: Users },
  { id: 'publisher-level', label: 'Publisher Reach', icon: Radio },
  { id: 'time-based', label: 'Time-Based Analytics', icon: Clock }
]

const COLORS = ['#FF6B00', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

const formatNumber = (value) => {
  if (typeof value === 'number') return value.toLocaleString()
  return value
}

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('ad-performance')
  const [timeRange, setTimeRange] = useState('Last 30 Days')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAnalytics() {
      setLoading(true)
      setError('')

      try {
        const payload = await fetchSuperAdminAnalytics()
        if (cancelled) return
        setAnalytics(payload)
      } catch (err) {
        if (cancelled) return
        if (err instanceof AuthError) {
          setError(err.message)
        } else {
          setError('Unable to load live analytics right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()
    return () => {
      cancelled = true
    }
  }, [])

  const handleExport = () => {
    window.print()
  }

  const visibleData = useMemo(() => analytics ?? {
    kpis: [],
    topCampaigns: [],
    adTypeBreakdown: [],
    locationRows: [],
    radiusBreakdown: [],
    topLocation: 'No targeted location',
    creatorRows: [],
    campaignsPerCreator: [],
    publisherRows: [],
    monthlyTrend: [],
    weeklyTrend: [],
    durationBreakdown: [],
  }, [analytics])

  const renderKPIs = (data = []) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {data.map((kpi, idx) => (
        <div key={`${kpi.title}-${idx}`} className="card-floating tilt-card animate-fade-in-scale group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{kpi.title}</p>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm ${kpi.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%
              </div>
            </div>
            <div className="h-12 w-full mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...Array(8)].map((_, i) => ({ v: (i + 1) * (idx + 2) * 10 }))}>
                  <Line type="monotone" dataKey="v" stroke={kpi.change >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderAdPerformance = () => (
    <div className="space-y-6">
      {renderKPIs(visibleData.kpis)}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Most Reused Campaign Creatives</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleData.topCampaigns}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Campaign count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Campaigns by Ad Type</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visibleData.adTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {visibleData.adTypeBreakdown.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  const renderGeoBased = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-card animate-fade-in flex items-center justify-between border-l-4 border-primary-500">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Targeted Location</p>
          <h3 className="text-2xl font-bold text-gray-900">{visibleData.topLocation}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Impact</p>
          <p className="text-xl font-bold text-primary-600">{visibleData.locationRows[0]?.campaigns ?? 0} campaigns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Location-wise Campaign Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Location</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Campaigns</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Active</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Avg Radius</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleData.locationRows.map((row, idx) => (
                  <tr key={`${row.city}-${idx}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(row.campaigns)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(row.activeCampaigns)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary-600">{row.averageRadiusKm} km</td>
                    <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Campaigns by Radius Bucket</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleData.radiusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Campaign count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAdminLevel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Creator Leaderboard</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Creator Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Campaigns</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Active</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Locations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleData.creatorRows.map((row, idx) => (
                  <tr key={`${row.name}-${idx}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700'
                          : idx === 1 ? 'bg-gray-100 text-gray-600'
                            : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-transparent text-gray-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.campaigns}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">{row.activeCampaigns}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.targetedLocations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Campaigns per Creator</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleData.campaignsPerCreator}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPublisherLevel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Publisher Reach Against Targeted Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Publisher</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Last Known Location</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Nearby Campaigns</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Active Nearby</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleData.publisherRows.map((row, idx) => (
                <tr key={`${row.name}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.campaignsNearby}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.activeCampaignsNearby}</td>
                  <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderTimeBased = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Publishing Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#FF6B00" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#FF6B00', stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Weekly Campaign Creation</h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white shadow-sm transition-all">Weekly</button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Duration vs Average Radius</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleData.durationBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Avg radius (km)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="pb-10">
      <PageHeader
        title="Analytics & Reporting"
        subtitle="Live campaign publishing analytics from Keliri data"
        actions={(
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
              <Download size={16} className="text-primary-500" />
              Export
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={handleExport} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors font-medium border-b border-gray-50">Print / Save PDF</button>
            </div>
          </div>
        )}
      />

      <div className="bg-white border-b border-gray-100 -mx-6 px-6 py-4 mb-8 sticky top-0 z-20 flex flex-wrap items-center gap-4 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <Calendar size={16} className="text-gray-400 ml-2" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none pr-4 cursor-pointer"
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {loading ? 'Loading analytics...' : 'Live analytics mode'}
        </div>

        {error && (
          <div className="text-xs font-bold text-red-500 uppercase tracking-wider">{error}</div>
        )}
      </div>

      <div className="flex items-center gap-1 mb-8 bg-gray-100/50 p-1 rounded-2xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-card h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'ad-performance' && renderAdPerformance()}
          {activeTab === 'geo-based' && renderGeoBased()}
          {activeTab === 'admin-level' && renderAdminLevel()}
          {activeTab === 'publisher-level' && renderPublisherLevel()}
          {activeTab === 'time-based' && renderTimeBased()}
        </div>
      )}
    </div>
  )
}

export default Analytics
