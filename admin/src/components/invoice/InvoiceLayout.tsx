import * as React from "react"
import type { Invoice } from "../../types/invoice"
import { InvoiceTable } from "./InvoiceTable"
import { ShieldCheck } from "lucide-react"

interface InvoiceLayoutProps {
  invoice: Invoice
}

export const InvoiceLayout = React.forwardRef<HTMLDivElement, InvoiceLayoutProps>(
  ({ invoice }, ref) => {
    return (
      <div 
        ref={ref} 
        className="bg-white p-12 md:p-16 w-full max-w-[850px] mx-auto shadow-2xl rounded-sm border border-gray-100 print:shadow-none print:border-none print:p-0"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-12 w-auto object-contain" />
            </div>
          </div>
          
          <div className="text-right">
            <h1 className="text-5xl font-black text-gray-100 uppercase tracking-tighter mb-2 print:text-gray-300">Invoice</h1>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900"># {invoice.invoiceNumber}</p>
              <p className="text-xs text-gray-500">Date: {invoice.date}</p>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">From</p>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">{invoice.from.company}</p>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">{invoice.from.address}</p>
              <p className="text-xs font-medium text-gray-700 pt-2">GST: {invoice.from.gst}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Bill To</p>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">{invoice.to.company}</p>
              <p className="text-xs text-gray-500 leading-relaxed ml-auto max-w-[200px]">{invoice.to.address}</p>
              <p className="text-xs text-gray-700 pt-2">{invoice.to.email}</p>
              <p className="text-xs text-gray-700">{invoice.to.mobile}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <InvoiceTable items={invoice.items} />

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 font-medium">₹{invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-500">Tax (GST 0%)</span>
              <span className="text-gray-900 font-medium">₹{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-900 pt-4">
              <span className="text-base font-black uppercase">Amount Paid</span>
              <span className="text-xl font-black text-primary-600 tabular-nums">₹{invoice.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Confirmation */}
        <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Status</p>
              <p className="text-sm font-black text-gray-900 uppercase">Paid in Full</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Reference</p>
            <p className="text-xs font-mono font-bold text-gray-600 uppercase">{invoice.transactionId}</p>
            <p className="text-[10px] font-medium text-gray-400 mt-1">via {invoice.paymentMethod}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
           <p className="text-[11px] text-gray-400 italic">"Thank you for your business. We appreciate your partnership with Keliri Platform."</p>
           <div className="mt-6 pt-6 border-t border-gray-50 flex justify-center gap-8 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
             <span>keliri.com</span>
             <span>support@keliri.com</span>
             <span>+91 1800-ADS-HELP</span>
           </div>
        </div>
      </div>
    )
  }
)

InvoiceLayout.displayName = "InvoiceLayout"
