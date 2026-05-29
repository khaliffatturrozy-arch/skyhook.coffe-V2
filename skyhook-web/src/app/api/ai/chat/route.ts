import { NextRequest, NextResponse } from "next/server"
import { getAIChatResponse } from "@/lib/ai"
import { createServerSupabase } from "@/lib/supabase-server"
import { deductAICost, AIBillingError } from "@/lib/ai-billing"

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "userId is required for billing" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const deduction = await deductAICost(supabase, userId, "CHAT")

    const reply = await getAIChatResponse(messages)

    return NextResponse.json({
      reply,
      cost: 2000,
      balanceBefore: deduction.balanceBefore,
      balanceAfter: deduction.balanceAfter,
    })
  } catch (error) {
    if (error instanceof AIBillingError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.code === "INSUFFICIENT_BALANCE" ? 402 : 404 },
      )
    }
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: "AI service unavailable. Please check your OPENAI_API_KEY." },
      { status: 500 },
    )
  }
}
