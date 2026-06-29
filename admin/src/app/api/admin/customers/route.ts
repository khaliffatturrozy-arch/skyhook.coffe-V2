import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false }).limit(100)
  return NextResponse.json(data || [])
}
