import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from("waiter_calls").select("*, tables(table_number)").order("created_at", { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { id, status } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const { data, error } = await supabase.from("waiter_calls").update({ status, resolved_at: status === "resolved" ? new Date().toISOString() : null }).eq("id", id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}
