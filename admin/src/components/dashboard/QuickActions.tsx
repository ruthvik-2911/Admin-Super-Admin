import * as React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { PlusCircle, Rocket, UserPlus, CreditCard, BarChart3, ChevronRight } from "lucide-react"

export function QuickActions() {
  const navigate = useNavigate()
  
  const actions = [
    {
      title: "Create New Ad",
      icon: <PlusCircle className="w-5 h-5" />,
      color: "from-primary-500 to-primary-600 shadow-primary-500/20",
      path: "/admin/ads/new",
      delay: 0.1,
    },
    {
      title: "Publish Ad",
      icon: <Rocket className="w-5 h-5" />,
      color: "from-primary-600 to-primary-700 shadow-primary-600/20",
      path: "/admin/ads",
      delay: 0.2,
    },
    {
      title: "Add Publisher",
      icon: <UserPlus className="w-5 h-5" />,
      color: "from-primary-500 to-amber-500 shadow-primary-500/20",
      path: "/admin/publishers/new",
      delay: 0.3,
    },
    {
      title: "View Payments",
      icon: <CreditCard className="w-5 h-5" />,
      color: "from-orange-600 to-primary-600 shadow-orange-500/20",
      path: "/admin/payments",
      delay: 0.4,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: action.delay }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(action.path)}
          className={`flex items-center justify-between p-5 rounded-2xl text-white font-bold bg-gradient-to-br ${action.color} shadow-lg transition-all border border-white/10 group`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <span className="text-sm tracking-tight">{action.title}</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </motion.button>
      ))}
    </div>
  )
}
