"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, Apple, Globe } from "lucide-react"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-skyhook-black via-skyhook-charcoal to-skyhook-mocha/30" />
      
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-skyhook-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-skyhook-orange/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-skyhook-amber to-skyhook-orange flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">
              Welcome to <span className="text-gradient-gold">Skyhook</span>
            </h1>
            <p className="text-white/40 text-sm">Sign in to your premium experience</p>
          </div>

          <div className="space-y-3">
            <Button variant="secondary" size="lg" className="w-full justify-start">
              <Globe className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
            <Button variant="secondary" size="lg" className="w-full justify-start">
              <Apple className="w-5 h-5 mr-3" />
              Continue with Apple
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-skyhook-charcoal text-white/30 text-xs">or continue with email</span>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50 transition-colors"
              />
              <Button variant="primary" size="lg" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Sign In with Email
              </Button>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
