"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import {
  Users, Search, Star, Coffee, Gift, Crown,
  ChevronRight, Phone, Mail, Calendar, MapPin,
  Loader2, TrendingUp, Award, Heart,
} from "lucide-react"
import Link from "next/link"

const TIERS = [
  { name: "Skyhook Royalty", min: 10000, color: "#C8A96A", icon: Crown },
  { name: "VIP Elite", min: 5000, color: "#8B5CF6", icon: Crown },
  { name: "Platinum", min: 2000, color: "#EC4899", icon: Award },
  { name: "Gold", min: 1000, color: "#F2A541", icon: Star },
  { name: "Silver", min: 500, color: "#7A6045", icon: Star },
  { name: "Member", min: 0, color: "rgba(248,242,233,0.3)", icon: Users },
]

type Member = {
  id: string
  full_name: string
  email: string
  phone: string | null
  membership_tier: string
  loyalty_points: number
  total_orders: number
  total_spent: number
  last_visit: string | null
  avatar_url: string | null
  created_at: string
}

export default function POSMembersPage() {
  const supabase = useCallback(() => createClient(), [])
  const [checking, setChecking] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedTier, setSelectedTier] = useState("All")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  useEffect(() => {
    (async () => {
      const client = supabase()
      const { data: { session } } = await client.auth.getSession()
      if (!session?.user?.id) { window.location.href = "/auth"; return }
      setChecking(false)
    })()
  }, [supabase])

  useEffect(() => {
    (async () => {
      const client = supabase()
      const { data } = await client
        .from("users")
        .select("*")
        .order("total_spent", { ascending: false })
        .limit(100)
      if (data) setMembers(data as Member[])
      setLoading(false)
    })()
  }, [supabase])

  const getTierIcon = (tier: string) => {
    const found = TIERS.find((t) => t.name === tier)
    return found?.icon || Users
  }

  const getTierColor = (tier: string) => {
    const found = TIERS.find((t) => t.name === tier)
    return found?.color || "rgba(248,242,233,0.3)"
  }

  const filteredMembers = members.filter((m) => {
    const matchSearch = !search || m.full_name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase())
    const matchTier = selectedTier === "All" || m.membership_tier === selectedTier
    return matchSearch && matchTier
  })

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#16110D" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C8A96A" }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#16110D" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(200,169,106,0.03) 0%, transparent 60%)" }} />

      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#F8F2E9" }}>Members</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(248,242,233,0.3)" }}>{members.length} registered members</p>
          </div>
          <Link href="/pos"
            className="px-4 py-2 rounded-2xl text-xs font-medium transition-all"
            style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.15)" }}>
            <Coffee className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />POS
          </Link>
        </div>

        {/* Tier Breakdown */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {TIERS.map((tier) => {
            const count = members.filter((m) => m.membership_tier === tier.name).length
            const Icon = tier.icon
            return (
              <button key={tier.name} onClick={() => setSelectedTier(selectedTier === tier.name ? "All" : tier.name)}
                className="rounded-2xl p-3 text-center transition-all"
                style={{
                  background: selectedTier === tier.name ? `${tier.color}12` : "rgba(33,25,19,0.4)",
                  border: `1px solid ${selectedTier === tier.name ? `${tier.color}25` : "rgba(255,255,255,0.04)"}`,
                }}>
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: tier.color }} />
                <p className="text-[9px] font-medium truncate" style={{ color: selectedTier === tier.name ? tier.color : "rgba(248,242,233,0.3)" }}>
                  {tier.name}
                </p>
                <p className="text-xs font-bold mt-0.5" style={{ color: "#F8F2E9" }}>{count}</p>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Member List */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ background: "rgba(33,25,19,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
                  style={{ background: "rgba(22,17,13,0.5)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.6)" }} />
              </div>
            </div>

            <div className="divide-y max-h-[500px] overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
              {loading ? (
                <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(248,242,233,0.06)" }} />
                  <p className="text-xs" style={{ color: "rgba(248,242,233,0.15)" }}>No members found</p>
                </div>
              ) : (
                filteredMembers.map((member, i) => {
                  const TierIcon = getTierIcon(member.membership_tier)
                  const tierColor = getTierColor(member.membership_tier)
                  return (
                    <motion.button key={member.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                      onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                      style={{ background: selectedMember?.id === member.id ? "rgba(200,169,106,0.04)" : "transparent" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: `${tierColor}15`, color: tierColor }}>
                        {member.full_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "#F8F2E9" }}>{member.full_name || "Unknown"}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <TierIcon className="w-3 h-3" style={{ color: tierColor }} />
                          <span className="text-[9px]" style={{ color: tierColor }}>{member.membership_tier}</span>
                          <span className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>{member.loyalty_points} pts</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium" style={{ color: "#C8A96A" }}>IDR {Number(member.total_spent || 0).toLocaleString()}</p>
                        <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>{member.total_orders} orders</p>
                      </div>
                      <ChevronRight className="w-3 h-3" style={{ color: "rgba(248,242,233,0.15)" }} />
                    </motion.button>
                  )
                })
              )}
            </div>
          </div>

          {/* Member Detail */}
          <div className="rounded-2xl p-4"
            style={{ background: "rgba(33,25,19,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
            {selectedMember ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-2"
                    style={{ background: `${getTierColor(selectedMember.membership_tier)}15`, color: getTierColor(selectedMember.membership_tier) }}>
                    {selectedMember.full_name?.charAt(0) || "?"}
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>{selectedMember.full_name}</h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg inline-block mt-1"
                    style={{ background: `${getTierColor(selectedMember.membership_tier)}15`, color: getTierColor(selectedMember.membership_tier) }}>
                    {selectedMember.membership_tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl p-3 text-center" style={{ background: "rgba(33,25,19,0.5)" }}>
                    <p className="text-lg font-bold" style={{ color: "#C8A96A" }}>{selectedMember.loyalty_points}</p>
                    <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>Points</p>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: "rgba(33,25,19,0.5)" }}>
                    <p className="text-lg font-bold" style={{ color: "#F8F2E9" }}>{selectedMember.total_orders}</p>
                    <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>Visits</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(33,25,19,0.5)" }}>
                    <Mail className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
                    <span className="text-[11px]" style={{ color: "rgba(248,242,233,0.5)" }}>{selectedMember.email}</span>
                  </div>
                  {selectedMember.phone && (
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(33,25,19,0.5)" }}>
                      <Phone className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
                      <span className="text-[11px]" style={{ color: "rgba(248,242,233,0.5)" }}>{selectedMember.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(33,25,19,0.5)" }}>
                    <DollarSignIcon className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
                    <span className="text-[11px]" style={{ color: "rgba(248,242,233,0.5)" }}>
                      Total spent: IDR {Number(selectedMember.total_spent || 0).toLocaleString()}
                    </span>
                  </div>
                  {selectedMember.last_visit && (
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(33,25,19,0.5)" }}>
                      <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
                      <span className="text-[11px]" style={{ color: "rgba(248,242,233,0.5)" }}>
                        Last visit: {new Date(selectedMember.last_visit).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rewards progress */}
                <div>
                  <p className="text-[9px] font-medium mb-1.5" style={{ color: "rgba(248,242,233,0.2)" }}>Next Tier Progress</p>
                  <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: "45%" }}
                      className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #C8A96A, #A68B4E)" }} />
                  </div>
                  <p className="text-[9px] mt-1" style={{ color: "rgba(248,242,233,0.15)" }}>550 pts to next tier</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(248,242,233,0.06)" }} />
                <p className="text-xs" style={{ color: "rgba(248,242,233,0.15)" }}>Select a member to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DollarSignIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
