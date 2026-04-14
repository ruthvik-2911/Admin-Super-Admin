import { TrendingUp, TrendingDown } from 'lucide-react'

const topAdmins = [
  { rank: 1, name: 'Arjun Mehta', email: 'arjun@keliri.com', revenue: '₹2,45,000', ads: 38, change: 12.5 },
  { rank: 2, name: 'Priya Sharma', email: 'priya@keliri.com', revenue: '₹1,98,500', ads: 31, change: 8.2 },
  { rank: 3, name: 'Ravi Kumar', email: 'ravi@keliri.com', revenue: '₹1,72,000', ads: 27, change: -3.1 },
  { rank: 4, name: 'Sneha Patel', email: 'sneha@keliri.com', revenue: '₹1,45,200', ads: 22, change: 5.7 },
  { rank: 5, name: 'Vikram Singh', email: 'vikram@keliri.com', revenue: '₹1,10,800', ads: 18, change: -1.4 },
]

const rankColors = [
  'bg-yellow-400 text-white',
  'bg-gray-300 text-gray-800',
  'bg-orange-300 text-white',
  'bg-gray-100 text-gray-600',
  'bg-gray-100 text-gray-600',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase()
}

export default function TopAdminsTable() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Top Admins by Revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">This month's performance ranking</p>
        </div>
        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Full report
        </button>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">#</th>
              <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Admin</th>
              <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Revenue</th>
              <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Ads</th>
              <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topAdmins.map((admin) => (
              <tr
                key={admin.rank}
                className="hover:bg-gray-50 transition-colors cursor-pointer group rounded-xl"
              >
                <td className="py-3 px-2">
                  <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${rankColors[admin.rank - 1]}`}>
                    {admin.rank}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full
                                    flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                      {getInitials(admin.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm leading-none">{admin.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="font-semibold text-gray-800">{admin.revenue}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="badge bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {admin.ads} ads
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className={`flex items-center gap-1 text-xs font-semibold
                    ${admin.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {admin.change >= 0
                      ? <TrendingUp size={13} />
                      : <TrendingDown size={13} />
                    }
                    {Math.abs(admin.change)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
