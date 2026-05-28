"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ROUTES } from "@/config"
import { ArrowRight, Calendar, Music, MapPin } from "lucide-react"

const events = [
  {
    title: "Neon Nights",
    date: "Every Friday",
    type: "DJ Night",
    venue: "Main Rooftop",
    description: "Curated electronic music under the stars",
    color: "from-purple-600/20 to-pink-600/20",
  },
  {
    title: "Acoustic Sessions",
    date: "Every Saturday",
    type: "Live Music",
    venue: "Garden Lounge",
    description: "Intimate acoustic performances with premium cocktails",
    color: "from-amber-600/20 to-orange-600/20",
  },
  {
    title: "Skyhook Social",
    date: "Monthly",
    type: "Community",
    venue: "VIP Lounge",
    description: "Exclusive networking for our premium members",
    color: "from-skyhook-gold/20 to-amber-600/20",
  },
  {
    title: "Sunset Vibes",
    date: "Every Sunday",
    type: "Chill Session",
    venue: "Sunset Deck",
    description: "Wind down with smooth jazz and golden hour views",
    color: "from-orange-600/20 to-yellow-600/20",
  },
]

export function EventSlider() {
  return (
    <section className="relative py-32 section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <div>
            <span className="text-skyhook-amber text-sm tracking-widest uppercase font-medium mb-2 block">
              Nightlife & Events
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-bold">
              Upcoming <span className="text-gradient-gold">Events</span>
            </h2>
          </div>
          <Link href={ROUTES.events} className="mt-4 md:mt-0">
            <Button variant="ghost" className="group">
              All Events
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group cursor-pointer p-0 overflow-hidden">
                <div className={`h-40 bg-gradient-to-br ${event.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 p-5">
                    <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-white mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Calendar className="w-3 h-3 text-skyhook-amber" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <MapPin className="w-3 h-3 text-skyhook-amber" />
                      {event.venue}
                    </div>
                  </div>
                  <p className="text-white/40 text-sm">{event.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
