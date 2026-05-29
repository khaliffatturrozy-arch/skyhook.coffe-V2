import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from("cms_sections").select("*").order("section")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const b = await req.json()
    if (!b.id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const { data, error } = await supabase.from("cms_sections").update({
      title: b.title, content: b.content, image_url: b.image_url || null, is_published: b.is_published ?? true,
    }).eq("id", b.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}
