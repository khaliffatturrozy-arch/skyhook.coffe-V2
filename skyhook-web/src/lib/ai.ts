import OpenAI from "openai"
import type { SupabaseClient } from "@supabase/supabase-js"

const AI_MODEL = "llama3-70b-8192"

let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    })
  }
  return _openai
}

export async function getAIRecommendation(supabase: SupabaseClient, userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*, orders(*), reservations(*)")
    .eq("id", userId)
    .single()

  if (!user) return null

  const completion = await getOpenAI().chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a luxury hospitality AI assistant for Skyhook Coffee. Provide personalized recommendations based on customer behavior.",
      },
      {
        role: "user",
        content: `Customer: ${user.full_name}, Orders: ${user.orders?.length || 0}. Recommend menu items, events, or promotions.`,
      },
    ],
    max_tokens: 250,
  })

  return completion.choices[0]?.message?.content
}

export async function getAIGreeting(supabase: SupabaseClient, userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("full_name, membership_tier, orders(*)")
    .eq("id", userId)
    .single()

  if (!user) return "Welcome to Skyhook Coffee"

  const completion = await getOpenAI().chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: "Generate a warm, personalized greeting for a Skyhook Coffee customer. Keep it under 2 sentences, luxurious tone.",
      },
      {
        role: "user",
        content: `Name: ${user.full_name}, Tier: ${user.membership_tier}`,
      },
    ],
    max_tokens: 100,
  })

  return completion.choices[0]?.message?.content || `Welcome back, ${user.full_name}`
}

export async function getAIAnalytics(supabase: SupabaseClient, scope: "outlet" | "global" = "global") {
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .limit(1000)

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .limit(1000)

  const completion = await getOpenAI().chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a business intelligence AI for Skyhook Coffee. Analyze the data and provide actionable insights, trends, and recommendations.",
      },
      {
        role: "user",
        content: `Orders: ${JSON.stringify(orders?.slice(0, 50))}. Users: ${JSON.stringify(users?.slice(0, 50))}. Provide business insights.`,
      },
    ],
    max_tokens: 500,
  })

  return completion.choices[0]?.message?.content
}

export async function getAIChatResponse(messages: { role: "system" | "user" | "assistant"; content: string }[]) {
  const completion = await getOpenAI().chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: `You are Skyhook AI, a luxury hospitality assistant for Skyhook Coffee — a premium rooftop coffee and lifestyle venue in Jakarta. 
You help customers with: menu recommendations, event info, reservations, membership benefits, and venue questions.
Be warm, concise, and luxurious in tone. Current time: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}.`,
      },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
    ],
    max_tokens: 300,
  })

  return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request."
}
