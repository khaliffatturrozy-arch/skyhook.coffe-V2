import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { SKYHOOK_CONFIG } from "@/config"

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(SKYHOOK_CONFIG.supabase.url, SKYHOOK_CONFIG.supabase.anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })
}
