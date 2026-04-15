import type { Ticket, Message, TicketStatus, TicketCategory } from "../types/ticket"

let mockTickets: Ticket[] = [
  {
    id: "TKT-1001",
    subject: "Payment failed for Summer Sale campaign",
    description: "I tried to pay via Razorpay but the transaction failed even though money was deducted.",
    category: "Payment Issue",
    status: "Open",
    createdAt: "2026-04-12T10:00:00Z",
    updatedAt: "2026-04-12T10:00:00Z",
    messages: [
      {
        id: "msg-1",
        sender: "Admin",
        content: "I tried to pay via Razorpay but the transaction failed even though money was deducted. Transaction ID: TXN12345.",
        timestamp: "2026-04-12T10:00:00Z"
      }
    ]
  },
  {
    id: "TKT-1002",
    subject: "Video ad not playing on publishers",
    description: "The video ad uploaded for 'Flash Deal' is showing a black screen.",
    category: "Technical Issue",
    status: "In Progress",
    createdAt: "2026-04-13T14:30:00Z",
    updatedAt: "2026-04-13T15:00:00Z",
    messages: [
      {
        id: "msg-2",
        sender: "Admin",
        content: "The video ad uploaded for 'Flash Deal' is showing a black screen.",
        timestamp: "2026-04-13T14:30:00Z"
      },
      {
        id: "msg-3",
        sender: "Super Admin",
        content: "We are checking the transcoding logs. It seems the file format was not supported by some players. Can you re-upload as MP4?",
        timestamp: "2026-04-13T15:00:00Z"
      }
    ]
  },
  {
    id: "TKT-1003",
    subject: "General Query regarding API",
    description: "How do I integrate the tracker?",
    category: "Other",
    status: "Resolved",
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-11T12:00:00Z",
    messages: [
      {
        id: "msg-4",
        sender: "Admin",
        content: "How do I integrate the tracker?",
        timestamp: "2026-04-10T09:00:00Z"
      },
      {
        id: "msg-5",
        sender: "Super Admin",
        content: "Please check our documentation at docs.keliri.com/tracker.",
        timestamp: "2026-04-11T12:00:00Z"
      }
    ]
  }
]

export const fetchTickets = async (filters?: { status?: string; category?: string; query?: string }): Promise<Ticket[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  let filtered = [...mockTickets]
  
  if (filters?.status && filters.status !== "All") {
    filtered = filtered.filter(t => t.status === filters.status)
  }
  if (filters?.category && filters.category !== "All") {
    filtered = filtered.filter(t => t.category === filters.category)
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase()
    filtered = filtered.filter(t => t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
  }
  
  return filtered
}

export const getTicketById = async (id: string): Promise<Ticket | null> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockTickets.find(t => t.id === id) || null
}

export const createTicket = async (data: { subject: string; category: TicketCategory; description: string }): Promise<Ticket> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const newTicket: Ticket = {
    id: `TKT-${Math.floor(2000 + Math.random() * 8000)}`,
    subject: data.subject,
    description: data.description,
    category: data.category,
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-${Math.random()}`,
        sender: "Admin",
        content: data.description,
        timestamp: new Date().toISOString()
      }
    ]
  }
  mockTickets = [newTicket, ...mockTickets]
  return newTicket
}

export const replyToTicket = async (ticketId: string, content: string): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  const newMessage: Message = {
    id: `msg-${Math.random()}`,
    sender: "Admin",
    content,
    timestamp: new Date().toISOString()
  }
  
  const ticketIndex = mockTickets.findIndex(t => t.id === ticketId)
  if (ticketIndex > -1) {
    mockTickets[ticketIndex].messages.push(newMessage)
    mockTickets[ticketIndex].updatedAt = new Date().toISOString()
    // If it was resolved, re-opening it
    if (mockTickets[ticketIndex].status === "Resolved") {
      mockTickets[ticketIndex].status = "In Progress"
    }
  }
  
  return newMessage
}

export const reopenTicket = async (ticketId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const ticketIndex = mockTickets.findIndex(t => t.id === ticketId)
  if (ticketIndex > -1) {
    mockTickets[ticketIndex].status = "In Progress"
    mockTickets[ticketIndex].updatedAt = new Date().toISOString()
  }
}
