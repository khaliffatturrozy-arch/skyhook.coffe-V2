"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { MapPin, Globe } from "lucide-react"

const locations = [
  { city: "Jakarta", country: "Indonesia", outlets: 3, status: "Open" },
  { city: "Bali", country: "Indonesia", outlets: 2, status: "Open" },
  { city: "Bandung", country: "Indonesia", outlets: 1, status: "Open" },
  { city: "Surabaya", country: "Indonesia", outlets: 1, status: "Coming Soon" },
  { city: "Singapore", country: "Singapore", outlets: 0, status: "Coming Soon" },
  { city: "Yogyakarta", country: "Indonesia", outlets: 1, status: "Open" },
]

export function LocationsSection() {
  return (
    <section className="relative py-32 section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black to-skyhook-charcoal/50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Globe className="w-4 h-4 text-skyhook-amber" />
            <span className="text-xs text-white/60 tracking-widest uppercase">Global Network</span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            Find Us <span className="text-gradient-gold">Worldwide</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Expanding across cities and countries. Each location offers a unique rooftop experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {locations.map((location, index) => (
            <motion.div
              key={location.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center">
                <MapPin className="w-6 h-6 text-skyhook-amber mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-white mb-1">{location.city}</h3>
                <p className="text-white/30 text-xs mb-3">{location.country}</p>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  location.status === "Open"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-skyhook-amber/10 text-skyhook-amber"
                }`}>
                  {location.status}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
