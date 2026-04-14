import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, Calendar, Edit3, Key, Activity, Clock, X } from 'lucide-react'

const activityLog = [
  { id: 1, action: "Approved ad campaign #1092", time: "2 hours ago", date: "14 Apr 2026" },
  { id: 2, action: "Suspended Publisher 'Vidya Media'", time: "4 hours ago", date: "14 Apr 2026" },
  { id: 3, action: "Updated revenue configuration limit", time: "Yesterday", date: "13 Apr 2026" },
  { id: 4, action: "Created Sub-Admin account for 'Arjun M.'", time: "2 days ago", date: "12 Apr 2026" },
  { id: 5, action: "Logged in securely via 2FA", time: "2 days ago", date: "12 Apr 2026" },
]

export default function Profile() {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pb-6 max-w-5xl mx-auto scroll-animate delay-75">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your identity and view your activity log.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in delay-150">
        
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <div className="px-6 pb-6 pt-14 relative">
              <div className="w-20 h-20 bg-white rounded-full p-1.5 absolute -top-10 shadow-sm border border-gray-100">
                <div className="w-full h-full bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl">
                  SA
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">Super Admin</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge-primary px-2.5 py-0.5">Master Control</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <User size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Full Name</p>
                    <p className="text-gray-800 font-medium">System Operator</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Mail size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <p className="text-gray-800 font-medium">admin@keliri.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Shield size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Account Role</p>
                    <p className="text-gray-800 font-medium">Super Administrator</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Calendar size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Joined Date</p>
                    <p className="text-gray-800 font-medium">01 January 2026</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="glass-card p-4 space-y-3">
            <button 
              onClick={() => setShowEditProfile(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-gray-200"
            >
              <Edit3 size={15} /> Edit Profile Info
            </button>
            <button 
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-primary-100"
            >
              <Key size={15} /> Change Password
            </button>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-gray-900 font-bold">
                <Activity size={20} className="text-primary-500" />
                Recent Administration Activity
              </div>
              <button 
                onClick={() => navigate('/audit-logs')}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                View Audit Logs
              </button>
            </div>

            <div className="relative pl-4 space-y-6 mt-2 flex-1">
              <div className="absolute left-6 top-2 bottom-0 w-px bg-gray-100" />
              {activityLog.map((log) => (
                <div key={log.id} className="relative z-10 flex gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-primary-100 border-2 border-white flex-shrink-0 relative">
                    <div className="absolute inset-1 bg-primary-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1"><Clock size={11} /> {log.time}</span>
                      <span>•</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-50 flex justify-center">
              <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
                Load older activities...
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditProfile && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowEditProfile(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile Info</h3>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1.5 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Full Name</label>
                <input type="text" defaultValue="System Operator" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Email Address <span className="font-normal text-gray-400">(Cannot be changed manually)</span></label>
                <input type="email" defaultValue="admin@keliri.com" readOnly className="input-field bg-gray-50 opacity-70 cursor-not-allowed select-none" />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowEditProfile(false)} 
                className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowEditProfile(false)} 
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Change Password Modal ── */}
      {showChangePassword && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowChangePassword(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <button onClick={() => setShowChangePassword(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1.5 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Current Password</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div className="h-px bg-gray-100 my-1" />
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">New Password</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              
              <ul className="text-[11px] text-gray-500 space-y-1 list-disc pl-4 mt-2">
                <li>Must be at least 8 characters long</li>
                <li>Must contain at least 1 number and 1 symbol</li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowChangePassword(false)} 
                className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowChangePassword(false)} 
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
