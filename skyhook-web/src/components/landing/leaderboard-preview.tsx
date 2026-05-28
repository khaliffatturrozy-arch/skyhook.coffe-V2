"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { MembershipBadge } from "@/components/ui/membership-badge"
import { ROUTES } from "@/config"
import { ArrowRight, Trophy, Crown } from "lucide-react"

const topMembers = [
  { rank: 1, name: "Khalif", tier: "Skyhook Royalty" as const, points: 12450 },
  { rank: 2, name: "Ayu", tier: "Skyhook Royalty" as const, points: 11230 },
  { rank: 3, name: "Bima", tier: "Skyhook Royalty" as const, points: 10890 },
  { rank: 4, name: "Citra", tier: "VIP Elite" as const, points: 9870 },
  { rank: 5, name: "Dimas", tier: "VIP Elite" as const, points: 9540 },
]

export function LeaderboardPreview() {
  return (
    <section className="relative py-32 section-padding">
      <div className="absolute inset-0 cinematic-gradient" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Trophy className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Competition</span>
            </div>

            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Rise to <span className="text-gradient-gold">Royalty</span>
            </h2>

            <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-lg">
              Compete with the Skyhook community. Every order, reservation, and event purchase 
              brings you closer to the top.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: "Orders", value: "50 pts", color: "text-skyhook-amber" },
                { label: "Reservations", value: "100 pts", color: "text-skyhook-gold" },
                { label: "Events", value: "200 pts", color: "text-skyhook-orange" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 glass rounded-xl">
                  <div className={`${stat.color} text-lg font-bold`}>{stat.value}</div>
                  <div className="text-white/40 text-xs mt-1">per {stat.label}</div>
                </div>
              ))}
            </div>

            <Link href={ROUTES.leaderboard}>
              <Button variant="primary" size="lg" className="group">
                View Full Leaderboard
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-semibold">Top Members</h3>
                <Crown className="w-5 h-5 text-skyhook-gold" />
              </div>
              <div className="space-y-3">
                {topMembers.map((member) => (
                  <div
                    key={member.rank}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-bold w-8 ${
                        member.rank <= 3 ? "text-skyhook-gold" : "text-white/40"
                      }`}>
                        #{member.rank}
                      </span>
                      <div>
                        <p className="text-white text-sm font-medium">{member.name}</p>
                        <MembershipBadge tier={member.tier} size="sm" />
                      </div>
                    </div>
                    <span className="text-white/40 text-sm">{member.points.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
