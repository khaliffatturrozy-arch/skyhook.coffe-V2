import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createServerSupabase()
    const { error } = await supabase.rpc("refresh_leaderboard")

    if (error) {
      console.error("Leaderboard refresh failed:", error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, refreshed: new Date().toISOString() })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 })
  }
}
