import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Loader2, 
  LifeBuoy, 
  CheckCircle2, 
  History,
  AlertCircle,
  MessageSquare,
  RefreshCcw
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { getTicketById, replyToTicket, reopenTicket } from "../../services/tickets"
import type { Ticket } from "../../types/ticket"
import { MessageBubble } from "../../components/tickets/MessageBubble"
import { ReplySection } from "../../components/tickets/ReplySection"
import { Badge } from "../../components/ui/Badge"

export default function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = React.useState<Ticket | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [reopening, setReopening] = React.useState(false)
  
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const loadTicket = React.useCallback(async () => {
    if (!id) return
    try {
      const data = await getTicketById(id)
      if (!data) {
        toast.error("Ticket not found")
        navigate("/admin/tickets")
        return
      }
      setTicket(data)
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  React.useEffect(() => {
    loadTicket()
  }, [loadTicket])

  // Scroll to bottom on new message
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [ticket?.messages])

  const handleReply = async (content: string) => {
    if (!id) return
    try {
      await replyToTicket(id, content)
      loadTicket() // Refresh the thread
      toast.success("Response sent")
    } catch (err) {
      toast.error("Failed to send reply")
    }
  }

  const handleReopen = async () => {
    if (!id) return
    setReopening(true)
    try {
      await reopenTicket(id)
      await loadTicket()
      toast.success("Ticket re-opened")
    } catch (err) {
      toast.error("Failed to re-open ticket")
    } finally {
      setReopening(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!ticket) return null

  const isResolved = ticket.status === "Resolved"

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-[calc(100vh-theme(spacing.14)-theme(spacing.6)-32px)] bg-transparent flex flex-col transition-colors duration-200">
        
        {/* Sub-Header with Ticket info */}
        <div className="pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/admin/tickets")}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ticket.id}</span>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
                <Badge variant={ticket.status === "Open" ? "info" : ticket.status === "In Progress" ? "warning" : "success" as any} className="uppercase text-[9px] font-black tracking-widest">
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </div>

          {isResolved && (
            <button 
              onClick={handleReopen}
              disabled={reopening}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${reopening ? "animate-spin" : ""}`} />
              {reopening ? "Working..." : "Re-open Ticket"}
            </button>
          )}
        </div>

        {/* Conversation Area */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 py-10 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12 opacity-40">
               <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Conversation Started</p>
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
                className="mt-12 p-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2.5rem] text-center max-w-2xl mx-auto"
              >
                 <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight mb-2">Issue Resolved</h3>
                 <p className="text-emerald-700 dark:text-emerald-400 font-medium text-sm leading-relaxed">This ticket has been marked as resolved. If you still need help, simply send a message below to re-open the conversation or click the button above.</p>
              </motion.div>
            )}

            <div className="h-20" />
          </div>
        </main>

        <ReplySection onReply={handleReply} disabled={false} />
      </div>
    </>
  )
}
