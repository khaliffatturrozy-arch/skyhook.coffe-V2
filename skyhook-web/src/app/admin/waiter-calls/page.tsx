"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Bell, Phone, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

function elapsed(created: string) {
  const diff = Date.now() - new Date(created).getTime()
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function AdminWaiterCallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCalls = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/waiter-calls")
    const d = await res.json()
    setCalls(Array.isArray(d) ? d : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCalls()
    const client = createClient()
    const channel = client
      .channel("admin-waiter-calls")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "waiter_calls" }, fetchCalls)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "waiter_calls" }, fetchCalls)
      .subscribe()
    return () => { client.removeChannel(channel) }
  }, [fetchCalls])

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/waiter-calls", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) fetchCalls()
  }

  if (loading && calls.length === 0) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>
  }

  const pending = calls.filter((c) => c.status === "pending")
  const acknowledged = calls.filter((c) => c.status === "acknowledged")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Waiter Calls</h1>
          <p className="text-white/40 text-sm mt-1">Manage customer service requests</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchCalls}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pending.map((call) => (
          <motion.div key={call.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-5 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                    <Bell className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Table {call.tables?.table_number || "?"}</p>
                    <p className="text-red-400 text-xs font-medium uppercase">PENDING</p>
                  </div>
                </div>
                <span className="text-white/30 text-xs">{elapsed(call.created_at)}</span>
              </div>
              {call.notes && <p className="text-white/60 text-sm mb-4 bg-white/5 p-2 rounded-lg">{call.notes}</p>}
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1" onClick={() => updateStatus(call.id, "acknowledged")}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Acknowledge
                </Button>
                <Button variant="secondary" size="sm" onClick={() => updateStatus(call.id, "resolved")}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {acknowledged.length > 0 && (
        <>
          <h2 className="font-heading text-lg font-semibold mt-8 mb-4 text-white/60">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acknowledged.map((call) => (
              <motion.div key={call.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard className="p-4 border-l-4 border-l-blue-500 opacity-70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold">Table {call.tables?.table_number || "?"}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => updateStatus(call.id, "resolved")}>Resolve</Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {calls.length === 0 && (
        <div className="text-center py-20">
          <Phone className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/20 text-lg">No active waiter calls</p>
        </div>
      )}
    </div>
  )
}
