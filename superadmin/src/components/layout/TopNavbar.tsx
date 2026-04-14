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
    <header className="h-20 glass border-b border-slate-100/50 flex items-center px-8 gap-6 sticky top-0 z-[40]">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
      >
        <Menu size={20} />
      </button>

      {/* Global Command Search */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Command center: search entities, reports, or settings..."
          className="w-full pl-12 pr-6 py-3 bg-slate-100/50 border border-slate-200/50 rounded-2xl text-sm font-bold
                     placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5
                     transition-all duration-300"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 group-focus-within:opacity-0 transition-opacity">
           <span className="text-[10px] font-black bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300">CTRL</span>
           <span className="text-[10px] font-black bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300">K</span>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Quick Reports Button */}
        <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
           Deep Analysis
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

        {/* Notifications Hub */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className={`relative p-3 rounded-2xl transition-all active:scale-90
              ${notifOpen ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
            `}
          >
            <Bell size={20} className={unreadCount > 0 ? 'animate-bell' : ''} />
            {unreadCount > 0 && (
              <span className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white
                ${notifOpen ? 'bg-white' : 'bg-primary-500'}
              `} />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-14 w-[380px] card-floating animate-fade-in-scale p-0 overflow-hidden z-[51]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                <p className="font-black text-slate-900 text-sm uppercase tracking-wider">Alert Center</p>
                <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-black rounded-full">{unreadCount} Critical</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-6 py-4 hover:bg-slate-50 transition-all cursor-pointer group ${n.unread ? 'bg-primary-500/[0.03]' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-primary-500' : 'bg-slate-200'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700 leading-snug group-hover:text-slate-900">{n.text}</p>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-slate-50 text-center">
                <button className="text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                  Process All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className={`flex items-center gap-3 p-1 rounded-2xl transition-all border
              ${profileOpen ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 hover:border-slate-300'}
            `}
          >
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center relative shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent" />
                <User size={20} className={profileOpen ? 'text-primary-500' : 'text-slate-500'} />
            </div>
            <div className="text-left hidden lg:block pr-2">
              <p className={`text-xs font-black leading-none ${profileOpen ? 'text-white' : 'text-slate-900'}`}>Aman Gupta</p>
              <p className={`text-[10px] font-bold mt-1 ${profileOpen ? 'text-primary-400' : 'text-slate-400'}`}>ADMIN ROOT</p>
            </div>
            <ChevronDown size={14} className={`mr-2 transition-transform duration-300 ${profileOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-60 card-floating animate-fade-in-scale p-2 z-[51]">
              <div className="p-4 mb-2 bg-slate-900 rounded-2xl relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-500/20 rounded-full blur-xl" />
                  <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Authenticated As</p>
                  <p className="text-sm font-black text-white leading-tight">Super Admin Level 1</p>
              </div>
              <div className="space-y-1">
                <button 
                  onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"
                >
                  <User size={16} /> ACCOUNT PROFILE
                </button>
                <button 
                  onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"
                >
                  <Settings size={16} /> SYSTEM SETTINGS
                </button>
                <div className="h-px bg-slate-50 mx-2 my-1" />
                <button
                  onClick={() => { navigate('/'); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={16} /> TERMINATE SESSION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
