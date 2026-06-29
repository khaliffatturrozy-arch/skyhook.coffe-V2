"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export function useRoleGuard(allowedRoles: string[], fallback = "/dashboard") {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) { router.push("/auth"); return }

      const { data: staff } = await supabase
        .from("staff")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle()

      const role = staff?.role || null
      setUserRole(role)

      if (role && allowedRoles.includes(role)) {
        setAuthorized(true)
        setChecking(false)
      } else {
        router.push(fallback)
      }
    })()
  }, [])

  return { checking, authorized, userRole }
}
