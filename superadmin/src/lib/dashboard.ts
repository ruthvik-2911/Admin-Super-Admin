import { API_BASE_URL, AuthError, getAuthSession } from './auth'

export interface DashboardSummary {
  totalAds: number
  totalCampaigns: number
  activeCampaigns: number
  totalPublishers: number
  totalUsers: number
  geoTargetedCampaigns: number
  uniqueTargetLocations: number
  averageTargetRadiusKm: number
}

export interface DashboardKpi {
  id: string
  title: string
  value: string
  change: number
  changeLabel: string
  prefix?: string
}

export interface TrendPoint {
  label: string
  value: number
}

export interface TopCreator {
  rank: number
  name: string
  email: string
  campaignCount: number
  activeCampaignCount: number
  locationCount: number
  change: number
}

export interface RecentActivity {
  id: string
  action: string
  status: string
  locationName: string
  occurredAt: string
}

export interface BreakdownItem {
  label: string
  count: number
  percentage: number
}

export interface SuperAdminDashboardPayload {
  summary: DashboardSummary
  kpis: DashboardKpi[]
  publishingTrend: TrendPoint[]
  topCreators: TopCreator[]
  recentActivities: RecentActivity[]
  adTypeBreakdown: BreakdownItem[]
  locationBreakdown: BreakdownItem[]
}

export async function fetchSuperAdminDashboard(): Promise<SuperAdminDashboardPayload> {
  const session = getAuthSession()

  const response = await fetch(`${API_BASE_URL}/api/superadmin/dashboard`, {
    headers: session?.token
      ? {
          Authorization: `Bearer ${session.token}`,
        }
      : undefined,
  })

  const payload = await response.json().catch(() => null) as
    | SuperAdminDashboardPayload
    | { error?: string; message?: string }
    | null

  if (!response.ok) {
    const errorMessage =
      (payload && 'message' in payload && payload.message) ||
      (payload && 'error' in payload && payload.error) ||
      'Unable to load dashboard'
    throw new AuthError(errorMessage, response.status)
  }

  if (!payload || !('summary' in payload)) {
    throw new AuthError('Unable to load dashboard', response.status)
  }

  return payload
}
