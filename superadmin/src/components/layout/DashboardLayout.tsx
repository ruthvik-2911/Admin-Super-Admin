import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-full overflow-hidden mesh-gradient-bg relative">
      {/* Decorative Floating Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <TopNavbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
