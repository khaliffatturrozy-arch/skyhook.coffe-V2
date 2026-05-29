"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { MembershipBadge } from "@/components/ui/membership-badge"
import { User, Mail, Phone, Calendar, LogOut, Loader2, ArrowLeft, Award, Wallet, ShoppingBag } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

type UserProfile = {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  membership_tier: string
  loyalty_points: number
  total_orders: number
  total_spent: number
  created_at: string
  last_visit: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      setSession(s)
      if (s?.user) {
        const { data } = await supabase.from("users").select("*").eq("id", s.user.id).single()
        if (data) setProfile(data)
      }
      setLoading(false)
    })()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  function formatSpent(n: number) {
    if (n >= 1_000_000) return `IDR ${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `IDR ${(n / 1_000).toFixed(0)}K`
    return `IDR ${n}`
  }

  if (loading) {
    return <div className="pt-24 min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {!session ? (
            <GlassCard className="text-center py-16">
              <User className="w-16 h-16 mx-auto text-white/20 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-white mb-2">Sign In Required</h2>
              <p className="text-white/40 mb-6">Sign in to view your profile and manage your account.</p>
              <Link href="/auth">
                <Button variant="primary">Sign In</Button>
              </Link>
            </GlassCard>
          ) : !profile ? (
            <GlassCard className="text-center py-16">
              <User className="w-16 h-16 mx-auto text-white/20 mb-4" />
              <h2 className="font-heading text-xl font-bold text-white mb-2">Profile Not Found</h2>
              <p className="text-white/40">Your profile data is not available yet. Please contact support.</p>
            </GlassCard>
          ) : (
            <>
              <GlassCard className="text-center mb-6">
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-skyhook-amber">{profile.full_name[0]}</span>
                </div>
                <h1 className="font-heading text-3xl font-bold text-white mb-1">{profile.full_name}</h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MembershipBadge tier={profile.membership_tier as any} />
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-1 text-white/40"><Mail className="w-3.5 h-3.5" /> {profile.email}</div>
                  {profile.phone && <div className="flex items-center gap-1 text-white/40"><Phone className="w-3.5 h-3.5" /> {profile.phone}</div>}
                  <div className="flex items-center gap-1 text-white/40"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile.created_at).toLocaleDateString()}</div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <GlassCard className="text-center">
                  <Award className="w-5 h-5 text-skyhook-amber mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{profile.loyalty_points.toLocaleString()}</p>
                  <p className="text-white/30 text-xs">Points</p>
                </GlassCard>
                <GlassCard className="text-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{profile.total_orders}</p>
                  <p className="text-white/30 text-xs">Orders</p>
                </GlassCard>
                <GlassCard className="text-center">
                  <Wallet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatSpent(Number(profile.total_spent))}</p>
                  <p className="text-white/30 text-xs">Spent</p>
                </GlassCard>
              </div>

              <GlassCard className="flex items-center justify-between">
                <Link href="/wallet">
                  <Button variant="secondary" size="sm">My Wallet</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </GlassCard>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
