import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  // Global Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // Animate only once
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' })

    const observeElements = () => {
      document.querySelectorAll('.scroll-animate:not(.is-visible)').forEach((el) => {
        observer.observe(el)
      })
    }

    observeElements() // Run once on mount

    // Automatically observe new elements added during route transitions
    const mutationObserver = new MutationObserver(observeElements)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto p-6 dashboard-bg">
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
