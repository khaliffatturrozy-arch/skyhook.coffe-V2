"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Phone, CheckCircle2, Loader2 } from "lucide-react"

const OUTLET_ID = "a1000000-0000-0000-0000-000000000001"

export default function CallWaiterPage() {
  const [tableNumber, setTableNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tableNumber.trim()) return
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/waiter-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: tableNumber.trim().toUpperCase(),
          outlet_id: OUTLET_ID,
          notes: notes.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to call waiter")
      setDone(true)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-skyhook-black flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="p-8 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-heading text-xl font-bold mb-2">Waiter is on the way!</h1>
            <p className="text-white/40 text-sm mb-6">Table {tableNumber} — your request has been received.</p>
            <Button variant="primary" onClick={() => { setDone(false); setTableNumber(""); setNotes("") }}>
              Call Again
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-skyhook-black flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-8 max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-skyhook-amber/20 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-skyhook-amber" />
          </div>
          <h1 className="font-heading text-xl font-bold text-center mb-1">Call a Waiter</h1>
          <p className="text-white/40 text-sm text-center mb-6">Need assistance? Let us know your table.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs block mb-1">Table Number</label>
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value.toUpperCase())}
                placeholder="e.g. R12, V3, G5"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-skyhook-amber/50"
                required
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need more napkins, water, etc."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-skyhook-amber/50 resize-none h-20"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg">{error}</p>
            )}

            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={!tableNumber.trim() || sending}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
              {sending ? "Sending..." : "Call Waiter"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
