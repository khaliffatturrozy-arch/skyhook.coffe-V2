import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const [completedOrders, activeOrders, users, recentOrders] = await Promise.all([
      supabase.from("orders").select("total").eq("status", "completed"),
      supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "confirmed", "preparing", "ready"]),
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(5),
    ])

    const totalRevenue = completedOrders.data?.reduce((sum, o) => sum + Number(o.total), 0) || 0
    const orderCount = activeOrders.count || 0
    const customerCount = users.count || 0
    const avgOrderValue = completedOrders.data?.length ? totalRevenue / completedOrders.data.length : 0

    return NextResponse.json({
      stats: {
        totalRevenue,
        activeOrders: orderCount,
        totalCustomers: customerCount,
        avgOrderValue: Math.round(avgOrderValue),
      },
      recentOrders: recentOrders.data || [],
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}
