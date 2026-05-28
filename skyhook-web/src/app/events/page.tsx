"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Music, Ticket } from "lucide-react"

const events = [
  {
    title: "Neon Nights",
    date: "Every Friday",
    time: "21:00 - 02:00",
    venue: "Main Rooftop",
    type: "DJ Night",
    desc: "Curated electronic music under the stars with world-class DJs",
    price: "IDR 150K",
    color: "from-purple-600/20 to-pink-600/20",
  },
  {
    title: "Acoustic Sessions",
    date: "Every Saturday",
    time: "19:00 - 22:00",
    venue: "Garden Lounge",
    type: "Live Music",
    desc: "Intimate acoustic performances with premium cocktails",
    price: "IDR 100K",
    color: "from-amber-600/20 to-orange-600/20",
  },
  {
    title: "Skyhook Social",
    date: "Monthly",
    time: "20:00 - 23:00",
    venue: "VIP Lounge",
    type: "Community",
    desc: "Exclusive networking for our premium members",
    price: "Free (Members)",
    color: "from-skyhook-gold/20 to-amber-600/20",
  },
  {
    title: "Sunset Vibes",
    date: "Every Sunday",
    time: "17:00 - 20:00",
    venue: "Sunset Deck",
    type: "Chill Session",
    desc: "Wind down with smooth jazz and golden hour views",
    price: "IDR 75K",
    color: "from-orange-600/20 to-yellow-600/20",
  },
  {
    title: "Jazz & Brews",
    date: "Every Thursday",
    time: "20:00 - 23:00",
    venue: "Main Rooftop",
    type: "Live Jazz",
    desc: "Smooth jazz, craft cocktails, and premium coffee blends",
    price: "IDR 125K",
    color: "from-blue-600/20 to-indigo-600/20",
  },
  {
    title: "VIP Royal Dinner",
    date: "Monthly",
    time: "19:00 - 23:00",
    venue: "Private Lounge",
    type: "VIP Exclusive",
    desc: "6-course degustation dinner with wine pairing",
    price: "IDR 500K",
    color: "from-skyhook-gold/30 to-amber-700/20",
  },
]

export default function EventsPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/50 to-skyhook-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Music className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Nightlife & Culture</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              Events & <span className="text-gradient-gold">Experiences</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              From live music to exclusive VIP gatherings — experience the best of rooftop nightlife.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden group cursor-pointer">
                  <div className={`h-48 bg-gradient-to-br ${event.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                      <span className="text-xs text-white/80 bg-white/10 px-3 py-1 rounded-full w-fit">
                        {event.type}
                      </span>
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-white mb-1">{event.title}</h3>
                        <p className="text-white/60 text-sm">{event.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Calendar className="w-4 h-4 text-skyhook-amber" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Clock className="w-4 h-4 text-skyhook-amber" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <MapPin className="w-4 h-4 text-skyhook-amber" />
                        {event.venue}
                      </div>
                    </div>
                    <p className="text-white/40 text-sm mb-5">{event.desc}</p>
                    <Button variant="primary" size="sm" className="w-full">
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Tickets
                    </Button>
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
