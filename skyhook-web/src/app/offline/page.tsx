"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Coffee, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/config"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-skyhook-black via-skyhook-charcoal to-skyhook-mocha/30" />
      
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-skyhook-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-skyhook-orange/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <GlassCard className="text-center p-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-skyhook-amber/10 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-skyhook-amber" />
          </div>

          <h1 className="font-heading text-4xl font-bold mb-3">
            You're <span className="text-gradient-gold">Offline</span>
          </h1>
          
          <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
            Don't worry — your Skyhook experience will resume once you're connected. 
            Here's what you can still do:
          </p>

          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Coffee className="w-4 h-4 text-skyhook-amber shrink-0" />
              <span className="text-white/60 text-sm">Browse our menu (cached)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <MapPin className="w-4 h-4 text-skyhook-amber shrink-0" />
              <span className="text-white/60 text-sm">View outlet locations</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Phone className="w-4 h-4 text-skyhook-amber shrink-0" />
              <span className="text-white/60 text-sm">Call us direct</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Reconnecting
            </Button>
            <Link href={ROUTES.menu}>
              <Button variant="secondary" size="lg" className="w-full">
                <Coffee className="w-4 h-4 mr-2" />
                Browse Menu
              </Button>
            </Link>
          </div>

          <p className="text-white/20 text-xs mt-6">
            Skyhook Coffee — Always connected to the experience
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
