import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase()
  const search = req.nextUrl.searchParams.get("search")
  let query = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(50)
  if (search) query = query.or(`id.ilike.%${search}%,notes.ilike.%${search}%`)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data || [] })
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 })
    const { data, error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}
