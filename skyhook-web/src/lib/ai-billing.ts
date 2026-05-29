import type { SupabaseClient } from "@supabase/supabase-js"
import type { AIQueryType } from "./ai-costs"
import { AI_COSTS } from "./ai-costs"

export class AIBillingError extends Error {
  constructor(
    message: string,
    public code: "INSUFFICIENT_BALANCE" | "WALLET_NOT_FOUND" | "USER_NOT_FOUND",
  ) {
    super(message)
    this.name = "AIBillingError"
  }
}

interface DeductResult {
  success: true
  balanceBefore: number
  balanceAfter: number
  walletId: string
}

export async function deductAICost(
  supabase: SupabaseClient,
  userId: string,
  queryType: AIQueryType,
): Promise<DeductResult> {
  const cost = AI_COSTS[queryType]

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .select("id, balance")
    .eq("user_id", userId)
    .single()

  if (walletError || !wallet) {
    throw new AIBillingError("Wallet not found", "WALLET_NOT_FOUND")
  }

  const balanceBefore = Number(wallet.balance)

  if (balanceBefore < cost) {
    throw new AIBillingError(
      `Insufficient balance. Required: Rp ${cost.toLocaleString("id-ID")}, Available: Rp ${balanceBefore.toLocaleString("id-ID")}`,
      "INSUFFICIENT_BALANCE",
    )
  }

  const balanceAfter = balanceBefore - cost

  const { error: deductError } = await supabase
    .from("wallets")
    .update({ balance: balanceAfter })
    .eq("id", wallet.id)

  if (deductError) {
    throw new Error(`Failed to deduct: ${deductError.message}`)
  }

  await supabase.from("wallet_transactions").insert({
    wallet_id: wallet.id,
    type: "ai_usage",
    amount: cost,
    description: `AI ${queryType} query`,
  })

  await supabase.from("ai_usage_log").insert({
    user_id: userId,
    wallet_id: wallet.id,
    query_type: queryType,
    cost,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    status: "success",
  })

  return { success: true, balanceBefore, balanceAfter, walletId: wallet.id }
}

export async function getAIBalance(supabase: SupabaseClient, userId: string) {
  const { data: wallet, error } = await supabase
    .from("wallets")
    .select("id, balance")
    .eq("user_id", userId)
    .single()

  if (error || !wallet) return null

  return {
    balance: Number(wallet.balance),
    walletId: wallet.id,
  }
}
