import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { getAIBalance } from "@/lib/ai-billing"
import { AI_COSTS } from "@/lib/ai-costs"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const balance = await getAIBalance(supabase, userId)

    if (!balance) {
      return NextResponse.json({ balance: 0, costPerQuery: AI_COSTS.CHAT, canAfford: false })
    }

    return NextResponse.json({
      balance: balance.balance,
      costPerQuery: AI_COSTS.CHAT,
      canAfford: balance.balance >= AI_COSTS.CHAT,
    })
  } catch (error) {
    console.error("AI balance error:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
