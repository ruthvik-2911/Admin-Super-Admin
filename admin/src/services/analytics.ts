export interface AnalyticsFilters {
  dateRange: string
  adId: string
  publisherId: string
  adType: string
  status: string
}

export interface KpiData {
  impressions: number
  clicks: number
  ctr: number
  spend: number
  activeCampaigns: number
  trends: {
    impressions: number
    clicks: number
    ctr: number
    spend: number
  }
}

export interface TrendData {
  time: string
  impressions: number
  clicks: number
  spend: number
}

export interface BreakdownItem {
  name: string
  value: number
  percentage: number
}

export interface AnalyticsData {
  kpis: KpiData
  trends: TrendData[]
  breakdowns: {
    byAd: BreakdownItem[]
    byPublisher: BreakdownItem[]
    byLocation: BreakdownItem[]
  }
  insights: string[]
}

const generateTrends = (days: number): TrendData[] => {
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - i))
    return {
      time: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      impressions: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 200) + 20,
      spend: Math.floor(Math.random() * 1000) + 100
    }
  })
}

export const fetchAnalytics = async (filters: AnalyticsFilters): Promise<AnalyticsData> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // In a real app, these filters would be sent to the backend
  console.log("Fetching analytics with filters:", filters)

  const days = filters.dateRange === "Today" ? 1 : filters.dateRange === "Last 7 Days" ? 7 : 30
  
  return {
    kpis: {
      impressions: 124500,
      clicks: 8420,
      ctr: 6.76,
      spend: 42500,
      activeCampaigns: 12,
      trends: {
        impressions: 12,
        clicks: 8,
        ctr: 2.1,
        spend: -5
      }
    },
    trends: generateTrends(days),
    breakdowns: {
      byAd: [
        { name: "Summer Sale 2026", value: 3400, percentage: 40 },
        { name: "Winter Clearance", value: 2100, percentage: 25 },
        { name: "New Store Hero", value: 1700, percentage: 20 },
        { name: "Flash Deal", value: 1220, percentage: 15 }
      ],
      byPublisher: [
        { name: "Phoenix Mall Mumbai", value: 4500, percentage: 45 },
        { name: "High Street Bangalore", value: 3000, percentage: 30 },
        { name: "Global Hub Delhi", value: 2500, percentage: 25 }
      ],
      byLocation: [
        { name: "Mumbai", value: 5000, percentage: 50 },
        { name: "Delhi", value: 3000, percentage: 30 },
        { name: "Bangalore", value: 2000, percentage: 20 }
      ]
    },
    insights: [
      "Targeting Mumbai locations increased CTR by 15% this week.",
      "Video ads are outperforming Banner ads by 2.4x in engagement.",
      "Peak activity detected between 6 PM - 9 PM daily.",
      "Cost per click (CPC) has dropped by 5% vs last month."
    ]
  }
}

export const exportAnalyticsCSV = (data: AnalyticsData) => {
  const headers = ["Metric", "Value"]
  const rows = [
    ["Total Impressions", data.kpis.impressions],
    ["Total Clicks", data.kpis.clicks],
    ["CTR %", data.kpis.ctr],
    ["Total Spend", data.kpis.spend],
    ["Active Campaigns", data.kpis.activeCampaigns]
  ]
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n")
    
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `analytics_export_${new Date().toISOString()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
