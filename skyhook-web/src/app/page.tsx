"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation, Trophy, Crown, Medal, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface LBEntry {
  user_id: string
  full_name: string
  membership_tier: string
  total_points: number
  rank: number
}

const galleryImages = [
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlXSL3WIRwXs8Fhlm24LVvC0pMIB3TCySoTe8WfS7g.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlmBJG2G7asfCI3hlm2DRPgH5lBFpzRseEge7Ws8knw.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlmBsnHC3FCDCrbhlm2DWPOqxO8yRNQCibz44OV26pIg.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlXSrybOCayff7Hhlm2BOisut7bJCnSCeJKJuOCMdQ.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlmBt2RKTrJtC2rhlm2BBfyk7hhfF0TXq1pnhHQ3213A.jpg",
]

const rankEmojis: Record<number, string> = { 1: "🔥", 2: "👑", 3: "⭐", 4: "💎", 5: "✨", 6: "🌟", 7: "🎯", 8: "🎵", 9: "🎸", 10: "🎤", 11: "🏆", 12: "🎪", 13: "🎭", 14: "🎨", 15: "🎬" }

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<LBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState<LBEntry | null>(null)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      setSession(sessionData?.session ?? null)

      const { data } = await supabase.from("leaderboard").select("*").order("rank").limit(5)
      if (data) setLeaderboard(data as LBEntry[])

      if (sessionData?.session?.user?.id) {
        const { data: rankData } = await supabase.from("leaderboard").select("*").eq("user_id", sessionData.session.user.id).maybeSingle()
        if (rankData) setUserRank(rankData as LBEntry)
      }

      setLoading(false)
    }
    fetchData()

    const channel = supabase.channel("leaderboard-realtime").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "leaderboard" },
      () => { fetchData() }
    ).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <>
      {/* Leaderboard */}
      <section className="bg-white pt-24 pb-10">
        <div className="max-w-4xl mx-auto section-padding">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 mb-4">
              <Trophy className="w-4 h-4 text-[#313131]" />
              <span className="text-xs text-[rgba(33,33,33,0.6)] tracking-widest uppercase font-medium">Leaderboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-2">Top Members</h1>
            <p className="text-[rgba(33,33,33,0.6)] text-sm">Compete, earn points, and rise through the ranks</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#313131]" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-[#212121] text-sm">Rankings</h2>
                    <Link href="/leaderboard" className="text-xs text-[#2196F3] hover:underline">View all</Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {leaderboard.map((member) => {
                      const isTop3 = member.rank <= 3
                      const glowColors = ["from-yellow-200 to-amber-100", "from-gray-200 to-slate-100", "from-orange-200 to-amber-50"]
                      return (
                        <motion.div
                          key={member.user_id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: member.rank * 0.1, duration: 0.4 }}
                          className={`flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors ${isTop3 ? `bg-gradient-to-r ${glowColors[member.rank - 1]} relative` : ""} will-change-transform`}
                        >
                          {isTop3 && (
                            <motion.div
                              className="absolute inset-0 rounded-lg opacity-30"
                              animate={{ opacity: [0.15, 0.35, 0.15] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                          <div className="flex items-center gap-4 relative z-10">
                            <motion.span
                              animate={isTop3 ? { scale: [1, 1.08, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className={`w-7 text-sm font-bold text-center ${isTop3 ? "text-[#212121]" : "text-gray-300"}`}
                            >
                              #{member.rank}
                            </motion.span>
                            <motion.div
                              animate={isTop3 ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: member.rank * 0.3 }}
                              className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center shadow-sm"
                            >
                              <span className="text-base">{rankEmojis[member.rank] || "🏅"}</span>
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-[#212121]">{member.full_name || "Anonymous"}</p>
                              <span className="text-[10px] text-gray-400 uppercase tracking-wide">{member.membership_tier}</span>
                            </div>
                          </div>
                          <div className="text-right relative z-10">
                            <motion.p
                              animate={isTop3 ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: member.rank * 0.2 }}
                              className="text-sm font-semibold text-[#212121]"
                            >
                              {member.total_points?.toLocaleString() || 0}
                            </motion.p>
                            <p className="text-[10px] text-gray-400">points</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-4 h-4 text-[#313131]" />
                    <h3 className="font-semibold text-sm text-[#212121]">Your Rank</h3>
                  </div>
                  {session && userRank ? (
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-[#212121] mb-1">#{userRank.rank}</div>
                      <p className="text-xs text-gray-400">{userRank.total_points?.toLocaleString() || 0} points</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-300 mb-1">--</div>
                      <p className="text-xs text-gray-400">Sign in to see your rank</p>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Medal className="w-4 h-4 text-[#313131]" />
                    <h3 className="font-semibold text-sm text-[#212121]">How to Earn</h3>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Order</span><span className="font-medium text-[#212121]">+50 pts</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Reservation</span><span className="font-medium text-[#212121]">+100 pts</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Event Purchase</span><span className="font-medium text-[#212121]">+200 pts</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">VIP Event</span><span className="font-medium text-[#313131]">+500 pts</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Buttons */}
      <section className="bg-white pb-10">
        <div className="max-w-lg mx-auto section-padding flex flex-wrap justify-center gap-4">
          <Link href="/menu"
            className="bg-[#313131] hover:bg-black text-white rounded-full px-8 py-3 text-sm font-semibold tracking-wide transition-all hover:shadow-lg active:scale-[0.97]"
          >
            Menu
          </Link>
          <Link href="/reservasi"
            className="bg-[#313131] hover:bg-black text-white rounded-full px-8 py-3 text-sm font-semibold tracking-wide shadow-md transition-all hover:shadow-lg active:scale-[0.97]"
          >
            Reservasi
          </Link>
          <Link href="/menu/info"
            className="bg-[#2E2E2E] hover:bg-black text-white rounded-full px-8 py-3 text-sm font-semibold tracking-wide transition-all hover:shadow-lg active:scale-[0.97]"
          >
            Info
          </Link>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="w-full bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg shadow-sm relative aspect-[4/3]">
              <Image src={src} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Our Location */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto section-padding text-center">
          <div className="w-12 h-0.5 bg-[#313131] mx-auto mb-6" />
          <p className="text-2xl md:text-3xl font-bold text-[#212121] mb-6 tracking-tight">
            Our Location?
          </p>
          <p className="text-base md:text-lg text-[rgba(33,33,33,0.81)] leading-relaxed mb-8">
            <strong>Skyhook Coffee Rooftop House and Kitchen</strong><br />
            <em>Jl. Pusdiklat Depnaker No.23, RW.6, Pinang Ranti, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13560</em><br /><br />
            <em>Didepan SPBU Kampung Makasar</em>
          </p>
          <a href="https://www.google.com/maps/dir//Skyhook+Coffee+Rooftop+House+and+Kitchen" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            Google Maps
          </a>
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="w-full">
        <iframe
          src="https://maps.google.com/maps?q=Skyhook%20Coffee%20Rooftop%20House%20and%20Kitchen&t=m&z=14&output=embed&iwloc=near"
          className="w-full h-[350px] md:h-[450px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* WhatsApp floating button */}
      <a href="https://wa.me/6281774934980?text=Hallo%20admin%20Skyhook%20Coffee" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-[rgba(46,125,50,0.86)] hover:bg-[#2E7D32] text-white rounded-full p-3.5 shadow-lg transition-all hover:scale-110"
      >
        <svg viewBox="0 0 512 512" className="w-6 h-6" fill="currentColor">
          <path d="M256.064 0h-.128C114.784 0 0 114.816 0 256c0 56 18.048 107.904 48.736 150.048l-31.904 95.104 98.4-31.456C155.712 496.512 204 512 256.064 512 397.216 512 512 397.152 512 256S397.216 0 256.064 0zM394.72 384.16c-7.2 20.256-35.84 37.376-58.816 42.368-15.68 3.392-36.416 6.048-106.368-22.88-89.376-36.96-147.2-111.04-151.744-116.16-4.544-5.12-36.128-48.064-36.128-91.68 0-43.648 22.848-65.152 30.944-74.016 8.128-8.928 17.728-11.136 23.552-11.136 5.856 0 11.712.064 16.832.576 5.248.544 12.288-1.952 19.2 14.592 7.2 17.248 24.608 59.552 26.88 63.872 2.24 4.32 3.744 9.376 1.12 15.136-2.624 5.76-3.904 8.32-7.808 12.8-3.904 4.512-8.192 10.048-11.744 13.472-3.904 3.904-8.192 8.096-3.648 16.256 4.544 8.16 20.192 33.312 40.8 50.944 28.2 24.128 52.256 32.96 60.192 36.288 8.416 3.52 13.696 2.944 18.592-1.888 4.544-4.544 13.792-16.704 17.984-22.592s9.408-5.12 14.944-2.624c5.536 2.496 34.848 16.192 40.864 19.136 6.016 2.944 10.048 4.416 11.648 7.2 1.696 2.816 1.696 16.992-5.504 37.248z"/>
        </svg>
      </a>
    </>
  )
}
