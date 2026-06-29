"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function AuthRedirectHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    if (code && pathname === "/") {
      const params = new URLSearchParams(window.location.search)
      window.location.replace(`/auth/callback?${params.toString()}`)
    }
  }, [pathname, searchParams])

  return null
}
