"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const logoUrl = "https://brdsg.com/img/100/brsl50twbrtoukb1wa_1/C41QqkoZG0OFCglC41P1qNGZiZVRYRfm2Ydco2AcSZw.png"

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ full_name: "", email: "", password: "" })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    if (!loginForm.email || !loginForm.password) { setError("Please fill in all fields"); setLoading(false); return }
    const { data: loginData, error: err } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password })
    if (err) { setError(err.message); setLoading(false); return }
    if (loginData.user) {
      await supabase.from("users").upsert({
        id: loginData.user.id,
        email: loginData.user.email,
        full_name: loginData.user.user_metadata?.full_name || loginData.user.email?.split("@")[0] || "User",
      }, { onConflict: "id", ignoreDuplicates: false })
    }
    router.push("/dashboard")
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    if (!signupForm.full_name || !signupForm.email || !signupForm.password) { setError("Please fill in all fields"); setLoading(false); return }
    const { data, error: err } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      options: {
        data: { full_name: signupForm.full_name },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        email: signupForm.email,
        full_name: signupForm.full_name,
      })
    }
    setSuccess(true)
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true); setError("")
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } })
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#212121] mb-2">Check Your Email</h2>
          <p className="text-[rgba(33,33,33,0.6)] text-sm">We sent a confirmation link to <strong className="text-[#212121]">{signupForm.email}</strong></p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto section-padding py-6 md:py-12">
        <div className="text-center mb-8">
          <img src={logoUrl} alt="Skyhook Coffee" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#212121]">Welcome to Skyhook</h1>
          <p className="text-[rgba(33,33,33,0.5)] text-sm mt-1">Sign in to your account or create a new one</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button onClick={() => { setTab("login"); setError("") }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${tab === "login" ? "text-[#212121]" : "text-[rgba(33,33,33,0.4)] hover:text-[rgba(33,33,33,0.7)]"}`}
            >
              Sign In
              {tab === "login" && <motion.div layoutId="tab" className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#313131]" />}
            </button>
            <button onClick={() => { setTab("signup"); setError("") }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${tab === "signup" ? "text-[#212121]" : "text-[rgba(33,33,33,0.4)] hover:text-[rgba(33,33,33,0.7)]"}`}
            >
              Sign Up
              {tab === "signup" && <motion.div layoutId="tab" className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#313131]" />}
            </button>
          </div>

          <div className="grid md:grid-cols-2">
            {/* Left Panel - OAuth */}
            <div className="p-6 md:p-8 border-r-0 md:border-r border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-sm text-[#212121] mb-4">Quick access</h3>
              <div className="space-y-3">
                <button onClick={handleGoogle} disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-[#212121] transition-all hover:shadow-sm disabled:opacity-50"
                >
                  <svg viewBox="0 0 48 48" className="w-5 h-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/></svg>
                  Continue with Google
                </button>
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="px-3 bg-gray-50/50 text-xs text-[rgba(33,33,33,0.4)]">or</span></div>
              </div>
              <p className="text-xs text-[rgba(33,33,33,0.4)] leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* Right Panel - Email Form */}
            <div className="p-6 md:p-8">
              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <h3 className="font-semibold text-sm text-[#212121] mb-1">Sign in with email</h3>
                  <div>
                    <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Email</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 focus-within:border-gray-400 transition-colors">
                      <Mail className="w-4 h-4 text-[rgba(33,33,33,0.3)] shrink-0" />
                      <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="your@email.com" className="bg-transparent text-sm text-[#212121] outline-none flex-1 placeholder:text-[rgba(33,33,33,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Password</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 focus-within:border-gray-400 transition-colors">
                      <Lock className="w-4 h-4 text-[rgba(33,33,33,0.3)] shrink-0" />
                      <input type={showPassword ? "text" : "password"} value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••" className="bg-transparent text-sm text-[#212121] outline-none flex-1 placeholder:text-[rgba(33,33,33,0.3)]" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[rgba(33,33,33,0.3)] hover:text-[#212121]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-xs bg-red-50 p-2.5 rounded-lg">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#313131] hover:bg-black text-white rounded-full py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <h3 className="font-semibold text-sm text-[#212121] mb-1">Create an account</h3>
                  <div>
                    <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Full Name</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 focus-within:border-gray-400 transition-colors">
                      <User className="w-4 h-4 text-[rgba(33,33,33,0.3)] shrink-0" />
                      <input type="text" value={signupForm.full_name} onChange={(e) => setSignupForm({ ...signupForm, full_name: e.target.value })}
                        placeholder="Your name" className="bg-transparent text-sm text-[#212121] outline-none flex-1 placeholder:text-[rgba(33,33,33,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Email</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 focus-within:border-gray-400 transition-colors">
                      <Mail className="w-4 h-4 text-[rgba(33,33,33,0.3)] shrink-0" />
                      <input type="email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        placeholder="your@email.com" className="bg-transparent text-sm text-[#212121] outline-none flex-1 placeholder:text-[rgba(33,33,33,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Password</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50 focus-within:border-gray-400 transition-colors">
                      <Lock className="w-4 h-4 text-[rgba(33,33,33,0.3)] shrink-0" />
                      <input type={showPassword ? "text" : "password"} value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        placeholder="Min. 6 characters" className="bg-transparent text-sm text-[#212121] outline-none flex-1 placeholder:text-[rgba(33,33,33,0.3)]" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[rgba(33,33,33,0.3)] hover:text-[#212121]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-xs bg-red-50 p-2.5 rounded-lg">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#313131] hover:bg-black text-white rounded-full py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
