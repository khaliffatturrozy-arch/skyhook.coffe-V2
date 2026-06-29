import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const [completedOrders, activeOrders, users, recentOrders] = await Promise.all([
    supabase.from("orders").select("total").eq("status", "completed"),
    supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "confirmed", "preparing", "ready"]),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(5),
  ])
  const totalRevenue = completedOrders.data?.reduce((s, o) => s + Number(o.total), 0) || 0
  return NextResponse.json({
    stats: { totalRevenue, activeOrders: activeOrders.count || 0, totalCustomers: users.count || 0, avgOrderValue: completedOrders.data?.length ? Math.round(totalRevenue / completedOrders.data.length) : 0 },
    recentOrders: recentOrders.data || [],
  })
}
