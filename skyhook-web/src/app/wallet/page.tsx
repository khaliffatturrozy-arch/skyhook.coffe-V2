"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, CreditCard, History, Loader2 } from "lucide-react"
import { PayModal } from "@/components/payment/pay-modal"
import { createClient } from "@/lib/supabase"

interface WalletData {
  balance: number
  cashback_balance: number
  reward_points: number
  promo_credits: number
}

interface WalletTx {
  type: string
  amount: number
  description: string | null
  created_at: string
}

function formatTxDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const opts: Intl.DateTimeFormatOptions = isToday ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short" }
  return isToday ? `Today, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}` : d.toLocaleDateString("id-ID", opts)
}

export default function WalletPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<WalletTx[]>([])
  const [showTopUp, setShowTopUp] = useState(false)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      setUser(u)

      if (u) {
        const { data: w } = await supabase.from("wallets").select("*").eq("user_id", u.id).single()
        if (w) {
          setWallet(w as WalletData)
          const { data: txs } = await supabase.from("wallet_transactions").select("*").eq("wallet_id", w.id).order("created_at", { ascending: false }).limit(20)
          if (txs) setTransactions(txs as WalletTx[])
        }
      }
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" />
      </div>
    )
  }

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
              {!user ? (
                <>
                  <p className="text-4xl font-heading font-bold text-gradient-gold mb-2">IDR 0</p>
                  <p className="text-white/30 text-xs mb-4">Sign in to view your balance</p>
                  <Button variant="primary" size="sm" onClick={() => setShowTopUp(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Top Up
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-4xl font-heading font-bold text-gradient-gold mb-2">
                    IDR {wallet?.balance?.toLocaleString() || 0}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => setShowTopUp(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Top Up
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <ArrowUpRight className="w-4 h-4 mr-2" /> Send
                    </Button>
                  </div>
                </>
              )}
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
              <GlassCard>
                <Gift className="w-5 h-5 text-skyhook-amber mb-3" />
                <p className="text-white/30 text-xs mb-1">Cashback</p>
                <p className="text-white font-bold">IDR {wallet?.cashback_balance?.toLocaleString() || 0}</p>
              </GlassCard>
              <GlassCard>
                <CreditCard className="w-5 h-5 text-skyhook-gold mb-3" />
                <p className="text-white/30 text-xs mb-1">Reward Points</p>
                <p className="text-white font-bold">{wallet?.reward_points || 0} pts</p>
              </GlassCard>
              <GlassCard>
                <ArrowUpRight className="w-5 h-5 text-emerald-400 mb-3" />
                <p className="text-white/30 text-xs mb-1">Promo Credits</p>
                <p className="text-white font-bold">IDR {wallet?.promo_credits?.toLocaleString() || 0}</p>
              </GlassCard>
              <GlassCard>
                <History className="w-5 h-5 text-blue-400 mb-3" />
                <p className="text-white/30 text-xs mb-1">Transactions</p>
                <p className="text-white font-bold">{transactions.length}</p>
              </GlassCard>
            </div>
          </div>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold mb-6">Transaction History</h2>
            {!user ? (
              <p className="text-white/20 text-center py-8">Sign in to see your transactions</p>
            ) : transactions.length === 0 ? (
              <p className="text-white/20 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-1">
                {transactions.map((tx, i) => {
                  const isCredit = ["topup", "cashback", "reward"].includes(tx.type)
                  return (
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
                          <p className="text-white text-sm font-medium">{tx.description || tx.type}</p>
                          <p className="text-white/30 text-xs">{formatTxDate(tx.created_at)}</p>
                        </div>
                      </div>
                      <span className={`font-medium text-sm ${isCredit ? "text-emerald-400" : "text-white"}`}>
                        {isCredit ? "+" : "-"}IDR {Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      <PayModal
        isOpen={showTopUp}
        onClose={() => setShowTopUp(false)}
        total={0}
        orderId={`TOPUP-${Date.now().toString(36).toUpperCase()}`}
      />
    </div>
  )
}
