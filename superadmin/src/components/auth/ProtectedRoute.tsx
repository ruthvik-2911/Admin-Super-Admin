import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '../../lib/auth'

export default function ProtectedRoute() {
  const location = useLocation()
  const session = getAuthSession()

  if (!session) {
    clearAuthSession()
    const reason = localStorage.getItem('keliri_session_expired') === 'true' ? 'session-expired' : 'unauthorized'
    localStorage.removeItem('keliri_session_expired')
    return <Navigate to={`/?reason=${reason}`} replace state={{ from: location.pathname }} />
  }

  if (Date.now() >= session.expiresAt) {
    clearAuthSession()
    localStorage.setItem('keliri_session_expired', 'true')
    return <Navigate to="/?reason=session-expired" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
