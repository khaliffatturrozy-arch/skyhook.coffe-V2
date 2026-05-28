import { NextRequest, NextResponse } from "next/server"
import { getAIChatResponse } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const reply = await getAIChatResponse(messages)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: "AI service unavailable. Please check your OPENAI_API_KEY." },
      { status: 500 }
    )
  }
}
