import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from("orders").select("id, payment_status, payment_method, total, created_at, user:users(full_name)").not("payment_status", "eq", "unpaid").order("created_at", { ascending: false }).limit(100)
  return NextResponse.json({ transactions: data || [] })
}
