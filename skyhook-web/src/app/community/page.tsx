"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Heart, Share2, Coffee, Music, Globe, Crown } from "lucide-react"

const communities = [
  { name: "Coffee Connoisseurs", members: 342, icon: Coffee, desc: "For the true coffee enthusiasts", color: "from-amber-600/20 to-orange-600/20" },
  { name: "Rooftop Rebels", members: 256, icon: Music, desc: "Nightlife and music lovers", color: "from-purple-600/20 to-pink-600/20" },
  { name: "Global Skyhook", members: 189, icon: Globe, desc: "International community", color: "from-blue-600/20 to-cyan-600/20" },
  { name: "VIP Circle", members: 78, icon: Crown, desc: "Exclusive for Skyhook Royalty", color: "from-skyhook-gold/20 to-amber-600/20" },
]

const feed = [
  { user: "Khalif", badge: "Skyhook Royalty", content: "Best sunset session at the Bali rooftop! 🌅", likes: 45, comments: 12, time: "2h ago" },
  { user: "Ayu", badge: "VIP Elite", content: "The new Matcha Dream is incredible 🔥", likes: 32, comments: 8, time: "4h ago" },
  { user: "Bima", badge: "VIP Elite", content: "Neon Nights was legendary last night! 🎵", likes: 67, comments: 23, time: "6h ago" },
  { user: "Citra", badge: "Platinum", content: "Saturday morning coffee ritual ☕✨", likes: 28, comments: 5, time: "8h ago" },
]

export default function CommunityPage() {
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
            {communities.map((comm) => {
              const Icon = comm.icon
              return (
                <motion.div
                  key={comm.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="text-center group cursor-pointer">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${comm.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-skyhook-amber" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white mb-1">{comm.name}</h3>
                    <p className="text-white/30 text-xs mb-1">{comm.members} members</p>
                    <p className="text-white/40 text-xs mb-4">{comm.desc}</p>
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
            {feed.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      <span className="text-sm">{post.user[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium">{post.user}</p>
                        <span className="text-[10px] text-skyhook-gold bg-skyhook-gold/10 px-2 py-0.5 rounded-full">
                          {post.badge}
                        </span>
                      </div>
                      <p className="text-white/30 text-xs">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{post.content}</p>
                  <div className="flex items-center gap-6 text-white/30 text-xs">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-skyhook-amber transition-colors">
                      <MessageCircle className="w-4 h-4" /> {post.comments}
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
