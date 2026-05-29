import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, payment_status, payment_method, total, created_at, user:user_id (full_name)")
      .not("payment_status", "eq", "unpaid")
      .order("created_at", { ascending: false })
      .limit(100)
    if (error) throw error

    const methodCount: Record<string, { count: number; total: number }> = {}
    for (const o of orders || []) {
      const m = o.payment_method || "unknown"
      if (!methodCount[m]) methodCount[m] = { count: 0, total: 0 }
      methodCount[m].count++
      methodCount[m].total += Number(o.total || 0)
    }
    const paymentMethods = Object.entries(methodCount).map(([method, data]) => ({ method, ...data }))

    return NextResponse.json({ transactions: orders || [], paymentMethods })
  } catch (error) {
    console.error("Admin payments error:", error)
    return NextResponse.json({ error: "Failed to load payment data" }, { status: 500 })
  }
}
