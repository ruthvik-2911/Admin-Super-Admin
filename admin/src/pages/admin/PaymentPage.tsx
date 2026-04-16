import * as React from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ShieldCheck, Lock, ArrowLeft, Loader2, CreditCard } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { getAdById, type Advertisement } from "../../services/ads"
import { createOrder, verifyPayment } from "../../services/payment"
import { useRazorpay } from "../../hooks/useRazorpay"

import { PaymentSummary } from "../../components/payment/PaymentSummary"

export default function PaymentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { initiatePayment } = useRazorpay()

  const [ad, setAd] = React.useState<Advertisement | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [processing, setProcessing] = React.useState(false)

  // Get cost from state or calculate backup
  const cost = location.state?.cost || 365

  React.useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const adData = await getAdById(id)
        setAd(adData)
      } catch (err) {
        toast.error("Ad context lost")
        navigate("/admin/ads")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handlePay = async () => {
    if (!ad) return
    setProcessing(true)

    try {
      // 🪜 STEP 1: Create Order
      const order = await createOrder(ad.id, cost)

      // 🪜 STEP 2 & 3: Open Razorpay
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Admin Super Admin",
        description: `Ad Campaign: ${ad.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 🪜 STEP 4: Verify
          const toastId = toast.loading("Verifying transaction...")
          try {
            const success = await verifyPayment(response)
            if (success) {
              toast.success("Payment Received! Ad is now Live.", { id: toastId })
              setTimeout(() => navigate("/admin/ads"), 1500)
            }
          } catch (err) {
            toast.error("Verification failed. Please contact support.", { id: toastId })
          }
        },
        prefill: {
          name: "Test Admin",
          email: "admin@adsportal.com",
          contact: "9999999999"
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
            toast.error("Payment cancelled.")
          }
        }
      }

      await initiatePayment(options)
    } catch (err) {
      toast.error("Failed to initialize payment gateway")
      setProcessing(false)
    }
  }

  if (loading || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        
        {/* Sub-Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
          <div className="flex items-center gap-2 text-green-500">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Razorpay 256-bit SSL</span>
          </div>
        </div>

        <div className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Summary */}
            <div className="order-2 lg:order-1">
               <PaymentSummary ad={ad} cost={cost} />
            </div>

            {/* Right: Razorpay Card */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-white dark:bg-[#1A1D24] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden relative">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -z-10" />

                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
                     <CreditCard className="w-6 h-6" />
                   </div>
                   <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6 opacity-80" />
                </div>

                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Checkout</h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  Clicking the button below will open a secure payment terminal provided by Razorpay. We never store your card details.
                </p>

                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                >
                  {processing ? (
                     <span className="flex items-center justify-center gap-3">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Initializing...
                     </span>
                  ) : (
                    "Pay Now"
                  )}
                </button>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
                   <div className="flex items-center gap-3 text-gray-500">
                     <Lock className="w-4 h-4" />
                     <span className="text-[11px] font-bold uppercase tracking-wider">AES-256 SSL Encrypted</span>
                   </div>
                   <div className="flex gap-4">
                      {/* Mock payment method icons */}
                      <div className="w-8 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">VISA</div>
                      <div className="w-8 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">UPI</div>
                      <div className="w-8 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">NET</div>
                   </div>
                </div>
              </div>

              <div className="text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                 <p className="text-xs text-gray-400 leading-normal italic">
                   "By proceeding with this payment, you agree to our Terms of Ad Placement and Advertiser Guidelines."
                 </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
