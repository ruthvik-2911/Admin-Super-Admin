import { API_BASE_URL, AuthError, getAuthSession } from './auth'

export async function fetchSuperAdminAnalytics() {
  const session = getAuthSession()

  const response = await fetch(`${API_BASE_URL}/api/superadmin/analytics`, {
    headers: session?.token
      ? {
          Authorization: `Bearer ${session.token}`,
        }
      : undefined,
  })

  const payload = await response.json().catch(() => null) as
    | Record<string, unknown>
    | { error?: string; message?: string }
    | null

  if (!response.ok) {
    const errorMessage =
      (payload && 'message' in payload && payload.message) ||
      (payload && 'error' in payload && payload.error) ||
      'Unable to load analytics'
    throw new AuthError(String(errorMessage), response.status)
  }

  if (!payload || !('kpis' in payload)) {
    throw new AuthError('Unable to load analytics', response.status)
  }

  return payload
}
