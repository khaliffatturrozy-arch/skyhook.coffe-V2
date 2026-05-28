"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { MembershipBadge } from "@/components/ui/membership-badge"
import { Trophy, Crown, TrendingUp, Medal } from "lucide-react"

const leaderboard = [
  { rank: 1, name: "Khalif", tier: "Skyhook Royalty" as const, points: 12450, change: "up", badge: "🔥" },
  { rank: 2, name: "Ayu", tier: "Skyhook Royalty" as const, points: 11230, change: "up", badge: "👑" },
  { rank: 3, name: "Bima", tier: "Skyhook Royalty" as const, points: 10890, change: "down", badge: "⭐" },
  { rank: 4, name: "Citra", tier: "VIP Elite" as const, points: 9870, change: "up", badge: "💎" },
  { rank: 5, name: "Dimas", tier: "VIP Elite" as const, points: 9540, change: "same", badge: "✨" },
  { rank: 6, name: "Elsa", tier: "VIP Elite" as const, points: 9210, change: "up", badge: "🌟" },
  { rank: 7, name: "Farhan", tier: "VIP Elite" as const, points: 8890, change: "down", badge: "🎯" },
  { rank: 8, name: "Gita", tier: "VIP Elite" as const, points: 8560, change: "up", badge: "🎵" },
  { rank: 9, name: "Hadi", tier: "VIP Elite" as const, points: 8230, change: "same", badge: "🎸" },
  { rank: 10, name: "Indah", tier: "VIP Elite" as const, points: 7900, change: "up", badge: "🎤" },
  { rank: 11, name: "Joko", tier: "Platinum" as const, points: 7450, change: "up", badge: "🏆" },
  { rank: 12, name: "Karin", tier: "Platinum" as const, points: 7100, change: "down", badge: "🎪" },
  { rank: 13, name: "Leo", tier: "Platinum" as const, points: 6850, change: "up", badge: "🎭" },
  { rank: 14, name: "Maya", tier: "Platinum" as const, points: 6520, change: "same", badge: "🎨" },
  { rank: 15, name: "Nando", tier: "Platinum" as const, points: 6200, change: "up", badge: "🎬" },
]

export default function LeaderboardPage() {
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
                      key={member.rank}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 text-lg font-bold text-center ${
                          member.rank <= 3 ? "text-skyhook-gold" : "text-white/30"
                        }`}>
                          #{member.rank}
                        </span>
                        <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                          <span className="text-lg">{member.badge}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{member.name}</p>
                          <MembershipBadge tier={member.tier} size="sm" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{member.points.toLocaleString()}</p>
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
                  <div className="flex justify-between">
                    <span className="text-white/40">Order</span>
                    <span className="text-white">+50 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Reservation</span>
                    <span className="text-white">+100 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Event Purchase</span>
                    <span className="text-white">+200 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">VIP Event</span>
                    <span className="text-skyhook-gold">+500 pts</span>
                  </div>
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
        </motion.div>
      </div>
    </div>
  )
}
