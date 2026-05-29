"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Award, Lock, CheckCircle, Loader2, Coffee, Star, Calendar, Moon, Users, Crown, Utensils } from "lucide-react"
import { createClient } from "@/lib/supabase"

const iconMap: Record<string, any> = { coffee: Coffee, star: Star, calendar: Calendar, moon: Moon, users: Users, crown: Crown, utensils: Utensils }

type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points_required: number
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const [achRes, uaRes] = await Promise.all([
        supabase.from("achievements").select("*").order("points_required"),
        session?.user ? supabase.from("user_achievements").select("achievement_id").eq("user_id", session.user.id) : Promise.resolve({ data: null }),
      ])
      if (achRes.data) setAchievements(achRes.data)
      if (uaRes?.data) setUnlockedIds(new Set(uaRes.data.map((ua: any) => ua.achievement_id)))
      setLoading(false)
    })()
  }, [])

  const categories = [...new Set(achievements.map(a => a.category))]

  if (loading) {
    return <div className="pt-24 min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Award className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Achievements</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              <span className="text-gradient-gold">Achievements</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Unlock achievements by visiting Skyhook Coffee, placing orders, and engaging with the community.
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="text-center text-white/20 py-16">No achievements available yet.</p>
          ) : categories.map((category) => {
            const catAchievements = achievements.filter(a => a.category === category)
            return (
              <div key={category} className="mb-12">
                <h2 className="font-heading text-xl font-bold text-white capitalize mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catAchievements.map((ach) => {
                    const unlocked = unlockedIds.has(ach.id)
                    const Icon = iconMap[ach.icon] || Award
                    return (
                      <GlassCard key={ach.id} className={`relative ${unlocked ? "" : "opacity-60"}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${unlocked ? "bg-skyhook-amber/20" : "bg-white/5"}`}>
                          {unlocked ? <Icon className="w-6 h-6 text-skyhook-amber" /> : <Lock className="w-5 h-5 text-white/20" />}
                        </div>
                        <h3 className="font-heading text-white font-semibold text-sm mb-1">{ach.name}</h3>
                        <p className="text-white/30 text-xs mb-2">{ach.description}</p>
                        {unlocked && <CheckCircle className="w-4 h-4 text-emerald-400 absolute top-3 right-3" />}
                      </GlassCard>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
