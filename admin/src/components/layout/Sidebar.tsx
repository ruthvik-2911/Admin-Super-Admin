import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Megaphone, 
  Globe, 
  BarChart3, 
  CreditCard, 
  LogOut,
  Menu,
  X,
  HelpCircle
} from "lucide-react"
import { cn } from "../../lib/utils"

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Ads Manager", icon: Megaphone, path: "/admin/ads" },
  { label: "Publishers", icon: Globe, path: "/admin/publishers" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Support Hub", icon: HelpCircle, path: "/admin/tickets" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Mock logout logic
    navigate("/admin/login")
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary-500 text-white rounded-2xl shadow-2xl"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-[#13161E] transition-all duration-300 z-40 flex flex-col border-r border-gray-100 dark:border-white/5",
        isOpen ? "w-64" : "w-20 overflow-hidden lg:overflow-visible"
      )}>
        {/* Logo Section */}
        <div className="p-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-100 dark:border-primary-500/20 shadow-sm">
               <img src="/logo.png" alt="" className="h-6 w-auto object-contain" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900 dark:text-white leading-tight">KELIRI</span>
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none">Admin Panel</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 pt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full" />
                )}
                <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-primary-600 dark:text-primary-400" : "group-hover:text-primary-500")} />
                {isOpen && (
                  <span className="text-sm tracking-tight">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-[18px] h-[18px]" />
            {isOpen && <span className="text-xs font-bold dark:text-gray-400">Logout</span>}
          </button>
          
          {isOpen && (
            <div className="mt-4 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
               <div className="flex items-center gap-2.5 text-left">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-amber-500 flex-shrink-0" />
                 <div className="min-w-0">
                    <p className="text-[11px] font-black text-gray-900 dark:text-white truncate">System Admin</p>
                    <p className="text-[9px] font-bold text-primary-500 uppercase tracking-wide">Pro Account</p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
