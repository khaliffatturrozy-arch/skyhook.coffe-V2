"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import {
  User, Calendar, ShoppingBag, Wallet, Award,
  Sparkles, Loader2, Crown, Trophy, CreditCard,
  ArrowRight, LogOut, Star
} from "lucide-react"

const userLinks = [
  { href: "/profile", label: "My Profile", desc: "Manage your account", icon: User, color: "from-amber-500 to-orange-600" },
  { href: "/achievements", label: "Achievements", desc: "Unlock rewards", icon: Award, color: "from-violet-500 to-purple-600" },
  { href: "/reservasi", label: "Reservation", desc: "Book a table", icon: Calendar, color: "from-emerald-500 to-teal-600" },
  { href: "/wallet", label: "Payment", desc: "Wallet & gateway", icon: CreditCard, color: "from-blue-500 to-indigo-600" },
]

const tierGradients: Record<string, string> = {
  "Skyhook Royalty": "from-yellow-300 via-amber-400 to-orange-500",
  "VIP Elite": "from-slate-300 via-gray-400 to-zinc-500",
  "Platinum": "from-cyan-300 via-sky-400 to-blue-500",
  "Gold": "from-yellow-200 via-amber-300 to-yellow-500",
  "Silver": "from-gray-300 via-slate-400 to-gray-500",
  "Member": "from-amber-200 via-amber-300 to-amber-400",
}

const rankNames: Record<number, string> = {
  1: "Skyhook Royalty", 2: "VIP Elite", 3: "VIP Elite",
  4: "Platinum", 5: "Platinum", 6: "Gold",
  7: "Gold", 8: "Gold", 9: "Silver", 10: "Silver",
}

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      setSession(s)
      if (s?.user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", s.user.id).single()
        if (userData) setProfile(userData)

        const { data: rankData } = await supabase
          .from("leaderboard")
          .select("rank")
          .eq("user_id", s.user.id)
          .single()
        if (rankData) setUserRank(rankData.rank)
      }
      setLoading(false)
    })()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#313131]" />
      </div>
    )
  }

  if (!session) {
    router.push("/auth")
    return null
  }

  const grad = tierGradients[profile?.membership_tier] || tierGradients.Member
  const rankLabel = userRank ? (rankNames[userRank] || "Member") : "—"
  const rankBadge = userRank && userRank <= 3 ? "🔥" : userRank && userRank <= 10 ? "⭐" : "" 

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="section-padding max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Welcome Hero */}
          <div className="relative bg-gradient-to-br from-[#212121] to-black rounded-2xl overflow-hidden mb-8 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-white/40 text-xs uppercase tracking-widest mb-2"
                  >
                    Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
                  </motion.p>
                  <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-1"
                  >
                    Your Skyhook
                  </motion.h1>
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                    className="text-white/30 text-sm"
                  >
                    {profile?.email || ""}
                  </motion.p>
                </div>
                <div className="flex gap-2">
                  <Link href="/menu"
                    className="shrink-0 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-4 py-2 text-xs font-medium transition-all"
                  >
                    Order Now
                  </Link>
                  <button onClick={handleSignOut}
                    className="shrink-0 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 py-2 text-xs font-medium transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Member Card — Points, Rank, Tier */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className={`text-sm font-bold bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>
                      {profile?.membership_tier || "Member"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-white/70 text-xs font-medium">Rank #{userRank || "—"}</span>
                    <span className="text-xs">{rankBadge}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-2.5 text-center">
                    <p className="text-white font-bold text-lg">{profile?.loyalty_points?.toLocaleString() || 0}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Points</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2.5 text-center">
                    <p className="text-white font-bold text-lg">{rankLabel}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Rank</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <ShoppingBag className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-lg font-bold text-[#212121]">{profile?.total_orders || 0}</p>
              <p className="text-[10px] text-[rgba(33,33,33,0.4)] uppercase">Orders</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <Award className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
              <p className="text-lg font-bold text-[#212121]">{profile?.membership_tier || "Member"}</p>
              <p className="text-[10px] text-[rgba(33,33,33,0.4)] uppercase">Tier</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <Wallet className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
              <p className="text-lg font-bold text-[#212121]">{profile?.total_spent ? `IDR ${(+profile.total_spent / 1000).toFixed(0)}K` : "IDR 0"}</p>
              <p className="text-[10px] text-[rgba(33,33,33,0.4)] uppercase">Spent</p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userLinks.map((link, i) => {
              const Icon = link.icon
              return (
                <motion.div key={link.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                  <Link href={link.href}
                    className="group block bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm text-[#212121] mb-0.5">{link.label}</h3>
                    <p className="text-xs text-[rgba(33,33,33,0.4)]">{link.desc}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 bg-white border border-gray-100 rounded-xl p-5"
          >
            <h3 className="font-semibold text-sm text-[#212121] mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link href="/menu" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingBag className="w-4 h-4 text-[rgba(33,33,33,0.4)]" />
                <span className="text-sm text-[#212121]">Browse Menu & Add to Cart</span>
              </Link>
              <Link href="/reservasi" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 text-[rgba(33,33,33,0.4)]" />
                <span className="text-sm text-[#212121]">Make a Reservation</span>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </main>
  )
}
