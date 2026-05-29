import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIGreeting } from "@/lib/ai"
import { deductAICost, AIBillingError, getAIBalance } from "@/lib/ai-billing"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ greeting: "Welcome to Skyhook Coffee" })
    }

    const supabase = await createServerSupabase()
    const deduction = await deductAICost(supabase, userId, "GREETING")
    const greeting = await getAIGreeting(supabase, userId)

    return NextResponse.json({
      greeting,
      cost: 1000,
      balanceAfter: deduction.balanceAfter,
    })
  } catch (error) {
    if (error instanceof AIBillingError) {
      if (error.code === "INSUFFICIENT_BALANCE") {
        return NextResponse.json({ greeting: "Welcome to Skyhook Coffee", balanceError: error.message }, { status: 402 })
      }
      return NextResponse.json({ greeting: "Welcome to Skyhook Coffee" })
    }
    console.error("AI greeting error:", error)
    return NextResponse.json({ greeting: "Welcome to Skyhook Coffee" })
  }
}
