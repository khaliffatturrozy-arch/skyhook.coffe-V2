import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIGreeting } from "@/lib/ai"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ greeting: "Welcome to Skyhook Coffee" })
    }

    const supabase = await createServerSupabase()
    const greeting = await getAIGreeting(supabase, userId)
    return NextResponse.json({ greeting })
  } catch (error) {
    console.error("AI greeting error:", error)
    return NextResponse.json({ greeting: "Welcome to Skyhook Coffee" })
  }
}
