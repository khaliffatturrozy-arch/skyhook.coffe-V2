import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIRecommendation } from "@/lib/ai"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ recommendation: "Please sign in for personalized recommendations." })
    }

    const supabase = await createServerSupabase()
    const recommendation = await getAIRecommendation(supabase, userId)
    return NextResponse.json({ recommendation })
  } catch (error) {
    console.error("AI recommend error:", error)
    return NextResponse.json({ recommendation: "Recommendations unavailable at this time." })
  }
}
