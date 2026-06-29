"use client"

import { createBrowserClient } from "@supabase/ssr"
import { SKYHOOK_CONFIG } from "@/config"

export function createClient() {
  return createBrowserClient(SKYHOOK_CONFIG.supabase.url, SKYHOOK_CONFIG.supabase.anonKey)
}
