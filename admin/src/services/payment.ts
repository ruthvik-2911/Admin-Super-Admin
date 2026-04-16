import type { RazorpayOrder, PaymentTransaction } from "../types/payment"
import type { Invoice } from "../types/invoice"

export const createOrder = async (adId: string, amount: number): Promise<RazorpayOrder> => {
  // Mock backend call to POST /api/admin/payment/create-order
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: `order_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount * 100, // Razorpay expects paise
    currency: "INR",
    keyId: "rzp_test_placeholder" // REPLACE WITH ACTUAL KEY IF TESTING REAL
  }
}

export const verifyPayment = async (payload: {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}): Promise<boolean> => {
  // Mock backend call to POST /api/admin/payment/verify
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log("Verifying payment on backend:", payload)
  return true
}

// Transaction Mocking
const generateMockTransactions = (count: number): PaymentTransaction[] => {
  const adNames = [
    "Summer Mega Sale 2026", "Winter Clearance", "New Store Launch", 
    "Festive Offers", "Weekend Flash Deals", "Buy 1 Get 1 Free", 
    "End of Season Sale", "Spring Fashion Week", "Tech Expo 2026"
  ]
  
  return Array.from({ length: count }).map((_, index) => {
    const statusRoll = Math.random()
    const status: PaymentTransaction["status"] = statusRoll > 0.2 ? "Success" : statusRoll > 0.05 ? "Failed" : "Pending"
    
    // Random date in last 60 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 60))
    
    return {
      id: `trx_${index + 100}`,
      transactionId: `TXN_RZP_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      adName: adNames[Math.floor(Math.random() * adNames.length)],
      amount: Math.floor(Math.random() * 5000) + 365,
      status,
      method: "Razorpay",
      date: date.toISOString().split("T")[0],
      invoiceUrl: "#"
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

let mockTransactions = generateMockTransactions(62)

export interface FetchPaymentsArgs {
  page: number
  limit: number
  search?: string
  status?: string
}

export const fetchPayments = async ({ page, limit, search, status }: FetchPaymentsArgs) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  let filtered = [...mockTransactions]
  
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(t => 
      t.adName.toLowerCase().includes(s) || 
      t.transactionId.toLowerCase().includes(s)
    )
  }
  
  if (status && status !== "All") {
    filtered = filtered.filter(t => t.status === status)
  }
  
  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / limit) || 1
  const paginated = filtered.slice((page - 1) * limit, page * limit)
  
  return {
    data: paginated,
    totalItems,
    totalPages,
    stats: {
      totalRevenue: mockTransactions.reduce((acc, t) => t.status === "Success" ? acc + t.amount : acc, 0),
      successRate: Math.round((mockTransactions.filter(t => t.status === "Success").length / mockTransactions.length) * 100)
    }
  }
}
export const getInvoiceById = async (transactionId: string): Promise<Invoice> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Try to find the transaction to make mock data relevant
  const txn = mockTransactions.find(t => t.id === transactionId || t.transactionId === transactionId)
  const amount = txn?.amount || 365
  
  return {
    invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    date: txn?.date || new Date().toISOString().split("T")[0],
    transactionId: txn?.transactionId || "TXN_RZP_MOCK123",
    paymentMethod: "Razorpay Checkout",
    status: "Paid",
    
    from: {
      company: "Keliri Platform Services",
      address: "123 Business Park, Sector 44, Gurgaon, Haryana - 122003",
      email: "billing@keliri.com",
      gst: "06AAAAA0000A1Z5"
    },
    
    to: {
      company: "Admin Ad Solutions",
      address: "Phoenix Mall, Outer Ring Road, Mumbai, Maharashtra",
      email: "admin@adsportal.com",
      mobile: "+91 99999 88888"
    },
    
    items: [
      {
        id: "1",
        description: `Advertisement Placement: ${txn?.adName || "Summer Mega Sale"}`,
        quantity: 1,
        rate: amount,
        amount: amount
      }
    ],
    
    subtotal: amount,
    tax: 0,
    total: amount
  }
}
