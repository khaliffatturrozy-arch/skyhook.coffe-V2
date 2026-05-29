import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from("staff").select("*, users(email), outlets(name)").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const b = await req.json()
    const { data, error } = await supabase.from("staff").insert({
      user_id: b.user_id || null, outlet_id: b.outlet_id || null,
      role: b.role || "barista", is_active: b.is_active ?? true,
      hourly_rate: Number(b.hourly_rate || 0), joined_at: b.joined_at || new Date().toISOString(),
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const b = await req.json()
    if (!b.id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const { data, error } = await supabase.from("staff").update({
      user_id: b.user_id || null, outlet_id: b.outlet_id || null,
      role: b.role || "barista", is_active: b.is_active ?? true,
      hourly_rate: Number(b.hourly_rate || 0), joined_at: b.joined_at || new Date().toISOString(),
    }).eq("id", b.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("staff").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
