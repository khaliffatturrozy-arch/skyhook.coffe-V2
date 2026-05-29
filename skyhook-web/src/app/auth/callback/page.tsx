"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single()

        if (!existing) {
          await supabase.from("users").upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
            avatar_url: user.user_metadata?.avatar_url,
          })
        }
        router.push("/dashboard")
      }
    })
  }, [router])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#313131] mx-auto mb-3" />
        <p className="text-sm text-[rgba(33,33,33,0.5)]">Completing sign in...</p>
      </div>
    </main>
  )
}
