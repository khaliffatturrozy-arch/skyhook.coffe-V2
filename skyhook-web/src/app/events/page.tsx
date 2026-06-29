"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Music, Ticket, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

const TicketModal = lazy(() => import("@/components/events/ticket-modal").then((m) => ({ default: m.TicketModal })))

interface SkyEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  type: string
  description: string
  price: number
  capacity: number
  tickets_sold: number
}

const typeColors: Record<string, string> = {
  dj_night: "from-purple-600/20 to-pink-600/20",
  live_music: "from-amber-600/20 to-orange-600/20",
  community: "from-skyhook-gold/20 to-amber-600/20",
  vip: "from-skyhook-gold/30 to-amber-700/20",
}

const typeLabels: Record<string, string> = {
  dj_night: "DJ Night",
  live_music: "Live Music",
  community: "Community",
  vip: "VIP Exclusive",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function EventsPage() {
  const [events, setEvents] = useState<SkyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [ticketEvent, setTicketEvent] = useState<SkyEvent | null>(null)

  useEffect(() => {
    (async () => {
      const { data } = await createClient().from("events").select("*").order("date")
      if (data) setEvents(data as SkyEvent[])
      setLoading(false)
    })()
  }, [])

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

          {loading ? (
            <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>
          ) : events.length === 0 ? (
            <p className="text-white/20 text-center py-20">No upcoming events</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                const priceDisplay = event.price === 0 ? "Free (Members)" : `IDR ${Number(event.price).toLocaleString()}`
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-0 overflow-hidden group cursor-pointer">
                      <div className={`h-48 bg-gradient-to-br ${typeColors[event.type] || "from-gray-600/20 to-gray-600/20"} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                          <span className="text-xs text-white/80 bg-white/10 px-3 py-1 rounded-full w-fit">
                            {typeLabels[event.type] || event.type}
                          </span>
                          <div>
                            <h3 className="font-heading text-2xl font-bold text-white mb-1">{event.title}</h3>
                            <p className="text-white/60 text-sm">{priceDisplay}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            <Calendar className="w-4 h-4 text-skyhook-amber" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            <Clock className="w-4 h-4 text-skyhook-amber" />
                            {event.time.slice(0, 5)}
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            <MapPin className="w-4 h-4 text-skyhook-amber" />
                            {event.venue}
                          </div>
                        </div>
                        <p className="text-white/40 text-sm mb-5">{event.description}</p>
                        <Button variant="primary" size="sm" className="w-full" onClick={() => setTicketEvent(event)}>
                          <Ticket className="w-4 h-4 mr-2" />
                          {event.price === 0 ? "RSVP" : "Get Tickets"}
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {ticketEvent && <Suspense><TicketModal event={ticketEvent} onClose={() => setTicketEvent(null)} /></Suspense>}
    </div>
  )
}
