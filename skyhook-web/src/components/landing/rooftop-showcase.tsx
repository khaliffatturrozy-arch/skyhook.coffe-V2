"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ROUTES } from "@/config"
import { ArrowRight, Map, Star } from "lucide-react"

export function RooftopShowcase() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-skyhook-black via-skyhook-charcoal to-skyhook-mocha/50" />

      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-skyhook-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-skyhook-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-padding max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Map className="w-4 h-4 text-skyhook-amber" />
              <span className="text-xs text-white/60 tracking-widest uppercase">Virtual Tour</span>
            </div>

            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              The <span className="text-gradient-gold">Rooftop</span>
              <br />
              <span className="text-white">Experience</span>
            </h2>

            <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-lg">
              Explore our interactive 3D rooftop map. Choose your perfect table, 
              check live availability, and book your spot under the stars.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Interactive 3D rooftop map",
                "Real-time table availability",
                "Smart QR ordering at your table",
                "360° panoramic views",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-skyhook-amber/10 flex items-center justify-center">
                    <Star className="w-3 h-3 text-skyhook-amber" />
                  </div>
                  <span className="text-white/60 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ROUTES.rooftop}>
                <Button variant="primary" size="lg" className="group">
                  Explore the Rooftop
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={ROUTES.reservations}>
                <Button variant="secondary" size="lg">
                  Book a Table
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl glass overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-skyhook-amber/30 flex items-center justify-center animate-pulse-glow">
                    <Map className="w-12 h-12 text-skyhook-amber" />
                  </div>
                  <p className="text-white/40 text-sm">Interactive 3D Map</p>
                  <p className="text-skyhook-amber text-xs mt-1">Coming Soon</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-skyhook-black/80 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
