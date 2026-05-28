"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, CreditCard, History } from "lucide-react"

const transactions = [
  { type: "payment", desc: "Skyhook Signature + Croissant", amount: "-IDR 113K", date: "Today, 19:30", status: "completed" },
  { type: "topup", desc: "Wallet Top Up", amount: "+IDR 500K", date: "Today, 14:15", status: "completed" },
  { type: "cashback", desc: "Weekend Cashback Bonus", amount: "+IDR 25K", date: "Yesterday", status: "completed" },
  { type: "payment", desc: "Neon Nights Event Ticket", amount: "-IDR 150K", date: "Yesterday", status: "completed" },
  { type: "reward", desc: "Birthday Reward", amount: "+IDR 100K", date: "3 days ago", status: "completed" },
]

export default function WalletPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/50 to-skyhook-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              Digital <span className="text-gradient-gold">Wallet</span>
            </h1>
            <p className="text-white/40 text-lg">Your Skyhook balance, rewards, and transactions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <GlassCard className="bg-gradient-to-br from-skyhook-amber/10 to-skyhook-orange/10">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-skyhook-amber" />
                <h3 className="font-heading text-lg font-semibold">Main Balance</h3>
              </div>
              <p className="text-4xl font-heading font-bold text-gradient-gold mb-2">IDR 0</p>
              <p className="text-white/30 text-xs">Sign in to view your balance</p>
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
              <GlassCard>
                <Gift className="w-5 h-5 text-skyhook-amber mb-3" />
                <p className="text-white/30 text-xs mb-1">Cashback</p>
                <p className="text-white font-bold">IDR 0</p>
              </GlassCard>
              <GlassCard>
                <CreditCard className="w-5 h-5 text-skyhook-gold mb-3" />
                <p className="text-white/30 text-xs mb-1">Reward Points</p>
                <p className="text-white font-bold">0 pts</p>
              </GlassCard>
              <GlassCard>
                <ArrowUpRight className="w-5 h-5 text-emerald-400 mb-3" />
                <p className="text-white/30 text-xs mb-1">Promo Credits</p>
                <p className="text-white font-bold">IDR 0</p>
              </GlassCard>
              <GlassCard>
                <History className="w-5 h-5 text-blue-400 mb-3" />
                <p className="text-white/30 text-xs mb-1">Transactions</p>
                <p className="text-white font-bold">0</p>
              </GlassCard>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <Button variant="primary" size="lg" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Top Up
            </Button>
            <Button variant="secondary" size="lg" className="flex-1">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send
            </Button>
            <Button variant="secondary" size="lg" className="flex-1">
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Request
            </Button>
          </div>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold mb-6">Transaction History</h2>
            <div className="space-y-1">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === "payment" ? "bg-red-500/10" :
                      tx.type === "topup" ? "bg-emerald-500/10" :
                      "bg-skyhook-amber/10"
                    }`}>
                      {tx.type === "payment" ? <ArrowUpRight className="w-4 h-4 text-red-400" /> :
                       tx.type === "topup" ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> :
                       <Gift className="w-4 h-4 text-skyhook-amber" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{tx.desc}</p>
                      <p className="text-white/30 text-xs">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-medium text-sm ${
                    tx.amount.startsWith("+") ? "text-emerald-400" : "text-white"
                  }`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
