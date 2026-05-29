import { NextRequest, NextResponse } from "next/server"
import { getMidtransTransactionStatus } from "@/lib/payments"

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId")
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 })
  }

  const result = await getMidtransTransactionStatus(orderId)
  return NextResponse.json(result)
}
