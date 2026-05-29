"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Map, Star, Users, QrCode, Sun, Loader2 } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/config"
import { useCartStore } from "@/store/cart"

export default function RooftopPage() {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/rooftop")
        const d = await res.json()
        setSections(Array.isArray(d) ? d : [])
      } catch {} finally { setLoading(false) }
    })()
  }, [])

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Map className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Interactive Experience</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              The <span className="text-gradient-gold">Rooftop</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Explore our virtual rooftop map, choose your table, and book your experience.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <GlassCard className="aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-skyhook-amber/30 mx-auto mb-4" />
                  <p className="text-white/40 text-lg font-heading">3D Rooftop Map</p>
                  <p className="text-white/20 text-sm">Interactive experience coming soon</p>
                </div>
              </GlassCard>
            </div>
            <div className="space-y-4">
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-5 h-5 text-skyhook-amber" />
                  <h3 className="font-heading text-lg font-semibold">Current Conditions</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Weather</span><span className="text-white">Clear Sky · 26°C</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Crowd Level</span><span className="text-skyhook-amber">Moderate</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Available Tables</span><span className="text-emerald-400">{sections.reduce((s: number, sec: any) => s + (sec.status !== "full" ? sec.tables : 0), 0)} / {sections.reduce((s: number, sec: any) => s + sec.tables, 0)}</span></div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="flex items-center gap-3 mb-4"><QrCode className="w-5 h-5 text-skyhook-amber" /><h3 className="font-heading text-lg font-semibold">Smart QR Ordering</h3></div>
                <p className="text-white/40 text-sm">Scan the QR code at your table to order directly from your phone.</p>
              </GlassCard>
            </div>
          </div>

          <h2 className="font-heading text-3xl font-bold mb-8">Rooftop <span className="text-gradient-gold">Sections</span></h2>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sections.map((section: any, index: number) => (
                <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <GlassCard>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-white">{section.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 text-white/30" />
                          <span className="text-white/30 text-xs">Capacity: {section.capacity}</span>
                          {section.vip && <span className="text-skyhook-gold text-[10px] px-2 py-0.5 rounded-full bg-skyhook-gold/10">VIP</span>}
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${section.status === "available" ? "bg-emerald-500/10 text-emerald-400" : section.status === "limited" ? "bg-skyhook-amber/10 text-skyhook-amber" : "bg-red-500/10 text-red-400"}`}>
                        {section.status === "available" ? "Available" : section.status === "limited" ? "Limited" : "Full"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: section.tables }).map((_: any, i: number) => (
                        <div key={i} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                          <span className="text-[8px] text-white/30">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant={section.status === "full" ? "ghost" : "primary"} size="sm" className="w-full" disabled={section.status === "full"}>
                      <Star className="w-4 h-4 mr-2" />
                      {section.status === "full" ? "Fully Booked" : "Book a Table"}
                    </Button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
