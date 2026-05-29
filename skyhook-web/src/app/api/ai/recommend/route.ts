import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIRecommendation } from "@/lib/ai"
import { deductAICost, AIBillingError } from "@/lib/ai-billing"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ recommendation: "Please sign in for personalized recommendations." })
    }

    const supabase = await createServerSupabase()
    const deduction = await deductAICost(supabase, userId, "RECOMMEND")
    const recommendation = await getAIRecommendation(supabase, userId)

    return NextResponse.json({
      recommendation,
      cost: 2000,
      balanceAfter: deduction.balanceAfter,
    })
  } catch (error) {
    if (error instanceof AIBillingError) {
      if (error.code === "INSUFFICIENT_BALANCE") {
        return NextResponse.json({ recommendation: "Top up your wallet to get AI recommendations.", balanceError: error.message }, { status: 402 })
      }
      return NextResponse.json({ recommendation: "Recommendations unavailable at this time." })
    }
    console.error("AI recommend error:", error)
    return NextResponse.json({ recommendation: "Recommendations unavailable at this time." })
  }
}
