import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from("waiter_calls").select("*").order("created_at", { ascending: false })
  return NextResponse.json(data || [])
}
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json(); const supabase = await createServerSupabase()
  const field = status === "resolved" ? "resolved_at" : "acknowledged_at"
  const { error } = await supabase.from("waiter_calls").update({ status, [field]: new Date().toISOString() }).eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
