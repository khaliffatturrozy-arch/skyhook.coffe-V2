"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Wallet, CreditCard, TrendingUp, Loader2 } from "lucide-react"

type Transaction = {
  id: string
  payment_status: string
  payment_method: string | null
  total: number
  created_at: string
  user: { full_name: string } | null
}

type MethodSummary = {
  method: string
  count: number
  total: number
}

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [methods, setMethods] = useState<MethodSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/payments")
      const data = await res.json()
      if (data.transactions) setTransactions(data.transactions)
      if (data.paymentMethods) setMethods(data.paymentMethods)
      setLoading(false)
    })()
  }, [])

  function formatId(id: string) { return id.slice(0, 8) }

  function formatTotal(n: number) {
    if (n >= 1_000_000) return `IDR ${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `IDR ${(n / 1_000).toFixed(0)}K`
    return `IDR ${n}`
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${h}h ago`
  }

  const totalVolume = transactions.reduce((s, t) => s + Number(t.total || 0), 0)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Payment Overview</h1>
        <p className="text-white/40 text-sm mt-1">Track all payment transactions across methods</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-skyhook-amber" />
            <div><p className="text-xl font-bold text-white">{loading ? "-" : formatTotal(totalVolume)}</p><p className="text-white/30 text-xs">Total Volume</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div><p className="text-xl font-bold text-white">{loading ? "-" : transactions.length}</p><p className="text-white/30 text-xs">Transactions</p></div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-heading text-lg font-semibold">Recent Transactions</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 text-white/20">No payment transactions yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/30 text-xs uppercase tracking-wider">
                    <th className="text-left p-4">TX ID</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Method</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white/40 text-xs">{formatId(tx.id)}</td>
                      <td className="p-4 text-white/60">{tx.user?.full_name || "Guest"}</td>
                      <td className="p-4 text-white">{formatTotal(Number(tx.total))}</td>
                      <td className="p-4 text-white/60 text-xs">{tx.payment_method || "-"}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${tx.payment_status === "settled" || tx.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"}`}>
                          {tx.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-white/30 text-xs">{timeAgo(tx.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </GlassCard>
        </div>

        <div>
          <GlassCard>
            <h2 className="font-heading text-lg font-semibold mb-4">Payment Methods</h2>
            {loading ? (
              <div className="py-8 text-center"><Loader2 className="w-5 h-5 inline animate-spin text-skyhook-amber" /></div>
            ) : methods.length === 0 ? (
              <p className="text-white/20 text-center py-8">No payment data</p>
            ) : (
              <div className="space-y-3">
                {methods.map((m) => (
                  <div key={m.method} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white text-sm font-medium capitalize">{m.method}</p>
                      <p className="text-white/30 text-xs">{m.count} TX · {formatTotal(m.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
