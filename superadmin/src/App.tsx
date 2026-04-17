import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Revenue from './pages/Revenue'
import Transactions from './pages/Transactions'
import AuditLogs from './pages/AuditLogs'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AdminManagement from './pages/AdminManagement'
import PublisherMonitoring from './pages/PublisherMonitoring'
import AdvertisementMonitoring from './pages/AdvertisementMonitoring'
import Analytics from './pages/Analytics'
import Tickets from './pages/Tickets'
import SubAdmins from './pages/SubAdmins'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PermissionRoute from './components/auth/PermissionRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route element={<PermissionRoute permission="dashboard" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<PermissionRoute permission="analytics" />}>
              <Route path="/analytics" element={<Analytics />} />
            </Route>
            <Route element={<PermissionRoute permission="admins" />}>
              <Route path="/admins" element={<AdminManagement />} />
            </Route>
            <Route element={<PermissionRoute permission="publishers" />}>
              <Route path="/publishers" element={<PublisherMonitoring />} />
            </Route>
            <Route element={<PermissionRoute permission="ads" />}>
              <Route path="/ads" element={<AdvertisementMonitoring />} />
            </Route>
            <Route element={<PermissionRoute permission="revenue" />}>
              <Route path="/revenue" element={<Revenue />} />
            </Route>
            <Route element={<PermissionRoute permission="transactions" />}>
              <Route path="/transactions" element={<Transactions />} />
            </Route>
            <Route element={<PermissionRoute permission="tickets" />}>
              <Route path="/tickets" element={<Tickets />} />
            </Route>
            <Route element={<PermissionRoute permission="auditLogs" />}>
              <Route path="/audit-logs" element={<AuditLogs />} />
            </Route>
            <Route element={<PermissionRoute permission="profile" />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<PermissionRoute permission="settings" />}>
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route element={<PermissionRoute permission="subAdmins" />}>
              <Route path="/sub-admins" element={<SubAdmins />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
