import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false })
  return NextResponse.json(data || [])
}
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json(); const supabase = await createServerSupabase()
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
