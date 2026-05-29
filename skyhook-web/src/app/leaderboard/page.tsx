"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { MembershipBadge } from "@/components/ui/membership-badge"
import { Trophy, Crown, TrendingUp, Medal, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface LBEntry {
  user_id: string
  full_name: string
  membership_tier: string
  total_points: number
  rank: number
}

const rankEmojis: Record<number, string> = { 1: "🔥", 2: "👑", 3: "⭐", 4: "💎", 5: "✨", 6: "🌟", 7: "🎯", 8: "🎵", 9: "🎸", 10: "🎤", 11: "🏆", 12: "🎪", 13: "🎭", 14: "🎨", 15: "🎬" }

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LBEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await createClient().from("leaderboard").select("*").order("rank").limit(50)
      if (data) setLeaderboard(data as LBEntry[])
      setLoading(false)
    })()
  }, [])
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 cinematic-gradient" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Trophy className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Competition</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              <span className="text-gradient-gold">Leaderboard</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Compete, earn points, and rise through the ranks to become Skyhook Royalty.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>
          ) : leaderboard.length === 0 ? (
            <p className="text-white/20 text-center py-20">No data yet</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <GlassCard className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-semibold">Top Members</h2>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      Updated realtime
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {leaderboard.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 text-lg font-bold text-center ${
                            member.rank <= 3 ? "text-skyhook-gold" : "text-white/30"
                          }`}>
                            #{member.rank}
                          </span>
                          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                            <span className="text-lg">{rankEmojis[member.rank] || "🏅"}</span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{member.full_name}</p>
                            <MembershipBadge tier={member.membership_tier as any} size="sm" />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{member.total_points.toLocaleString()}</p>
                          <p className="text-white/20 text-xs">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-4">
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-5 h-5 text-skyhook-gold" />
                    <h3 className="font-heading text-lg font-semibold">Your Rank</h3>
                  </div>
                  <div className="text-center py-6">
                    <div className="text-5xl font-heading font-bold text-gradient-gold mb-2">--</div>
                    <p className="text-white/40 text-sm">Sign in to see your rank</p>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <Medal className="w-5 h-5 text-skyhook-amber" />
                    <h3 className="font-heading text-lg font-semibold">How to Earn</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-white/40">Order</span><span className="text-white">+50 pts</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Reservation</span><span className="text-white">+100 pts</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Event Purchase</span><span className="text-white">+200 pts</span></div>
                    <div className="flex justify-between"><span className="text-white/40">VIP Event</span><span className="text-skyhook-gold">+500 pts</span></div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-heading text-lg font-semibold mb-4">Rewards</h3>
                  <div className="space-y-3">
                    {[
                      { rank: "#1", reward: "1 Month Free VIP" },
                      { rank: "#2-3", reward: "Weekend Brunch Set" },
                      { rank: "#4-10", reward: "Signature Cocktail" },
                    ].map((r) => (
                      <div key={r.rank} className="flex justify-between text-sm">
                        <span className="text-skyhook-amber">{r.rank}</span>
                        <span className="text-white/60">{r.reward}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
