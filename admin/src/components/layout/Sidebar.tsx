import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Megaphone, 
  Globe, 
  BarChart3, 
  CreditCard, 
  LogOut,
  ChevronRight,
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
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-brand-500 text-white rounded-2xl shadow-2xl"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-[#0E1117] border-r border-gray-800 transition-all duration-300 z-40 flex flex-col",
        isOpen ? "w-72" : "w-20 overflow-hidden lg:overflow-visible"
      )}>
        {/* Logo Section */}
        <div className="p-6 pb-12 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 overflow-hidden">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/20 flex-shrink-0">
              K
            </div>
            {isOpen && (
               <div className="animate-in fade-in slide-in-from-left-2 duration-300 truncate">
                  <h1 className="text-xl font-black text-white tracking-tighter">KELIRI</h1>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">Admin Portal</p>
               </div>
            )}
          </div>
          
          {/* Dashboard Toggle (Three Lines) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all active:scale-90"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative",
                  isActive 
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-brand-400")} />
                {isOpen && (
                  <span className="text-sm font-bold animate-in fade-in duration-300">{item.label}</span>
                )}
                {isActive && isOpen && (
                   <ChevronRight className="absolute right-4 w-4 h-4 opacity-50" />
                )}
                
                {/* Tooltip for collapsed mode */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all group relative"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            {isOpen && (
               <span className="text-sm font-bold">Logout</span>
            )}

            {!isOpen && (
              <div className="absolute left-full ml-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
          
          {isOpen && (
            <div className="mt-4 px-4 py-4 bg-gray-800/20 rounded-2xl border border-gray-800/50 animate-in fade-in zoom-in duration-500">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-amber-500" />
                 <div>
                    <p className="text-xs font-black text-white">System Admin</p>
                    <p className="text-[10px] font-medium text-gray-500">Pro License</p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
