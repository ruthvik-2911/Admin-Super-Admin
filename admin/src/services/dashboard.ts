import { api } from './api'
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

export const fetchDashboardData = async (filter: string = "30"): Promise<DashboardData> => {
  try {
    const response = await api.get('/api/admin/dashboard');
    const data = response.data;

    return {
      stats: {
        totalAds: data.totalAds || 0,
        activeAds: data.activeAds || 0,
        expiredAds: data.expiredAds || 0,
        totalPublishers: data.totalPublishers || 0,
        totalSpend: data.totalSpend || 0,
        totalClicks: data.totalClicks || 0,
        trends: {
          totalAds: 12,
          activeAds: 8,
          expiredAds: -5,
          totalPublishers: 3,
          totalSpend: 15,
          totalClicks: 22
        }
      },
      performanceChart: data.performanceTrend ? data.performanceTrend.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: d.impressions,
        clicks: d.clicks
      })) : [],
      engagementChart: data.engagementTrend ? data.engagementTrend.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks: d.clicks
      })) : [],
      spendChart: data.spendVsPerformance ? data.spendVsPerformance.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spend: d.spend,
        clicks: d.clicks
      })) : [],
      recentActivities: []
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data API", error);
    throw error;
  }
}
