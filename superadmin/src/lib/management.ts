import { API_BASE_URL, AuthError, getAuthSession } from './auth'

export interface AdminRecord {
  id: string
  name: string
  email: string
  company: string
  registeredDate: string
  status: string
  phone: string
}

export interface PublisherMini {
  id: string
  name: string
  status: string
  adsPosted: number
}

export interface AdminDetail extends AdminRecord {
  performance: {
    totalAds: number
    revenue: number
    avgCtr: number
  }
  documents: Array<{
    name: string
    type: string
    url: string
  }>
  publishers: PublisherMini[]
}

export interface EmailNotificationRecord {
  id: string
  trigger: string
  to: string
  content: string
  timestamp: string
}

export interface AdminActionResponse {
  admin: AdminRecord
  emailNotification?: EmailNotificationRecord | null
}

export interface PublisherRecord {
  id: string
  name: string
  adminId: string
  adminName: string
  location: string
  adsPosted: number
  impressions: number
  clicks: number
  engagement: number
  status: string
  email: string
  phone: string
  joinDate: string
}

export interface PublisherDetail extends PublisherRecord {
  ads: Array<{
    id: string
    title: string
    type: string
    status: string
    ctr: number
  }>
}

export interface AuditLogRecord {
  id: string
  timestamp: string
  actorName: string
  actorRole: string
  actionType: string
  entityType: string
  entityId: string
  action: string
  ip: string
}

function authHeaders() {
  const session = getAuthSession()
  return session?.token
    ? {
        Authorization: `Bearer ${session.token}`,
      }
    : undefined
}

async function handleJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = await response.json().catch(() => null) as T | { error?: string; message?: string } | null

  if (!response.ok) {
    const errorMessage =
      (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
      (payload && typeof payload === 'object' && 'error' in payload && payload.error) ||
      fallbackMessage
    throw new AuthError(String(errorMessage), response.status)
  }

  return payload as T
}

export async function fetchAdmins(params?: { search?: string; status?: string }): Promise<AdminRecord[]> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.status) query.set('status', params.status)

  const response = await fetch(`${API_BASE_URL}/api/superadmin/admins?${query.toString()}`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<AdminRecord[]>(response, 'Unable to fetch admins')
}

export async function fetchAdminDetail(adminId: string): Promise<AdminDetail> {
  const response = await fetch(`${API_BASE_URL}/api/superadmin/admins/${adminId}`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<AdminDetail>(response, 'Unable to fetch admin details')
}

export async function runAdminAction(adminId: string, action: 'approve' | 'reject' | 'suspend' | 'reinstate', reason?: string): Promise<AdminActionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/superadmin/admins/${adminId}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders() ?? {}),
    },
    body: action === 'reject' ? JSON.stringify({ reason }) : undefined,
  })

  return handleJsonResponse<AdminActionResponse>(response, 'Unable to perform admin action')
}

export async function fetchAdminNotifications(): Promise<EmailNotificationRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/superadmin/admin-notifications`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<EmailNotificationRecord[]>(response, 'Unable to fetch notifications')
}

export async function fetchPublishers(params?: { adminId?: string; status?: string; location?: string; search?: string }): Promise<PublisherRecord[]> {
  const query = new URLSearchParams()
  if (params?.adminId) query.set('adminId', params.adminId)
  if (params?.status) query.set('status', params.status)
  if (params?.location) query.set('location', params.location)
  if (params?.search) query.set('search', params.search)

  const response = await fetch(`${API_BASE_URL}/api/superadmin/publishers?${query.toString()}`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<PublisherRecord[]>(response, 'Unable to fetch publishers')
}

export async function fetchPublisherDetail(publisherId: string): Promise<PublisherDetail> {
  const response = await fetch(`${API_BASE_URL}/api/superadmin/publishers/${publisherId}`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<PublisherDetail>(response, 'Unable to fetch publisher details')
}

export async function fetchAuditLogs(params?: {
  search?: string
  actionType?: string
  actorRole?: string
  entityType?: string
  fromDate?: string
  toDate?: string
}): Promise<AuditLogRecord[]> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.actionType) query.set('actionType', params.actionType)
  if (params?.actorRole) query.set('actorRole', params.actorRole)
  if (params?.entityType) query.set('entityType', params.entityType)
  if (params?.fromDate) query.set('fromDate', params.fromDate)
  if (params?.toDate) query.set('toDate', params.toDate)

  const response = await fetch(`${API_BASE_URL}/api/superadmin/audit-logs?${query.toString()}`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<AuditLogRecord[]>(response, 'Unable to fetch audit logs')
}
