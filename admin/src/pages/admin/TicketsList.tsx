import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, HelpCircle, LifeBuoy, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

import { fetchTickets, reopenTicket } from "../../services/tickets"
import type { Ticket } from "../../types/ticket"
import { TicketFilters } from "../../components/tickets/TicketFilters"
import { TicketTable } from "../../components/tickets/TicketTable"

export default function TicketsList() {
  const navigate = useNavigate()
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filters, setFilters] = React.useState({ query: "", status: "All", category: "All" })

  const loadTickets = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTickets(filters)
      setTickets(data)
    } catch (err) {
      toast.error("Failed to sync support requests")
    } finally {
      setLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const handleReopen = async (id: string) => {
    try {
      await reopenTicket(id)
      toast.success("Ticket re-opened")
      loadTickets()
    } catch (err) {
      toast.error("Failed to re-open ticket")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0E1117] p-8 transition-colors duration-200">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
              <LifeBuoy className="w-7 h-7" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Support Hub</h1>
              <p className="text-gray-500 text-sm font-medium">Expert assistance for all your campaign needs</p>
           </div>
        </div>

        <button
          onClick={() => navigate("/admin/tickets/new")}
          className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-gray-900/10 dark:shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          Create New Ticket
        </button>
      </header>

      {/* Main UI */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TicketFilters onFilterChange={setFilters} />
        
        <TicketTable 
          data={tickets} 
          isLoading={loading} 
          onReopen={handleReopen} 
        />
        
        {/* Help Banner */}
        <div className="mt-12 p-8 bg-gray-900 rounded-[2.5rem] relative overflow-hidden group">
           <HelpCircle className="absolute right-[-2.5rem] top-[-2.5rem] w-64 h-64 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h3 className="text-xl font-black text-white tracking-tight mb-2">Need immediate technical help?</h3>
                 <p className="text-gray-400 text-sm font-medium max-w-lg">Our technical specialists are available 24/7 for urgent ad-delivery issues. High priority tickets are usually resolved within 2 hours.</p>
              </div>
              <button className="px-8 py-3.5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                 Contact Hotline
              </button>
           </div>
        </div>
      </main>
    </div>
  )
}
