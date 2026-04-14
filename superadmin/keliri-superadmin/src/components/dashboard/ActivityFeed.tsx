import { ShieldCheck, Megaphone, Users, CheckCircle, AlertCircle } from 'lucide-react'

const activities = [
  {
    id: 1,
    action: 'Admin "Ravi Kumar" was approved',
    time: '2 minutes ago',
    icon: ShieldCheck,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    action: 'Ad campaign #1042 "Summer Sale Banner" expired',
    time: '18 minutes ago',
    icon: Megaphone,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    id: 3,
    action: 'New publisher "TechNews Mumbai" registered',
    time: '1 hour ago',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 4,
    action: 'Support ticket #302 resolved successfully',
    time: '2 hours ago',
    icon: CheckCircle,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
  },
  {
    id: 5,
    action: 'Ad campaign #1058 rejected — policy violation',
    time: '3 hours ago',
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
  },
]

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest platform events</p>
        </div>
        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                              group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={14} className={item.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed">{item.action}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
              </div>
              {/* Timeline dot */}
              {index < activities.length - 1 && (
                <div className="absolute left-[27px] mt-9 w-px h-4 bg-gray-100" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
