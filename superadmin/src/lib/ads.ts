import { API_BASE_URL, AuthError, getAuthSession } from './auth'

export interface AdvertisementRecord {
  id: string
  title: string
  description?: string | null
  type: string
  adminId: string
  adminName: string
  publisherId: string
  publisherName: string
  createdDate: string
  status: string
  impressions?: number | null
  clicks?: number | null
  ctr?: number | null
  startDate: string
  endDate: string
  location: string
  radius: string
  image?: string | null
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

export async function fetchAdvertisements(): Promise<AdvertisementRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/superadmin/ads`, {
    headers: authHeaders(),
  })

  return handleJsonResponse<AdvertisementRecord[]>(response, 'Unable to fetch advertisements')
}

export async function suspendAdvertisement(campaignId: string): Promise<AdvertisementRecord> {
  const response = await fetch(`${API_BASE_URL}/api/superadmin/ads/${campaignId}/suspend`, {
    method: 'POST',
    headers: authHeaders(),
  })

  return handleJsonResponse<AdvertisementRecord>(response, 'Unable to suspend advertisement')
}
