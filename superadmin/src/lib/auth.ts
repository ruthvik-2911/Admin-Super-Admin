export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const AUTH_STORAGE_KEY = 'keliri_superadmin_auth'

export interface AuthSession {
  token: string
  email: string
  role: string
  expiresAt: number
}

interface LoginResponse {
  token: string
  message: string
  expiresInHours?: number
}

export class AuthError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    const session = JSON.parse(raw) as AuthSession
    if (!session.token || !session.email || !session.expiresAt) {
      clearAuthSession()
      return null
    }

    if (Date.now() >= session.expiresAt) {
      clearAuthSession()
      return null
    }

    return session
  } catch {
    clearAuthSession()
    return null
  }
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function loginSuperAdmin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/superadmin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const payload = await response.json().catch(() => null) as LoginResponse | { error?: string; message?: string } | null

  if (!response.ok) {
    const errorMessage =
      (payload && 'message' in payload && payload.message) ||
      (payload && 'error' in payload && payload.error) ||
      'Login failed'
    throw new AuthError(errorMessage, response.status)
  }

  if (!payload || !('token' in payload) || !payload.token) {
    throw new AuthError('Login failed', response.status)
  }

  return payload
}

export function persistAuthSession(email: string, token: string, expiresInHours = 24) {
  const session: AuthSession = {
    token,
    email,
    role: 'SUPER_ADMIN',
    expiresAt: Date.now() + expiresInHours * 60 * 60 * 1000,
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export async function logoutSuperAdmin() {
  const session = getAuthSession()

  try {
    await fetch(`${API_BASE_URL}/api/auth/superadmin/logout`, {
      method: 'POST',
      headers: session?.token
        ? {
            Authorization: `Bearer ${session.token}`,
          }
        : undefined,
    })
  } catch {
    // Logout should still clear local state if the backend is unreachable.
  } finally {
    clearAuthSession()
  }
}
