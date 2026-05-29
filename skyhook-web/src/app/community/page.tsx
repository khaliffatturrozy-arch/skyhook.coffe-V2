"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Heart, Share2, Coffee, Music, Globe, Crown, Loader2 } from "lucide-react"

const iconMap: Record<string, typeof Coffee> = { Coffee, Music, Globe, Crown }

type PostWithUser = {
  id: string; content: string; like_count: number; comment_count: number; created_at: string
  users: { full_name: string; membership_tier: string } | null
}

type Group = {
  id: string; name: string; description: string; member_count: number; category: string; color: string
}

export default function CommunityPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/community")
      const data = await res.json()
      if (data.groups) setGroups(data.groups)
      if (data.posts) setPosts(data.posts)
      setLoading(false)
    })()
  }, [])

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    return `${h}h ago`
  }

  if (loading) {
    return <div className="pt-24 min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Users className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Social</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              <span className="text-gradient-gold">Community</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Connect with fellow Skyhook members. Share experiences, earn badges, and build your social presence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {groups.map((comm) => {
              const Icon = iconMap[comm.category] || Coffee
              return (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="text-center group cursor-pointer">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${comm.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-skyhook-amber" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white mb-1">{comm.name}</h3>
                    <p className="text-white/30 text-xs mb-1">{comm.member_count} members</p>
                    <p className="text-white/40 text-xs mb-4">{comm.description}</p>
                    <Button variant="ghost" size="sm" className="w-full">Join</Button>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>

          <h2 className="font-heading text-2xl font-bold mb-6">
            Community <span className="text-gradient-gold">Feed</span>
          </h2>

          <div className="space-y-4 max-w-3xl">
            {posts.length === 0 ? (
              <p className="text-white/20 text-center py-10">No posts yet. Be the first to share!</p>
            ) : posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      <span className="text-sm">{post.users?.full_name?.[0] || "?"}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium">{post.users?.full_name || "Guest"}</p>
                        {post.users?.membership_tier && (
                          <span className="text-[10px] text-skyhook-gold bg-skyhook-gold/10 px-2 py-0.5 rounded-full">
                            {post.users.membership_tier}
                          </span>
                        )}
                      </div>
                      <p className="text-white/30 text-xs">{timeAgo(post.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{post.content}</p>
                  <div className="flex items-center gap-6 text-white/30 text-xs">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4" /> {post.like_count}
                    </button>
                    <button className="flex items-center gap-1 hover:text-skyhook-amber transition-colors">
                      <MessageCircle className="w-4 h-4" /> {post.comment_count}
                    </button>
                    <button className="flex items-center gap-1 hover:text-skyhook-amber transition-colors ml-auto">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
