import { useState, useEffect } from "react"
import { 
  LayoutDashboard, 
  Megaphone, 
  AlertCircle,
  Users, 
  IndianRupee, 
  MousePointerClick
} from "lucide-react"
import { KpiCard } from "../../components/dashboard/KpiCard"
import { QuickActions } from "../../components/dashboard/QuickActions"
import { PerformanceChart, EngagementChart, SpendPerformanceChart } from "../../components/dashboard/Charts"
import { RecentActivity } from "../../components/dashboard/RecentActivity"
import { Skeleton } from "../../components/ui/Skeleton"
import { fetchDashboardData, type DashboardData } from "../../services/dashboard"

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("30")


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
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col">
             <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Performance Overview</h1>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time statistics & ad performance</p>
          </div>
          
          <div className="flex items-center gap-1.5 bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm transition-colors">
             {['Today', '7', '30'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                   filter === f 
                     ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-xl scale-[1.05] z-10' 
                     : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                 }`}
               >
                 {f === 'Today' ? f : `${f} Days`}
               </button>
             ))}
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
           <QuickActions />
        </section>


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

      </div>
    </>
  )
}
