import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  CheckCircle2, 
  RefreshCcw,
} from "lucide-react"
import toast from "react-hot-toast"

import { getTicketById, replyToTicket, reopenTicket } from "../../services/tickets"
import type { Ticket } from "../../types/ticket"
import { MessageBubble } from "./MessageBubble"
import { ReplySection } from "./ReplySection"
import { Badge } from "../ui/Badge"
import { DetailDrawer } from "../ui/DetailDrawer"

interface TicketDetailsDrawerProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTicketUpdated: () => void; // Triggered when a ticket changes status so list reloads
}

export function TicketDetailsDrawer({ ticketId, isOpen, onClose, onTicketUpdated }: TicketDetailsDrawerProps) {
  const [ticket, setTicket] = React.useState<Ticket | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [reopening, setReopening] = React.useState(false)
  
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const loadTicket = React.useCallback(async () => {
    if (!ticketId) return
    setLoading(true)
    try {
      const data = await getTicketById(ticketId)
      if (!data) {
        toast.error("Ticket data not found")
        onClose()
        return
      }
      setTicket(data)
    } finally {
      setLoading(false)
    }
  }, [ticketId, onClose])

  React.useEffect(() => {
    if (isOpen && ticketId) {
      loadTicket()
    } else {
       // Reset when closed
       setTicket(null)
    }
  }, [isOpen, ticketId, loadTicket])

  // Scroll to bottom on new message or when ticket loads
  React.useEffect(() => {
    if (scrollRef.current && !loading && ticket) {
      // Small timeout ensures flex dom has rendered completely
      setTimeout(() => {
         if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }, 50)
    }
  }, [ticket?.messages, loading])

  const handleReply = async (content: string) => {
    if (!ticketId) return
    try {
      await replyToTicket(ticketId, content)
      loadTicket() // Refresh the thread
      toast.success("Response sent")
    } catch (err) {
      toast.error("Failed to send reply")
    }
  }

  const handleReopen = async () => {
    if (!ticketId) return
    setReopening(true)
    try {
      await reopenTicket(ticketId)
      await loadTicket()
      toast.success("Ticket re-opened")
      onTicketUpdated() // Notify parent to refresh the grid
    } catch (err) {
      toast.error("Failed to re-open ticket")
    } finally {
      setReopening(false)
    }
  }

  const isResolved = ticket?.status === "Resolved"
  
  const FooterActions = ticket ? (
    <div className="flex items-center gap-3">
       <Badge variant={ticket.status === "Open" ? "info" : ticket.status === "In Progress" ? "warning" : "success" as any} className="uppercase text-[9px] font-black tracking-widest hidden sm:inline-flex">
          {ticket.status}
       </Badge>
       {isResolved && (
         <button 
           onClick={handleReopen}
           disabled={reopening}
           className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
         >
           <RefreshCcw className={`w-3.5 h-3.5 ${reopening ? "animate-spin" : ""}`} />
           {reopening ? "Working..." : "Re-open"}
         </button>
       )}
    </div>
  ) : null

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={ticket ? ticket.subject : "Loading Ticket..."}
      footerActions={FooterActions}
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : ticket ? (
        <>
          {/* Conversation Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth"
          >
            <div className="flex items-center gap-4 mb-10 opacity-40">
               <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Conversation History</p>
               <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
            </div>

            <AnimatePresence>
              {ticket.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            {isResolved && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2rem] text-center"
              >
                 <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100 tracking-tight mb-2">Issue Resolved</h3>
                 <p className="text-emerald-700 dark:text-emerald-400 font-medium text-xs leading-relaxed max-w-sm mx-auto">This ticket has been marked as resolved. Send a message below to re-open the conversation.</p>
              </motion.div>
            )}

            <div className="h-10" />
          </div>

          <div className="sticky bottom-0 bg-gray-50 dark:bg-[#0E1117] pt-2 pb-6 px-6 border-t border-gray-100 dark:border-gray-800/50">
             <ReplySection onReply={handleReply} disabled={false} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[300px] text-gray-500">
           Failed to load ticket data.
        </div>
      )}
    </DetailDrawer>
  )
}
