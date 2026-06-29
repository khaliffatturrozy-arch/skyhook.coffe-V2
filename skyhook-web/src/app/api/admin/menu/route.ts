import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from("menu").select("*, categories(*)").order("sort_order")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const body = await req.json()
    const slug = (body.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "item") + "-" + Date.now()
    const { data, error } = await supabase.from("menu").insert({
      name: body.name, description: body.description, price: Number(body.price),
      category_id: body.category_id, image_url: body.image_url || null,
      is_available: body.is_available ?? true, is_featured: body.is_featured ?? false,
      slug,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const body = await req.json()
    if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const { data, error } = await supabase.from("menu").update({
      name: body.name, description: body.description, price: Number(body.price),
      category_id: body.category_id, image_url: body.image_url || null,
      is_available: body.is_available ?? true, is_featured: body.is_featured ?? false,
    }).eq("id", body.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("menu").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
