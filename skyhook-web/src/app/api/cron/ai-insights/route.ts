import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIAnalytics } from "@/lib/ai"

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const insights = await getAIAnalytics(supabase, "global")

    if (insights) {
      await supabase.from("analytics_events").insert({
        event_type: "ai_insights",
        data: { insights, generated_at: new Date().toISOString() },
      })
    }

    return NextResponse.json({ ok: true, insights_generated: !!insights })
  } catch (error) {
    console.error("AI insights cron error:", error)
    return NextResponse.json({ ok: false, error: "AI insights unavailable" }, { status: 500 })
  }
}
