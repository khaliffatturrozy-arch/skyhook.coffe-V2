"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Ticket, CreditCard, QrCode, Loader2, CheckCircle, X, Minus, Plus, Smartphone } from "lucide-react"

type SkyEvent = {
  id: string; title: string; price: number; capacity: number; tickets_sold: number; date: string; time: string
}

export function TicketModal({ event, onClose }: { event: SkyEvent; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [method, setMethod] = useState<"midtrans" | "stripe" | "qris">("midtrans")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [paymentUrl, setPaymentUrl] = useState("")

  const price = Number(event.price || 0)
  const total = price * quantity
  const available = (event.capacity || 999) - (event.tickets_sold || 0)

  async function handlePurchase() {
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/events/tickets", {
        method: "POST",
        body: JSON.stringify({ event_id: event.id, quantity, payment_method: method }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Purchase failed")
      if (data.payment?.redirectUrl) {
        setPaymentUrl(data.payment.redirectUrl)
        window.open(data.payment.redirectUrl, "_blank")
      }
      setSuccess(true)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-skyhook-amber" />
                <h2 className="font-heading text-xl font-bold text-white">Get Tickets</h2>
              </div>
              <button onClick={onClose} className="p-1 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">Tickets Reserved!</h3>
                <p className="text-white/40 text-sm mb-4">{quantity} ticket(s) for {event.title}</p>
                {paymentUrl && (
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="w-full">Complete Payment</Button>
                  </a>
                )}
                <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={onClose}>Close</Button>
              </div>
            ) : (
              <>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-white font-medium">{event.title}</p>
                  <p className="text-white/40 text-xs">{new Date(event.date).toLocaleDateString()} · {event.time?.slice(0, 5)}</p>
                  <p className="text-skyhook-amber text-lg font-bold mt-1">IDR {total.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-bold w-6 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(available, quantity + 1))} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-white/20 text-xs mb-4">{available} tickets available</p>

                <div className="space-y-2 mb-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Payment Method</p>
                  {[
                    { key: "midtrans" as const, label: "Midtrans", icon: CreditCard },
                    { key: "stripe" as const, label: "Stripe", icon: Smartphone },
                    { key: "qris" as const, label: "QRIS", icon: QrCode },
                  ].map((m) => (
                    <button key={m.key} onClick={() => setMethod(m.key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${method === m.key ? "bg-skyhook-amber/20 text-skyhook-amber" : "glass text-white/60 hover:text-white"}`}
                    >
                      <m.icon className="w-4 h-4" /> {m.label}
                    </button>
                  ))}
                </div>

                {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 rounded-lg p-2">{error}</p>}

                <Button variant="primary" className="w-full" onClick={handlePurchase} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ticket className="w-4 h-4 mr-2" />}
                  {loading ? "Processing..." : `Pay IDR ${total.toLocaleString()}`}
                </Button>
              </>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
