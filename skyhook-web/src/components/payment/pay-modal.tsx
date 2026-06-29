"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, QrCode, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface PayModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  orderId: string
}

const methods = [
  { id: "midtrans", label: "Card / Bank Transfer", icon: CreditCard, desc: "Visa, Mastercard, Virtual Account" },
  { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan with GoPay, OVO, LinkAja, etc." },
]

export function PayModal({ isOpen, onClose, total, orderId }: PayModalProps) {
  const [method, setMethod] = useState("midtrans")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [paid, setPaid] = useState(false)

  // Poll payment status after opening payment link
  useEffect(() => {
    if (!paid || !isOpen) return
    const interval = setInterval(async () => {
      const { data: order } = await createClient().from("orders").select("payment_status").eq("id", orderId).single()
      if (order?.payment_status === "paid") {
        setResult({ success: true, message: "Payment confirmed! Thank you." })
        clearInterval(interval)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [paid, orderId, isOpen])

  const handlePay = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          orderId,
          amount: total,
          customer: { name: "Guest" },
          items: [{ name: "Order", price: total, quantity: 1 }],
        }),
      })
      const data = await res.json()

      if (data.token) {
        setPaid(true)
        window.open(data.redirectUrl, "_blank")
        setResult({ success: true, message: "Payment link opened. Complete payment in the new tab." })
      } else if (data.actions) {
        setPaid(true)
        setResult({ success: true, message: "QRIS: Scan the QR code with your payment app." })
      } else {
        setResult({ success: false, message: data.error || "Payment failed to initialize." })
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-black/90" />
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Select Payment</h2>
                  <button onClick={onClose} className="text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-white/60 text-sm mb-4">
                  Total: <span className="text-amber-400 font-bold">IDR {total.toLocaleString()}</span>
                </p>

                <div className="space-y-2 mb-6">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        method === m.id
                          ? "bg-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/5"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <m.icon className={`w-5 h-5 ${method === m.id ? "text-amber-400" : "text-white/40"}`} />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{m.label}</p>
                        <p className="text-white/30 text-xs">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {result && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 text-sm ${
                    result.success ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {result.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    {result.message}
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={!method || loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? "Processing..." : `Pay IDR ${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
