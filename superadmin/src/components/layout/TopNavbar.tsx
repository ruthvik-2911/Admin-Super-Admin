import { useState } from 'react'
import { Bell, Search, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TopNavbarProps {
  onMenuToggle: () => void
}

const notifications = [
  { id: 1, text: 'New admin registration pending approval', time: '2m ago', unread: true },
  { id: 2, text: 'Ad campaign #1042 has expired', time: '18m ago', unread: true },
  { id: 3, text: 'Support ticket #302 needs attention', time: '1h ago', unread: false },
]

export default function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="h-16 bg-white shadow-navbar flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search admins, ads, publishers..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl
                     focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
                     transition-all duration-200 placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold
                               rounded-full flex items-center justify-center animate-pulse-soft">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-card-hover border border-gray-100 z-50 animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">Notifications</p>
                <span className="badge-primary text-[10px] px-2 py-0.5">{unreadCount} new</span>
              </div>
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-primary-50/40' : ''}`}>
                    <div className="flex items-start gap-3">
                      {n.unread && <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />}
                      {!n.unread && <span className="w-2 h-2 rounded-full bg-transparent mt-1.5 flex-shrink-0" />}
                      <div>
                        <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">SA</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-gray-800">Super Admin</p>
              <p className="text-[10px] text-gray-500">admin@keliri.com</p>
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-card-hover border border-gray-100 z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800">Super Admin</p>
                <p className="text-[10px] text-gray-400">admin@keliri.com</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> Profile
                </button>
                <button 
                  onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={14} /> Settings
                </button>
                <button
                  onClick={() => { navigate('/'); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
