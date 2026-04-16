import * as React from "react"
import { useLocation } from "react-router-dom"
import { Bell, ChevronDown, Moon, Sun } from "lucide-react"

export function Header() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const location = useLocation()

  // Map routes to human-readable titles
  const getPageTitle = (path: string) => {
    const titleMap: Record<string, string> = {
      "/admin/dashboard": "Dashboard Overview",
      "/admin/tickets": "Support Hub",
      "/admin/tickets/new": "Raise Support Ticket",
      "/admin/ads": "Ads Manager",
      "/admin/ads/new": "Create New Ad",
      "/admin/payments": "Payment History",
      "/admin/analytics": "Analytics Hub",
      "/admin/publishers": "Publishers",
      "/admin/publishers/new": "Register Publisher",
      "/admin/status": "Registration Status",
    }

    // Handle dynamic routes (e.g., /admin/ads/:id/edit)
    if (path.startsWith("/admin/tickets/") && path !== "/admin/tickets/new") return "Ticket Details"
    if (path.includes("/edit")) {
      if (path.includes("/ads/")) return "Edit Ad"
      if (path.includes("/publishers/")) return "Edit Publisher"
    }
    if (path.includes("/publish")) return "Publish Ad"
    if (path.includes("/pay")) return "Secure Payment"
    if (path.includes("/invoice/")) return "Invoice Detail"
    if (path.startsWith("/admin/publishers/") && path !== "/admin/publishers/new") return "Publisher Details"

    return titleMap[path] || "Admin Panel"
  }

  const currentTitle = getPageTitle(location.pathname)

  React.useEffect(() => {
    // Default to light mode for the premium slate look
    setIsDarkMode(false)
    document.documentElement.classList.remove('dark')
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-9 w-auto object-contain" />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {currentTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1C1F26]"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-semibold group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none mb-1">Admin User</p>
                <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest leading-none">System Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
