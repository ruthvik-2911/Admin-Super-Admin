import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Megaphone, 
  Globe, 
  BarChart3, 
  HelpCircle, 
  CreditCard,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { cn } from "../../lib/utils"

const navItems = [
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
  activeItem?: string
}

export function Sidebar({ isOpen, setIsOpen, activeItem }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-0 left-0 h-screen bg-[#1a1a1a] z-50 w-[280px] flex flex-col transition-transform duration-300 border-r border-[#2a2a2a] shadow-2xl lg:shadow-none",
        !isOpen ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
      )}>
        {/* Top Section */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/keliri-logo.png" 
              alt="Keliri Logo" 
              className="w-[36px] h-[36px] object-contain shrink-0 bg-white rounded-lg p-1" 
            />
            <div className="flex flex-col">
              <span className="text-white font-bold text-base leading-tight tracking-wide">KELIRI</span>
              <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-[0.15em] mt-0.5">ADMIN PORTAL</span>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white transition lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Desktop pure decorative icon as specified (A hamburger/menu icon top right of sidebar) */}
          <div className="hidden lg:flex text-gray-400 cursor-pointer hover:text-white transition">
            <Menu className="w-5 h-5" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const isActive = activeItem 
              ? activeItem === item.label 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-full transition-all group font-sans w-full",
                  isActive 
                    ? "bg-[#E8640C] text-white shadow-md shadow-[#E8640C]/20" 
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-100"
                )}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile navigation
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className={cn("w-[22px] h-[22px] transition-colors", isActive ? "text-white" : "group-hover:text-gray-100")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn("text-[15px] transition-all", isActive ? "font-bold" : "font-medium")}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
