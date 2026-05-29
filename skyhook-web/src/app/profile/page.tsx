"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Calendar, LogOut, Loader2, Award, Wallet, ShoppingBag, Crown, Sparkles, Save, X, Camera, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

type UserProfile = {
  id: string
  full_name: string
  email: string
  phone: string | null
  nickname: string | null
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
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [editForm, setEditForm] = useState({ full_name: "", nickname: "", phone: "", avatar_url: "" })

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      setSession(s)
      if (s?.user) {
        let { data } = await supabase.from("users").select("*").eq("id", s.user.id).single()
        if (!data) {
          const newUser = {
            id: s.user.id,
            email: s.user.email,
            full_name: s.user.user_metadata?.full_name || s.user.user_metadata?.name || s.user.email?.split("@")[0] || "User",
            avatar_url: s.user.user_metadata?.avatar_url || null,
            nickname: null,
            phone: null,
            membership_tier: "Regular",
            loyalty_points: 0,
            total_orders: 0,
            total_spent: 0,
            created_at: new Date().toISOString(),
            last_visit: null,
          }
          await supabase.from("users").upsert(newUser)
          data = newUser as UserProfile
        }
        setProfile(data)
        setEditForm({
          full_name: data.full_name || "",
          nickname: data.nickname || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url || "",
        })
      }
      setLoading(false)
    })()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
    router.push("/")
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true); setError(""); setSuccess("")
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from("users")
        .update({
          full_name: editForm.full_name,
          nickname: editForm.nickname || null,
          phone: editForm.phone || null,
          avatar_url: editForm.avatar_url || null,
        })
        .eq("id", profile.id)

      if (err) throw err
      setProfile({ ...profile, ...editForm, phone: editForm.phone || null, nickname: editForm.nickname || null, avatar_url: editForm.avatar_url || null })
      setEditing(false)
      setSuccess("Profile updated!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  function formatSpent(n: number) {
    if (n >= 1_000_000) return `IDR ${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `IDR ${(n / 1_000).toFixed(0)}K`
    return `IDR ${n}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-[#313131] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[rgba(33,33,33,0.4)]">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5 rotate-12">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-[#212121] mb-2">Sign In Required</h2>
          <p className="text-[rgba(33,33,33,0.5)] text-sm mb-6">Sign in to view and edit your profile.</p>
          <Link href="/auth" className="inline-block bg-[#313131] hover:bg-black text-white rounded-full px-6 py-2.5 text-sm font-medium transition-colors">
            Sign In
          </Link>
        </motion.div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <p className="text-[rgba(33,33,33,0.4)] text-sm">Profile data not available.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="section-padding max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Hero Profile Card */}
          <div className="relative bg-gradient-to-br from-[#212121] to-black rounded-2xl overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <motion.div
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 shadow-xl overflow-hidden"
                >
                  {editForm.avatar_url ? (
                    <img src={editForm.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">{profile.full_name[0]}</span>
                  )}
                  {editing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{editForm.full_name || profile.full_name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button onClick={() => setEditing(false)}
                        className="shrink-0 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 py-2 text-xs font-medium transition-all flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-3 py-2 text-xs font-medium transition-all flex items-center gap-1"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditing(true)}
                        className="shrink-0 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 py-2 text-xs font-medium transition-all flex items-center gap-1"
                      >
                        <Settings className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={handleSignOut}
                        className="shrink-0 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 py-2 text-xs font-medium transition-all flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-white/10"
              >
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-semibold text-white/80">{profile.membership_tier}</span>
              </motion.div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-4">{error}</p>}
          {success && <p className="text-emerald-600 text-sm bg-emerald-50 p-3 rounded-xl mb-4">{success}</p>}

          {/* Edit Form */}
          {editing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-xl p-5 mb-6"
            >
              <h3 className="font-semibold text-sm text-[#212121] mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Full Name</label>
                  <input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Nickname / Display Name</label>
                  <input value={editForm.nickname} onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                    placeholder="How others see you" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Phone</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+62 xxx" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Avatar URL</label>
                  <input value={editForm.avatar_url} onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                    placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Award, label: "Points", value: profile.loyalty_points.toLocaleString(), color: "from-amber-500 to-orange-600" },
              { icon: ShoppingBag, label: "Orders", value: profile.total_orders.toString(), color: "from-emerald-500 to-teal-600" },
              { icon: Wallet, label: "Spent", value: formatSpent(Number(profile.total_spent)), color: "from-blue-500 to-indigo-600" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg font-bold text-[#212121]">{stat.value}</p>
                <p className="text-[10px] text-[rgba(33,33,33,0.4)] uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Account Info */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-sm text-[#212121] mb-3">Account Info</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-[rgba(33,33,33,0.5)]">Full Name</span><span className="text-[#212121] font-medium">{profile.full_name}</span></div>
              {profile.nickname && <div className="flex justify-between"><span className="text-[rgba(33,33,33,0.5)]">Nickname</span><span className="text-[#212121] font-medium">{profile.nickname}</span></div>}
              <div className="flex justify-between"><span className="text-[rgba(33,33,33,0.5)]">Email</span><span className="text-[#212121] font-medium">{profile.email}</span></div>
              <div className="flex justify-between"><span className="text-[rgba(33,33,33,0.5)]">Phone</span><span className="text-[#212121] font-medium">{profile.phone || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[rgba(33,33,33,0.5)]">Member Since</span><span className="text-[#212121] font-medium">{new Date(profile.created_at).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-[rgba(33,33,33,0.5)]">Membership</span><span className="text-[#212121] font-medium">{profile.membership_tier}</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/wallet", label: "Wallet", icon: Wallet, color: "from-emerald-400 to-emerald-600" },
              { href: "/achievements", label: "Achievements", icon: Award, color: "from-amber-400 to-orange-600" },
              { href: "/reservasi", label: "Reservation", icon: Calendar, color: "from-violet-400 to-purple-600" },
              { href: "/menu", label: "Order", icon: ShoppingBag, color: "from-blue-400 to-indigo-600" },
            ].map((link, i) => {
              const Icon = link.icon
              return (
                <motion.div key={link.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                  <Link href={link.href}
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#212121]">{link.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </div>

        </motion.div>
      </div>
    </main>
  )
}
