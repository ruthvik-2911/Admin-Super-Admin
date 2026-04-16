import { Download, Calendar, DollarSign, Activity, Wallet, CreditCard } from 'lucide-react'
import KpiCard from '../components/dashboard/KpiCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import RevenueDistributionChart from '../components/revenue/RevenueDistributionChart'
import TransactionsTable from '../components/revenue/TransactionsTable'

export default function Revenue() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Revenue Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Complete financial analytics and revenue tracking · {today}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300
                           px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar size={14} className="text-gray-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-500/30 text-primary-600 dark:text-primary-400
                           px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 scroll-animate delay-75">
        <KpiCard
          title="Total Revenue"
          value="12,45,800"
          change={14.2}
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          prefix="₹"
        />
        <KpiCard
          title="Avg Revenue / Ad"
          value="980"
          change={5.4}
          icon={Activity}
          iconBg="bg-primary-50"
          iconColor="text-primary-500"
          prefix="₹"
          changeLabel="vs last month"
        />
        <KpiCard
          title="Projected Revenue"
          value="1,85,000"
          change={12.5}
          icon={Wallet}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          prefix="₹"
          changeLabel="Forecast for this month"
        />
        <KpiCard
          title="Total Transactions"
          value="1,492"
          change={8.9}
          icon={CreditCard}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          changeLabel="Completed this month"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 scroll-animate delay-150">
        <div className="xl:col-span-2">
          {/* Re-use RevenueChart from Dashboard but as full block */}
          <RevenueChart />
        </div>
        <div>
          <RevenueDistributionChart />
        </div>
      </div>

      {/* ── Transactions Table Row ── */}
      <div className="grid grid-cols-1 scroll-animate delay-200">
        <TransactionsTable />
      </div>
    </div>
  )
}
