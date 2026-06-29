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
    const body = await req.json()
    const { id, status, payment_status, payment_method } = body
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (status) updates.status = status
    if (payment_status) updates.payment_status = payment_status
    if (payment_method) updates.payment_method = payment_method
    const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}
