import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Revenue from './pages/Revenue'
import Transactions from './pages/Transactions'
import AuditLogs from './pages/AuditLogs'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import DashboardLayout from './components/layout/DashboardLayout'
import Analytics from './pages/Analytics'
import AdminManagement from './pages/AdminManagement'
import PublisherMonitoring from './pages/PublisherMonitoring'
import AdvertisementMonitoring from './pages/AdvertisementMonitoring'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admins" element={<AdminManagement />} />
          <Route path="/publishers" element={<PublisherMonitoring />} />
          <Route path="/ads" element={<AdvertisementMonitoring />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
