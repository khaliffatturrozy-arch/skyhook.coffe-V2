"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MapPin, ChevronRight } from "lucide-react"

const availableSlots = [
  { date: "Today", slots: ["17:00", "18:30", "20:00", "21:30"] },
  { date: "Tomorrow", slots: ["17:00", "18:30", "20:00", "21:30", "23:00"] },
  { date: "Fri, May 29", slots: ["18:30", "20:00", "21:30", "23:00"] },
]

export default function ReservationsPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              Book a <span className="text-gradient-gold">Table</span>
            </h1>
            <p className="text-white/40 text-lg">Reserve your rooftop experience in advance.</p>
          </div>

          <GlassCard className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                    <label className="text-white/40 text-xs block mb-2">Date</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <Calendar className="w-4 h-4 text-skyhook-amber" />
                    <input type="date" className="bg-transparent text-white text-sm outline-none flex-1 [color-scheme:dark]" />
                  </div>
                </div>
              <div>
                    <label className="text-white/40 text-xs block mb-2">Time</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <Clock className="w-4 h-4 text-skyhook-amber" />
                    <select className="bg-transparent text-white text-sm outline-none flex-1">
                      <option>18:00</option>
                      <option>19:00</option>
                      <option>20:00</option>
                      <option>21:00</option>
                    </select>
                  </div>
                </div>
              <div>
                    <label className="text-white/40 text-xs block mb-2">Guests</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <Users className="w-4 h-4 text-skyhook-amber" />
                    <select className="bg-transparent text-white text-sm outline-none flex-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            <Button variant="primary" size="lg" className="w-full">
              Check Availability
            </Button>
          </GlassCard>

          <h2 className="font-heading text-2xl font-bold mb-6">Available Slots</h2>
          <div className="space-y-4">
            {availableSlots.map((day) => (
              <GlassCard key={day.date}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold">{day.date}</h3>
                  <MapPin className="w-4 h-4 text-skyhook-amber" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <button
                      key={slot}
                      className="px-4 py-2 rounded-xl glass glass-hover text-white text-sm hover:border-skyhook-amber/30 transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
