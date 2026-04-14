import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Megaphone,
  DollarSign,
  Ticket,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Radio,
} from 'lucide-react'
import logo from '../../assets/lightmodelogo.png'
import icon from '../../assets/keliriicon.png'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'admins', label: 'Admin Management', icon: Users, path: '/admins' },
  { id: 'publishers', label: 'Publishers', icon: Radio, path: '/publishers' },
  { id: 'ads', label: 'Advertisements', icon: Megaphone, path: '/ads', badge: '12' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/revenue' },
  { id: 'tickets', label: 'Tickets & Support', icon: Ticket, path: '/tickets', badge: '3' },
  { id: 'sub-admins', label: 'Sub-Admins', icon: ShieldCheck, path: '/sub-admins' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate()

  return (
    <aside
      className={`relative flex flex-col glass-panel shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full flex-shrink-0 z-50
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo Section */}
      <div className={`flex items-center h-24 px-6 mb-2 relative ${collapsed ? 'justify-center px-4' : 'gap-3'}`}>
        {!collapsed ? (
          <div className="animate-fade-in-scale w-full">
            <img src={logo} alt="KELIRI Logo" className="h-10 w-auto object-contain mb-1" />
            <p className="text-[10px] text-primary-600 font-bold tracking-[0.2em] uppercase ml-1 opacity-80">Super Admin</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
              <img src={icon} alt="K" className="w-8 h-8 object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">Core Modules</p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden
                ${isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                  : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-lg hover:shadow-slate-200/50'
                }
                ${collapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110 group-hover:text-primary-500'}`} 
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" />
                  )}
                  {item.badge && !collapsed && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter
                      ${isActive ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl
                                   opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100]
                                   shadow-2xl transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto space-y-2">
        <div className={`p-4 bg-slate-50 rounded-3xl border border-slate-100 ${collapsed ? 'px-2' : ''}`}>
           {!collapsed && (
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                   <Users size={20} className="text-slate-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-black text-slate-900 truncate">Aman Gupta</p>
                   <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-[-2px]">Root Access</p>
                </div>
             </div>
           )}
           <button 
             onClick={() => navigate('/')}
             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black
                        transition-all duration-300
                        ${collapsed ? 'justify-center text-red-500' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-red-200'}
             `}
           >
             <LogOut size={16} />
             {!collapsed && <span>System Exit</span>}
           </button>
        </div>
      </div>
    </aside>
  )
}
