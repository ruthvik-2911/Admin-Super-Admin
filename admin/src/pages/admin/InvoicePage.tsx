import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useReactToPrint } from "react-to-print"
import { Download, Printer, ArrowLeft, Loader2, FileCheck } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { getInvoiceById } from "../../services/payment"
import type { Invoice } from "../../types/invoice"
import { InvoiceLayout } from "../../components/invoice/InvoiceLayout"

export default function InvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = React.useState<Invoice | null>(null)
  const [loading, setLoading] = React.useState(true)
  
  const componentRef = React.useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${id}`,
  })

  React.useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const data = await getInvoiceById(id)
        setInvoice(data)
      } catch (err) {
        toast.error("Failed to fetch invoice details")
        navigate("/admin/payments")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  if (loading || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        
        {/* Actions Bar */}
        <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
          <div className="flex items-center justify-between w-full max-w-[850px]">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            
            <div className="flex gap-3">
               <button
                 // On modern browsers, print to PDF is the standard for "Download PDF"
                 onClick={() => handlePrint()}
                 className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-900/10"
               >
                 <Download className="w-4 h-4" />
                 PDF
               </button>
               <button
                 onClick={() => handlePrint()}
                 className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-gray-900 transition-all active:scale-95 shadow-sm"
               >
                 <Printer className="w-4 h-4" />
                 Print
               </button>
            </div>
          </div>
        </div>

        <main className="max-w-[850px] mx-auto px-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
           {/* Top Banner */}
           <div className="mb-10 flex items-center justify-between p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <FileCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-emerald-900 font-black tracking-tight">Payment Verified</h2>
                    <p className="text-emerald-700 text-xs font-medium">This document is a valid confirmation of your transaction.</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Transaction ID</p>
                 <p className="text-xs font-mono font-bold text-emerald-800 uppercase">{invoice.transactionId}</p>
              </div>
           </div>

           {/* The actual Invoice Component */}
           <InvoiceLayout ref={componentRef} invoice={invoice} />
        </main>
      </div>
    </>
  )
}
