import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Shield, ChevronRight, Save } from 'lucide-react'

type Tab = 'general' | 'notifications' | 'security'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('general')

  return (
    <div className="space-y-6 pb-6 max-w-[1400px] mx-auto scroll-animate delay-75">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Platform Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage global configurations, alerts, and security preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Menu */}
        <div className="lg:w-64 flex-shrink-0 animate-fade-in delay-150">
          <div className="glass-card p-2 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === 'general' 
                  ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
            >
              <div className="flex items-center gap-3">
                <SettingsIcon size={18} className={activeTab === 'general' ? 'text-primary-500' : 'text-gray-400'} />
                General Config
              </div>
              <ChevronRight size={14} className={activeTab === 'general' ? 'opacity-100' : 'opacity-0'} />
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === 'notifications' 
                  ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className={activeTab === 'notifications' ? 'text-primary-500' : 'text-gray-400'} />
                Notifications
              </div>
              <ChevronRight size={14} className={activeTab === 'notifications' ? 'opacity-100' : 'opacity-0'} />
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === 'security' 
                  ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
            >
              <div className="flex items-center gap-3">
                <Shield size={18} className={activeTab === 'security' ? 'text-primary-500' : 'text-gray-400'} />
                Security
              </div>
              <ChevronRight size={14} className={activeTab === 'security' ? 'opacity-100' : 'opacity-0'} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 animate-fade-in delay-200">
          <div className="glass-card p-6 h-full min-h-[500px]">
            
            {activeTab === 'general' && (
              <div className="space-y-6 scroll-animate">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">General Configuration</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Update standard details that display publicly or apply globally.</p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Platform Name</label>
                    <input type="text" defaultValue="KELIRI Super Admin" className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Support Email</label>
                    <input type="email" defaultValue="support@keliri.com" className="input-field" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Base Revenue Share (%)</label>
                    <input type="number" defaultValue={15} className="input-field" />
                  </div>
                </div>

                <div className="pt-4 flex">
                  <button className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-600 hover:shadow-md transition-all">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 scroll-animate">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Email & System Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Manage which alerts get dispatched to your email versus system tray.</p>
                </div>

                <div className="space-y-4 max-w-2xl">
                  {/* Toggle items */}
                  {[
                    { id: 1, title: 'New Sub-Admin Registration', desc: 'Alert when a new admin is added to the system.' },
                    { id: 2, title: 'Ad Campaign Expiries', desc: 'Get notified 24 hours before a campaign ends.' },
                    { id: 3, title: 'High-Value Payout Requests', desc: 'Alerts for automated payout requests above ₹20,000.' },
                    { id: 4, title: 'Unresolved Ticket Nagging', desc: 'Weekly digest of tickets older than 48 hours.' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-start justify-between border border-gray-100 dark:border-gray-800 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/40">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{setting.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 scroll-animate">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Security & Access</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Review your authenticated sessions and enable multi-factor auth.</p>
                </div>

                <div className="max-w-2xl space-y-6">
                  <div className="border border-green-100 dark:border-green-900/40 bg-green-50/50 dark:bg-green-900/20 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-3">Your account is heavily secured. Time-based OTPs are required for dashboard login.</p>
                      <button className="text-xs font-semibold px-3 py-1.5 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                        Disable 2FA
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Active Sessions</h4>
                    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Windows PC • Chrome</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hyderabad, IN • IP: 192.168.1.1</p>
                        </div>
                        <span className="badge-success px-2 py-0.5 text-[10px]">Active Now</span>
                      </div>
                      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">MacBook Pro • Safari</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bengaluru, IN • Last seen 3 days ago</p>
                        </div>
                        <button className="text-xs font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
