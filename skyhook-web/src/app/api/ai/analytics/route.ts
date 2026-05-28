import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIAnalytics } from "@/lib/ai"

export async function GET(req: NextRequest) {
  try {
    const scope = (req.nextUrl.searchParams.get("scope") as "outlet" | "global") || "global"
    const supabase = await createServerSupabase()
    const insights = await getAIAnalytics(supabase, scope)
    return NextResponse.json({ insights })
  } catch (error) {
    console.error("AI analytics error:", error)
    return NextResponse.json({ insights: "Analytics unavailable. Check OPENAI_API_KEY configuration." })
  }
}
