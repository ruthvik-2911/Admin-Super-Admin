import * as React from "react"
import { Plus, HelpCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

import { fetchTickets, reopenTicket } from "../../services/tickets"
import type { Ticket } from "../../types/ticket"
import { TicketFilters } from "../../components/tickets/TicketFilters"
import { TicketTable } from "../../components/tickets/TicketTable"
import { TicketDetailsDrawer } from "../../components/tickets/TicketDetailsDrawer"

export default function TicketsList() {
  const navigate = useNavigate()
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filters, setFilters] = React.useState({ query: "", status: "All", category: "All" })
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

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

  const handleRowClick = (id: string) => {
    setSelectedTicketId(id)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/admin/tickets/new")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
            Create New Ticket
          </button>
        </div>

        {/* Main UI */}
        <div className="space-y-6">
          <TicketFilters onFilterChange={setFilters} />
          
          <TicketTable 
            data={tickets} 
            isLoading={loading} 
            onReopen={handleReopen} 
            onRowClick={handleRowClick}
          />
          
          {/* Help Banner */}
          <div className="mt-12 p-8 bg-[#1C1F26] rounded-2xl relative overflow-hidden group border border-gray-800">
             <HelpCircle className="absolute right-[-2.5rem] top-[-2.5rem] w-64 h-64 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                   <h3 className="text-xl font-black text-white tracking-tight mb-2">Need immediate technical help?</h3>
                   <p className="text-gray-400 text-sm font-medium max-w-lg">Our technical specialists are available 24/7 for urgent ad-delivery issues. High priority tickets are usually resolved within 2 hours.</p>
                </div>
                <button className="px-8 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm tracking-tight hover:bg-gray-100 transition-all active:scale-95">
                   Contact Hotline
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <TicketDetailsDrawer 
        ticketId={selectedTicketId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onTicketUpdated={loadTickets}
      />
    </>
  )
}
