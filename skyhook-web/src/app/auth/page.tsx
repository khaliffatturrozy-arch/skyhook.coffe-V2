"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, Apple, Globe, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleEmailAuth() {
    setLoading(true); setError("")
    if (!email || !password) { setError("Please fill in all fields"); setLoading(false); return }
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        router.push("/profile")
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } })
        if (err) throw err
        setSuccess(true)
      }
    } catch (e: any) {
      setError(e.message || "Authentication failed")
    }
    setLoading(false)
  }

  async function handleOAuth(provider: "google" | "apple") {
    setLoading(true); setError("")
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } })
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-skyhook-black via-skyhook-charcoal to-skyhook-mocha/30" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <GlassCard className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-skyhook-amber mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-white/40">We sent a confirmation link to <strong className="text-white/60">{email}</strong></p>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-skyhook-black via-skyhook-charcoal to-skyhook-mocha/30" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-skyhook-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-skyhook-orange/5 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md mx-4">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-skyhook-amber to-skyhook-orange flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">
              Welcome to <span className="text-gradient-gold">Skyhook</span>
            </h1>
            <p className="text-white/40 text-sm">{mode === "signin" ? "Sign in to your premium experience" : "Create your Skyhook account"}</p>
          </div>

          {error && <p className="text-red-400 text-xs text-center mb-4 bg-red-500/10 rounded-lg p-3">{error}</p>}

          <div className="space-y-3">
            <Button variant="secondary" size="lg" className="w-full justify-start" onClick={() => handleOAuth("google")} disabled={loading}>
              <Globe className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
            <Button variant="secondary" size="lg" className="w-full justify-start" onClick={() => handleOAuth("apple")} disabled={loading}>
              <Apple className="w-5 h-5 mr-3" />
              Continue with Apple
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-skyhook-charcoal text-white/30 text-xs">or continue with email</span>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50 transition-colors"
              />
              <input
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50 transition-colors"
              />
              <Button variant="primary" size="lg" className="w-full" onClick={handleEmailAuth} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </div>
          </div>

          <p className="text-center mt-6">
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError("") }} className="text-xs text-skyhook-amber hover:text-skyhook-gold transition-colors">
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </p>

          <p className="text-center text-white/30 text-xs mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
