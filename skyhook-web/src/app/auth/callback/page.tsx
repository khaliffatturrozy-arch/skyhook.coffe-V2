"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.push("/profile")
    })
  }, [router])

  return <div className="min-h-screen flex items-center justify-center text-white/40">Completing sign in...</div>
}
