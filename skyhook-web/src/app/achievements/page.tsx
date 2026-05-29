"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Lock, CheckCircle, Loader2, Coffee, Star, Calendar, Moon, Users, Crown, Utensils, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase"

const iconMap: Record<string, any> = { coffee: Coffee, star: Star, calendar: Calendar, moon: Moon, users: Users, crown: Crown, utensils: Utensils }

const categoryColors: Record<string, { bg: string; icon: string; from: string; to: string }> = {
  visits: { bg: "bg-amber-50", icon: "text-amber-600", from: "from-amber-400", to: "to-orange-500" },
  orders: { bg: "bg-blue-50", icon: "text-blue-600", from: "from-blue-400", to: "to-indigo-500" },
  social: { bg: "bg-rose-50", icon: "text-rose-600", from: "from-rose-400", to: "to-pink-500" },
  special: { bg: "bg-violet-50", icon: "text-violet-600", from: "from-violet-400", to: "to-purple-500" },
}

type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points_required: number
}

function BlobShape({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill={color || "currentColor"} d="M45.3,-65.5C59.3,-58.9,71.6,-46.5,76.2,-31.9C80.8,-17.3,77.7,-0.5,72.3,14.5C66.9,29.5,59.2,42.7,48,53.1C36.8,63.5,22.1,71.2,6.6,77.1C-8.9,83,-25.1,87.1,-39.1,81.4C-53,75.7,-64.7,60.2,-72,43.3C-79.3,26.4,-82.3,8.1,-78.5,-8.2C-74.7,-24.5,-64.2,-38.8,-51.1,-46.5C-38,-54.2,-22.3,-55.3,-6.1,-47.3C10.1,-39.4,31.3,-72.1,45.3,-65.5Z" transform="translate(100 100)" />
    </svg>
  )
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      setSession(s)
      const [achRes, uaRes] = await Promise.all([
        supabase.from("achievements").select("*").order("points_required"),
        s?.user ? supabase.from("user_achievements").select("achievement_id").eq("user_id", s.user.id) : Promise.resolve({ data: null }),
      ])
      if (achRes.data) setAchievements(achRes.data)
      if (uaRes?.data) setUnlockedIds(new Set(uaRes.data.map((ua: any) => ua.achievement_id)))
      setLoading(false)
    })()
  }, [])

  const categories = [...new Set(achievements.map(a => a.category))]
  const unlockedCount = unlockedIds.size
  const totalCount = achievements.length
  const progressPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-[#313131] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[rgba(33,33,33,0.4)]">Loading achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-20 pb-16 overflow-hidden">
      {/* Abstract background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <BlobShape className="absolute -top-32 -right-32 w-96 h-96 text-amber-100/50" />
        <BlobShape className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] text-blue-50/60" />
        <BlobShape className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] text-rose-50/30" />
      </div>

      <div className="relative z-10 section-padding max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">Achievements</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-3">Your Journey</h1>
            <p className="text-sm text-[rgba(33,33,33,0.5)] max-w-lg mx-auto">
              Every visit, order, and moment at Skyhook unlocks a new milestone.
            </p>
          </div>

          {/* Progress Overview */}
          {session && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 mb-10 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-[rgba(33,33,33,0.4)] uppercase tracking-wider font-medium">Progress</p>
                  <p className="text-2xl font-bold text-[#212121] mt-0.5">
                    {unlockedCount}
                    <span className="text-sm font-normal text-[rgba(33,33,33,0.4)]"> / {totalCount} unlocked</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-[rgba(33,33,33,0.5)]">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{progressPct}% complete</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {!session && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 mb-6"
            >
              <p className="text-sm text-[rgba(33,33,33,0.4)]">
                Sign in to track your achievements and progress.
              </p>
            </motion.div>
          )}

          {/* Achievement Cards */}
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-sm text-[rgba(33,33,33,0.4)]">No achievements yet.</p>
            </div>
          ) : categories.map((category, ci) => {
            const catAchs = achievements.filter(a => a.category === category)
            const colors = categoryColors[category] || { bg: "bg-gray-50", icon: "text-gray-600", from: "from-gray-400", to: "to-gray-500" }
            return (
              <motion.div key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + ci * 0.08 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <Award className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <h2 className="text-sm font-bold text-[#212121] uppercase tracking-wider">{category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catAchs.map((ach, ai) => {
                    const unlocked = unlockedIds.has(ach.id)
                    const Icon = iconMap[ach.icon] || Award
                    return (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + ci * 0.08 + ai * 0.04 }}
                        className={`relative group rounded-xl border transition-all ${
                          unlocked
                            ? "bg-white border-gray-100 hover:shadow-md"
                            : "bg-white/50 border-gray-100/50"
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              unlocked ? "bg-gradient-to-br " + colors.from + " " + colors.to : "bg-gray-100"
                            }`}>
                              {unlocked ? (
                                <Icon className="w-5 h-5 text-white" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            {unlocked && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.3 }}>
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </motion.div>
                            )}
                          </div>
                          <h3 className={`text-sm font-bold ${unlocked ? "text-[#212121]" : "text-[rgba(33,33,33,0.4)]"} mb-0.5`}>{ach.name}</h3>
                          <p className={`text-xs ${unlocked ? "text-[rgba(33,33,33,0.5)]" : "text-[rgba(33,33,33,0.25)]"}`}>{ach.description}</p>
                          {!unlocked && (
                            <div className="mt-2">
                              <span className="text-[10px] text-[rgba(33,33,33,0.2)] font-medium">{ach.points_required} pts required</span>
                            </div>
                          )}
                        </div>
                        {unlocked && (
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none`} />
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </main>
  )
}
