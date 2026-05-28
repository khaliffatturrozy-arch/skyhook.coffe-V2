"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Coffee, Music, Users, Sparkles, Star, Globe } from "lucide-react"

const experiences = [
  {
    icon: Coffee,
    title: "Premium Coffee",
    description: "Handcrafted specialty coffee from the finest beans, curated by world-class baristas.",
    color: "from-skyhook-amber/20 to-skyhook-orange/20",
  },
  {
    icon: Music,
    title: "Rooftop Nights",
    description: "Live DJ sets, acoustic sessions, and unforgettable nightlife experiences under the stars.",
    color: "from-purple-500/10 to-pink-500/10",
  },
  {
    icon: Users,
    title: "VIP Community",
    description: "An exclusive community of tastemakers, creators, and luxury lifestyle enthusiasts.",
    color: "from-skyhook-gold/20 to-skyhook-amber/20",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Intelligent recommendations and personalized experiences powered by advanced AI.",
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Star,
    title: "Gamified Rewards",
    description: "Earn points, climb the leaderboard, unlock achievements, and become royalty.",
    color: "from-skyhook-gold/20 to-yellow-500/20",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Premium outlets across multiple cities, countries, and continents.",
    color: "from-emerald-500/10 to-teal-500/10",
  },
]

export function ExperienceSection() {
  return (
    <section className="relative py-32 section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/50 to-skyhook-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            The <span className="text-gradient-gold">Experience</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            More than coffee. A lifestyle ecosystem designed for the modern connoisseur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group cursor-pointer">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <exp.icon className="w-6 h-6 text-skyhook-amber" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">{exp.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{exp.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
