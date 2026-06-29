"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Crown, Medal, TrendingUp, Sparkles, Flame, Star, Target, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface LBEntry {
  user_id: string
  full_name: string
  membership_tier: string
  total_points: number
  rank: number
}

const tierColors: Record<string, string> = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-gray-400 to-gray-300",
  gold: "from-yellow-500 to-yellow-300",
  platinum: "from-cyan-500 to-blue-400",
  diamond: "from-violet-500 to-pink-400",
}

const tierEmoji: Record<string, string> = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎", diamond: "👑" }

const rankGradients: Record<number, string> = {
  1: "from-yellow-400 via-amber-400 to-orange-300",
  2: "from-gray-300 via-gray-200 to-slate-200",
  3: "from-amber-600 via-amber-500 to-yellow-400",
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState<{ rank: number; name: string; points: number; tier: string } | null>(null)
  const [sessionUser, setSessionUser] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: lb } = await supabase.from("leaderboard").select("*").order("rank").limit(50)
      if (lb) setLeaderboard(lb as LBEntry[])

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        setSessionUser(session.user.id)
        const u = (lb as LBEntry[] | null)?.find((e) => e.user_id === session.user.id)
        if (u) setUserRank({ rank: u.rank, name: u.full_name, points: u.total_points, tier: u.membership_tier })
      }
      setLoading(false)
    })()
  }, [])

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="relative bg-gradient-to-b from-[#212121] to-[#212121]/95 pt-16 pb-24 md:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto text-center pt-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl mb-5">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px] font-semibold text-white/70 tracking-widest uppercase">Leaderboard</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Top Members
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/40 text-sm mt-2 max-w-md mx-auto">
            Compete, earn points, and rise through the ranks
          </motion.p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-20 relative z-10 pb-16">
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-[#212121]" /></div>
        ) : (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#212121] flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Your Rank</p>
                  {userRank ? (
                    <p className="text-sm font-semibold text-[#212121]">#{userRank.rank} · {userRank.name}</p>
                  ) : sessionUser ? (
                    <p className="text-sm text-gray-400">Not on leaderboard yet — start ordering!</p>
                  ) : (
                    <p className="text-sm text-gray-400">Sign in to track your rank</p>
                  )}
                </div>
              </div>
              {userRank && (
                <div className="text-right">
                  <p className="text-lg font-bold text-[#212121]">{userRank.points.toLocaleString()}</p>
                  <p className="text-[11px] text-gray-400 font-medium">points</p>
                </div>
              )}
            </motion.div>

            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-3 px-4">
                {top3.sort((a, b) => a.rank - b.rank).map((m, i) => {
                  const isCenter = i === 1
                  return (
                    <motion.div
                      key={m.user_id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className={`flex flex-col items-center ${isCenter ? "-mt-4" : ""}`}
                    >
                      <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b ${rankGradients[m.rank]} p-[3px] shadow-lg`}>
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl md:text-4xl">
                          {m.rank === 1 ? "👑" : m.rank === 2 ? "🥈" : "🥉"}
                        </div>
                        {isCenter && (
                          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#212121] mt-2 text-center">{m.full_name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-gray-400">#{m.rank}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs font-semibold text-gray-500">{m.total_points.toLocaleString()} pts</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#212121]">All Members</h2>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <TrendingUp className="w-3 h-3" />
                  Realtime
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {leaderboard.length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-300">No members yet</p>
                  </div>
                )}
                {leaderboard.map((member, i) => {
                  const isTop3 = member.rank <= 3
                  return (
                    <motion.div
                      key={member.user_id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.02 }}
                      className={`flex items-center justify-between px-5 py-3.5 transition-colors ${member.user_id === sessionUser ? "bg-yellow-50/50" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-7 text-center text-sm font-bold ${isTop3 ? "text-[#212121]" : "text-gray-300"}`}>
                          {isTop3 ? (
                            <span className="text-base">{member.rank === 1 ? "🥇" : member.rank === 2 ? "🥈" : "🥉"}</span>
                          ) : `#${member.rank}`}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${member.user_id === sessionUser ? "text-[#212121]" : "text-gray-600"}`}>
                            {member.full_name}
                            {member.user_id === sessionUser && <span className="ml-1.5 text-[10px] text-yellow-600 font-semibold">YOU</span>}
                          </p>
                          <p className="text-[11px] text-gray-400">{tierEmoji[member.membership_tier] || "⭐"} {member.membership_tier}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#212121]">{member.total_points.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">pts</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-sm font-semibold text-[#212121]">How Points Work</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: "☕", label: "Every Order", pts: "+1 pt / Rp1,000" },
                    { icon: "📅", label: "Reservation", pts: "+100 pts" },
                    { icon: "🎫", label: "Event Purchase", pts: "+200 pts" },
                    { icon: "💎", label: "VIP Event", pts: "+500 pts" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="text-base">{r.icon}</span><span className="text-gray-500">{r.label}</span></span>
                      <span className="text-xs font-semibold text-[#212121]">{r.pts}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-sm font-semibold text-[#212121]">Monthly Rewards</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { rank: "#1", reward: "1 Month Free VIP", icon: "👑" },
                    { rank: "#2-3", reward: "Weekend Brunch Set", icon: "🍽️" },
                    { rank: "#4-10", reward: "Signature Cocktail", icon: "🍸" },
                  ].map((r) => (
                    <div key={r.rank} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="text-base">{r.icon}</span><span className="text-gray-500">{r.rank}</span></span>
                      <span className="text-xs font-medium text-gray-600">{r.reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
