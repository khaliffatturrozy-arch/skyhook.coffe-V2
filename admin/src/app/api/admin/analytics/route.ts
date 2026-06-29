import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const [orders] = await Promise.all([supabase.from("orders").select("total")])
  const totalRevenue = orders.data?.reduce((s, o) => s + Number(o.total), 0) || 0
  return NextResponse.json({ totalRevenue, totalOrders: orders.data?.length || 0, avgOrderValue: orders.data?.length ? Math.round(totalRevenue / orders.data.length) : 0 })
}
