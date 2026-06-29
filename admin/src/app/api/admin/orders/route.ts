import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") || ""
  const supabase = await createServerSupabase()
  let query = supabase.from("orders").select("*, user:users(full_name)").order("created_at", { ascending: false }).limit(50)
  if (search) query = query.or(`id.ilike.%${search}%,user_id.ilike.%${search}%`)
  const { data } = await query
  return NextResponse.json(data || [])
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
