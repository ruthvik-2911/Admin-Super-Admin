import { TrendingUp, TrendingDown } from 'lucide-react'

const topAdmins = [
  { rank: 1, name: 'Arjun Mehta',   email: 'arjun@keliri.com',  revenue: '₹2,45,000', ads: 38, change: 12.5 },
  { rank: 2, name: 'Priya Sharma',  email: 'priya@keliri.com',  revenue: '₹1,98,500', ads: 31, change: 8.2  },
  { rank: 3, name: 'Ravi Kumar',    email: 'ravi@keliri.com',   revenue: '₹1,72,000', ads: 27, change: -3.1 },
  { rank: 4, name: 'Sneha Patel',   email: 'sneha@keliri.com',  revenue: '₹1,45,200', ads: 22, change: 5.7  },
  { rank: 5, name: 'Vikram Singh',  email: 'vikram@keliri.com', revenue: '₹1,10,800', ads: 18, change: -1.4 },
]

const rankBadge = [
  'bg-yellow-400 text-white',
  'bg-gray-300 text-gray-700',
  'bg-orange-300 text-white',
  'bg-gray-100 text-gray-500',
  'bg-gray-100 text-gray-500',
]

const avatarGradients = [
  'from-orange-300 to-primary-500',
  'from-blue-300 to-blue-500',
  'from-purple-300 to-purple-500',
  'from-teal-300 to-teal-500',
  'from-indigo-300 to-indigo-500',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase()
}

export default function TopAdminsTable() {
  return (
    <div className="glass-card p-6 animate-fade-in h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Top Admins by Revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">This month's performance ranking</p>
        </div>
        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Full report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-3 text-left w-8">#</th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-3 text-left">Admin</th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-3 text-right">Revenue</th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-3 text-center">Ads</th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-3 text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {topAdmins.map((admin, i) => (
              <tr
                key={admin.rank}
                className="hover:bg-gray-50/70 transition-colors cursor-pointer group border-t border-gray-50"
              >
                {/* Rank */}
                <td className="py-3 pr-2">
                  <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${rankBadge[i]}`}>
                    {admin.rank}
                  </span>
                </td>

                {/* Avatar + name */}
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 bg-gradient-to-br ${avatarGradients[i]} rounded-full
                                     flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {getInitials(admin.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 leading-none">{admin.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{admin.email}</p>
                    </div>
                  </div>
                </td>

                {/* Revenue */}
                <td className="py-3 text-right">
                  <span className="text-sm font-semibold text-gray-800">{admin.revenue}</span>
                </td>

                {/* Ads */}
                <td className="py-3 text-center">
                  <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                    {admin.ads}
                  </span>
                </td>

                {/* Trend */}
                <td className="py-3 text-right">
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold
                    ${admin.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {admin.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(admin.change)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
