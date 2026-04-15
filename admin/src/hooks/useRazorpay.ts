import * as React from "react"
import toast from "react-hot-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = React.useState(false)

  const loadScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsLoaded(true)
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        setIsLoaded(true)
        resolve(true)
      }
      script.onerror = () => {
        setIsLoaded(false)
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const initiatePayment = async (options: any) => {
    if (!window.Razorpay) {
      const loaded = await loadScript()
      if (!loaded) {
        toast.error("Failed to load Razorpay SDK")
        return
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return { isLoaded, loadScript, initiatePayment }
}
