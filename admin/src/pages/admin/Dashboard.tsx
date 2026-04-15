import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  Megaphone, 
  AlertCircle, 
  Users, 
  IndianRupee, 
  MousePointerClick,
  Moon,
  Sun
} from "lucide-react"
import { KpiCard } from "../../components/dashboard/KpiCard"
import { PerformanceChart, EngagementChart, SpendPerformanceChart } from "../../components/dashboard/Charts"
import { RecentActivity } from "../../components/dashboard/RecentActivity"
import { Skeleton } from "../../components/ui/Skeleton"
import { fetchDashboardData, type DashboardData } from "../../services/dashboard"

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("30")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchDashboardData(filter)
        setData(result)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filter])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] transition-colors duration-200">
      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-[#1C1F26] p-1 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
             {['Today', '7', '30'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                   filter === f 
                     ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 shadow-sm' 
                     : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                 }`}
               >
                 {f === 'Today' ? f : `Last ${f} Days`}
               </button>
             ))}
          </div>
        </div>


        {/* KPI Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading || !data ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))
          ) : (
            <>
              <KpiCard 
                title="Total Ads Created" 
                value={formatNumber(data.stats.totalAds)} 
                trend={{ value: data.stats.trends.totalAds, isPositive: data.stats.trends.totalAds > 0 }}
                icon={<LayoutDashboard className="w-6 h-6" />}
                delay={0.1}
              />
              <KpiCard 
                title="Active Ads" 
                value={formatNumber(data.stats.activeAds)} 
                trend={{ value: data.stats.trends.activeAds, isPositive: data.stats.trends.activeAds > 0 }}
                icon={<Megaphone className="w-6 h-6" />}
                delay={0.15}
              />
              <KpiCard 
                title="Expired Ads" 
                value={formatNumber(data.stats.expiredAds)} 
                trend={{ value: Math.abs(data.stats.trends.expiredAds), isPositive: data.stats.trends.expiredAds < 0 }} // Less expired is positive
                icon={<AlertCircle className="w-6 h-6" />}
                delay={0.2}
              />
              <KpiCard 
                title="Total Publishers" 
                value={formatNumber(data.stats.totalPublishers)} 
                trend={{ value: data.stats.trends.totalPublishers, isPositive: data.stats.trends.totalPublishers > 0 }}
                icon={<Users className="w-6 h-6" />}
                delay={0.25}
              />
              <KpiCard 
                title="Total Spend" 
                value={formatCurrency(data.stats.totalSpend)} 
                trend={{ value: data.stats.trends.totalSpend, isPositive: data.stats.trends.totalSpend > 0 }}
                icon={<IndianRupee className="w-6 h-6" />}
                delay={0.3}
              />
              <KpiCard 
                title="Total Clicks" 
                value={formatNumber(data.stats.totalClicks)} 
                trend={{ value: data.stats.trends.totalClicks, isPositive: data.stats.trends.totalClicks > 0 }}
                icon={<MousePointerClick className="w-6 h-6" />}
                delay={0.35}
              />
            </>
          )}
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
           {loading || !data ? (
             <>
               <Skeleton className="h-[400px] w-full rounded-2xl" />
               <Skeleton className="h-[400px] w-full rounded-2xl" />
             </>
           ) : (
             <>
               <PerformanceChart data={data.performanceChart} title="Ad Performance Trend" delay={0.4} />
               <EngagementChart data={data.engagementChart} title="Click Engagement" delay={0.5} />
             </>
           )}
        </section>

        {/* Bottom Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {loading || !data ? (
             <>
               <Skeleton className="h-[400px] lg:col-span-1 rounded-2xl" />
               <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl" />
             </>
           ) : (
             <>
               <div className="lg:col-span-1">
                 <SpendPerformanceChart data={data.spendChart} title="Weekly Spend vs Clicks" delay={0.6} />
               </div>
               <div className="lg:col-span-2">
                 <RecentActivity data={data.recentActivities} delay={0.7} />
               </div>
             </>
           )}
        </section>

      </main>
    </div>
  )
}
