import type { Activity } from '../components/dashboard/RecentActivity'

export interface DashboardStats {
  totalAds: number
  activeAds: number
  expiredAds: number
  totalPublishers: number
  totalSpend: number
  totalClicks: number
  trends: {
    totalAds: number
    activeAds: number
    expiredAds: number
    totalPublishers: number
    totalSpend: number
    totalClicks: number
  }
}

export interface ChartDataPoint {
  name: string
  impressions?: number
  clicks: number
  spend?: number
}

export interface DashboardData {
  stats: DashboardStats
  performanceChart: ChartDataPoint[]
  engagementChart: ChartDataPoint[]
  spendChart: ChartDataPoint[]
  recentActivities: Activity[]
}

const randomDeviation = (base: number, percent: number) => {
  const deviation = base * percent;
  return Math.floor(base + (Math.random() * deviation * 2 - deviation));
};

export const fetchDashboardData = async (filter: string = "30"): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Base data to add randomness to
  const baseStats = {
    totalAds: randomDeviation(1250, 0.05),
    activeAds: randomDeviation(840, 0.05),
    expiredAds: randomDeviation(410, 0.05),
    totalPublishers: randomDeviation(156, 0.05),
    totalSpend: randomDeviation(145000, 0.05),
    totalClicks: randomDeviation(1254000, 0.05)
  }

  // Create chart data
  const performanceChart = Array.from({ length: 30 }).map((_, i) => ({
    name: `D${i + 1}`,
    impressions: randomDeviation(50000, 0.2),
    clicks: randomDeviation(5000, 0.2)
  }))

  const engagementChart = Array.from({ length: 30 }).map((_, i) => ({
    name: `D${i + 1}`,
    clicks: randomDeviation(5000, 0.3)
  }))

  const spendChart = Array.from({ length: 7 }).map((_, i) => ({
    name: `W${i + 1}`,
    spend: randomDeviation(10000, 0.2),
    clicks: randomDeviation(100000, 0.2)
  }))

  const statuses: Activity["status"][] = ["Active", "Draft", "Expired"];
  
  const recentActivities: Activity[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `ad-${Math.floor(Math.random() * 10000)}`,
    title: `Campaign Alpha ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    publisher: `Publisher ${Math.floor(Math.random() * 20) + 1}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
  }))

  return {
    stats: {
      ...baseStats,
      trends: {
        totalAds: 12,
        activeAds: 8,
        expiredAds: -5,
        totalPublishers: 3,
        totalSpend: 15,
        totalClicks: 22
      }
    },
    performanceChart,
    engagementChart,
    spendChart,
    recentActivities
  }
}
