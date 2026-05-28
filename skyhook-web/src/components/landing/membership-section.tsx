"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ROUTES } from "@/config"
import { Crown, Diamond, Star, Award, Medal, User, Check } from "lucide-react"

const tiers = [
  {
    name: "Skyhook Royalty",
    icon: Crown,
    range: "#1 – #3",
    color: "text-yellow-400",
    bg: "bg-yellow-400/5",
    border: "border-yellow-400/20",
    benefits: ["Private rooftop access", "VIP lounge", "Exclusive menu", "Premium invitations", "Priority reservations"],
  },
  {
    name: "VIP Elite",
    icon: Diamond,
    range: "#4 – #10",
    color: "text-gray-300",
    bg: "bg-gray-300/5",
    border: "border-gray-300/20",
    benefits: ["VIP events access", "Priority booking", "Exclusive promotions", "Dedicated host"],
  },
  {
    name: "Platinum",
    icon: Star,
    range: "#11 – #25",
    color: "text-blue-200",
    bg: "bg-blue-200/5",
    border: "border-blue-200/20",
    benefits: ["Early event access", "Birthday rewards", "Special offers", "Community access"],
  },
  {
    name: "Gold",
    icon: Award,
    range: "#26 – #50",
    color: "text-yellow-500",
    bg: "bg-yellow-500/5",
    border: "border-yellow-500/20",
    benefits: ["Loyalty bonuses", "Event discounts", "Community features"],
  },
  {
    name: "Silver",
    icon: Medal,
    range: "#51 – #100",
    color: "text-gray-400",
    bg: "bg-gray-400/5",
    border: "border-gray-400/20",
    benefits: ["Points multiplier", "Birthday treat", "Member perks"],
  },
  {
    name: "Member",
    icon: User,
    range: "#101+",
    color: "text-amber-600",
    bg: "bg-amber-600/5",
    border: "border-amber-600/20",
    benefits: ["Earn points", "Community access", "Weekly offers"],
  },
]

export function MembershipSection() {
  return (
    <section className="relative py-32 section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-skyhook-amber text-sm tracking-widest uppercase font-medium mb-2 block">
            Membership Tiers
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            Rise Through the <span className="text-gradient-gold">Ranks</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Every visit earns you points. Climb the leaderboard and unlock exclusive privileges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {tiers.map((tier, index) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className={`h-full ${tier.bg} ${tier.border} border`}>
                  <div className="text-center mb-6">
                    <Icon className={`w-10 h-10 ${tier.color} mx-auto mb-3`} />
                    <h3 className={`font-heading text-lg font-semibold ${tier.color}`}>{tier.name}</h3>
                    <span className="text-white/30 text-xs">{tier.range}</span>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-skyhook-amber mt-0.5 shrink-0" />
                        <span className="text-white/50 text-xs">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href={ROUTES.leaderboard}>
            <Button variant="gold" size="lg">
              <Crown className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
