"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Wallet, CreditCard, QrCode, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

const transactions = [
  { id: "TXN-001", order: "#SH-2843", customer: "Khalif", amount: "IDR 235K", method: "GoPay", status: "settled", time: "2 min ago" },
  { id: "TXN-002", order: "#SH-2842", customer: "Ayu", amount: "IDR 168K", method: "QRIS", status: "settled", time: "5 min ago" },
  { id: "TXN-003", order: "#SH-2841", customer: "Bima", amount: "IDR 312K", method: "Card", status: "settled", time: "8 min ago" },
  { id: "TXN-004", order: "#SH-2840", customer: "Citra", amount: "IDR 85K", method: "OVO", status: "pending", time: "12 min ago" },
  { id: "TXN-005", order: "#SH-2839", customer: "Dimas", amount: "IDR 145K", method: "Cash", status: "settled", time: "15 min ago" },
  { id: "TXN-006", order: "#SH-2838", customer: "Elsa", amount: "IDR 420K", method: "Stripe", status: "settled", time: "1 min ago" },
]

const paymentMethods = [
  { name: "GoPay", transactions: 156, volume: "IDR 28.5M", change: "+12%" },
  { name: "QRIS", transactions: 134, volume: "IDR 22.1M", change: "+18%" },
  { name: "OVO", transactions: 89, volume: "IDR 15.3M", change: "+5%" },
  { name: "Card", transactions: 67, volume: "IDR 18.7M", change: "-3%" },
  { name: "Cash", transactions: 45, volume: "IDR 8.2M", change: "-8%" },
]

export default function AdminPaymentsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Payment Overview</h1>
        <p className="text-white/40 text-sm mt-1">Track all payment transactions across methods</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Volume", value: "IDR 92.8M", icon: Wallet, color: "text-skyhook-amber" },
          { label: "Transactions", value: "491", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Settlement Rate", value: "96.3%", icon: CreditCard, color: "text-blue-400" },
          { label: "Avg per TX", value: "IDR 189K", icon: QrCode, color: "text-purple-400" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <GlassCard key={stat.label}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/30 text-xs">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-heading text-lg font-semibold">Recent Transactions</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs uppercase tracking-wider">
                  <th className="text-left p-4">TX ID</th>
                  <th className="text-left p-4">Order</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Method</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/40 text-xs">{tx.id}</td>
                    <td className="p-4 text-white">{tx.order}</td>
                    <td className="p-4 text-white/60">{tx.customer}</td>
                    <td className="p-4 text-white">{tx.amount}</td>
                    <td className="p-4 text-white/60 text-xs">{tx.method}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${tx.status === "settled" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        <div>
          <GlassCard>
            <h2 className="font-heading text-lg font-semibold mb-4">Payment Methods</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{method.name}</p>
                    <p className="text-white/30 text-xs">{method.transactions} TX · {method.volume}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs ${method.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                    {method.change.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {method.change}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
