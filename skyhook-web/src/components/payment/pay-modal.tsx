"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { X, CreditCard, QrCode, Smartphone, Building2, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface PayModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  orderId: string
}

const methods = [
  { id: "midtrans", label: "Card / Bank Transfer", icon: CreditCard, desc: "Visa, Mastercard, Virtual Account" },
  { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan with GoPay, OVO, LinkAja, etc." },
  { id: "gopay", label: "GoPay", icon: Smartphone, desc: "GoPay wallet balance" },
  { id: "stripe", label: "Stripe", icon: Building2, desc: "International cards" },
]

export function PayModal({ isOpen, onClose, total, orderId }: PayModalProps) {
  const [method, setMethod] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handlePay = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: method === "gopay" ? "midtrans" : method,
          orderId,
          amount: Math.round(total * 1.1),
          customer: { name: "Guest" },
          items: [{ name: "Order", price: Math.round(total * 1.1), quantity: 1 }],
        }),
      })
      const data = await res.json()

      if (data.token) {
        window.open(data.redirectUrl, "_blank")
        setResult({ success: true, message: "Payment link opened in new tab. Complete payment to confirm order." })
      } else if (data.clientSecret) {
        setResult({ success: true, message: "Payment initiated. Complete payment in the popup." })
      } else if (data.actions) {
        setResult({ success: true, message: `QRIS: Scan the QR code with your payment app.` })
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <GlassCard className="w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg font-semibold">Select Payment</h2>
                <button onClick={onClose} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-white/60 text-sm mb-4">
                Total: <span className="text-skyhook-amber font-bold">IDR {Math.round(total * 1.1).toLocaleString()}</span>
              </p>

              <div className="space-y-2 mb-6">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      method === m.id ? "bg-skyhook-amber/10 border border-skyhook-amber/30" : "bg-white/5 border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <m.icon className={`w-5 h-5 ${method === m.id ? "text-skyhook-amber" : "text-white/40"}`} />
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-skyhook-amber to-skyhook-orange text-black font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Processing..." : `Pay IDR ${Math.round(total * 1.1).toLocaleString()}`}
              </button>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
