"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-32 section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-skyhook-charcoal via-skyhook-mocha/30 to-skyhook-black" />

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-skyhook-amber/5 to-skyhook-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-skyhook-amber" />
            <span className="text-xs text-white/60 tracking-widest uppercase">Join the Experience</span>
          </div>

          <h2 className="font-heading text-4xl md:text-7xl font-bold mb-6 leading-tight">
            Ready to Experience
            <br />
            <span className="text-gradient-gold">Skyhook?</span>
          </h2>

          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Download the app, sign up for membership, and start your journey 
            to the top of the Skyhook leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ROUTES.auth}>
              <Button variant="gold" size="xl" className="group">
                Join Skyhook Royalty
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={ROUTES.menu}>
              <Button variant="secondary" size="xl">
                Explore the Menu
              </Button>
            </Link>
          </div>

          <p className="text-white/20 text-xs mt-8">
            Join 10,000+ premium members across Indonesia
          </p>
        </motion.div>
      </div>
    </section>
  )
}
