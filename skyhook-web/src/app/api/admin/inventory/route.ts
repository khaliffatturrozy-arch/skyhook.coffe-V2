import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from("inventory").select("*, outlets(name)").order("name")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const b = await req.json()
    const { data, error } = await supabase.from("inventory").insert({
      name: b.name, category: b.category, quantity: Number(b.quantity || 0),
      unit: b.unit || "pcs", min_stock: Number(b.min_stock || 0), outlet_id: b.outlet_id || null,
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
    const { data, error } = await supabase.from("inventory").update({
      name: b.name, category: b.category, quantity: Number(b.quantity || 0),
      unit: b.unit || "pcs", min_stock: Number(b.min_stock || 0), outlet_id: b.outlet_id || null,
    }).eq("id", b.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("inventory").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
