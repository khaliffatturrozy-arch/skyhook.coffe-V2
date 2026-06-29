import Stripe from "stripe"

function isMidtransProduction(): boolean {
  return process.env.MIDTRANS_IS_PRODUCTION === "true"
}

const MIDTRANS_SNAP_URL = isMidtransProduction()
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions"

const MIDTRANS_CORE_URL = isMidtransProduction()
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2"

function maskKey(key: string): string {
  if (key.length <= 8) return "***"
  return key.substring(0, 8) + "..." + key.substring(key.length - 4)
}

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" })
}

function getMidtransAuth(): string | null {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) return null

  const isProd = isMidtransProduction()
  const expectedPrefix = isProd ? "Mid-server-" : "SB-Mid-server-"
  const actualPrefix = serverKey.substring(0, 11)

  if (actualPrefix !== expectedPrefix) {
    console.error(
      `[Midtrans] Key prefix mismatch: expected "${expectedPrefix}" for ${isProd ? "production" : "sandbox"} but got "${actualPrefix}". ` +
      `Check MIDTRANS_IS_PRODUCTION and MIDTRANS_SERVER_KEY.`
    )
  }

  return Buffer.from(`${serverKey}:`).toString("base64")
}

export async function createMidtransTransaction(params: {
  orderId: string
  grossAmount: number
  customerDetails: { firstName: string; email: string; phone?: string }
  items: { name: string; price: number; quantity: number }[]
}) {
  const auth = getMidtransAuth()
  if (!auth) {
    console.error("[Midtrans] createMidtransTransaction skipped: server key not configured")
    return { error: "Midtrans server key not configured" }
  }

  if (isMidtransProduction()) {
    console.log("[Midtrans] Creating transaction in PRODUCTION mode")
  } else {
    console.log("[Midtrans] Creating transaction in SANDBOX mode")
  }

  const body = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: params.customerDetails,
    item_details: params.items,
    credit_card: { secure: true },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_SITE_URL}/orders?status=finish`,
      error: `${process.env.NEXT_PUBLIC_SITE_URL}/orders?status=error`,
      pending: `${process.env.NEXT_PUBLIC_SITE_URL}/orders?status=pending`,
    },
  }

  const maskedKey = maskKey(process.env.MIDTRANS_SERVER_KEY || "")
  console.log(`[Midtrans] POST ${MIDTRANS_SNAP_URL} (key: ${maskedKey})`)

  const res = await fetch(MIDTRANS_SNAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[Midtrans] API error (${res.status}): ${err}`)
    return { error: `Midtrans error: ${err}` }
  }

  const data = await res.json()
  return { token: data.token, redirectUrl: data.redirect_url }
}

export async function getMidtransTransactionStatus(orderId: string) {
  const auth = getMidtransAuth()
  if (!auth) {
    console.error("[Midtrans] getMidtransTransactionStatus skipped: server key not configured")
    return { error: "Midtrans server key not configured" }
  }

  const maskedKey = maskKey(process.env.MIDTRANS_SERVER_KEY || "")
  console.log(`[Midtrans] GET ${MIDTRANS_CORE_URL}/${orderId}/status (key: ${maskedKey})`)

  const res = await fetch(`${MIDTRANS_CORE_URL}/${orderId}/status`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`[Midtrans] Status error (${res.status}): ${err}`)
    return { error: `Failed to get status: ${err}` }
  }

  return await res.json()
}

export async function createStripePaymentIntent(params: {
  amount: number
  currency: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripe()
  if (!stripe) {
    console.error("[Stripe] createPaymentIntent skipped: secret key not configured")
    return { error: "Stripe secret key not configured" }
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: { enabled: true },
    })
    return { clientSecret: intent.client_secret }
  } catch (e) {
    console.error("[Stripe] createPaymentIntent error:", (e as Error).message)
    return { error: `Stripe error: ${(e as Error).message}` }
  }
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
}

export async function createQRISTransaction(params: {
  orderId: string
  grossAmount: number
  customerName: string
}) {
  const auth = getMidtransAuth()
  if (!auth) {
    console.error("[QRIS] createQRISTransaction skipped: Midtrans server key not configured")
    return { error: "Midtrans server key not configured" }
  }

  const maskedKey = maskKey(process.env.MIDTRANS_SERVER_KEY || "")
  console.log(`[QRIS] POST ${MIDTRANS_CORE_URL}/charge (key: ${maskedKey})`)

  const body = {
    payment_type: "qris",
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: { first_name: params.customerName },
  }

  const res = await fetch(`${MIDTRANS_CORE_URL}/charge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[QRIS] API error (${res.status}): ${err}`)
    return { error: `QRIS error: ${err}` }
  }

  return await res.json()
}

export function verifyStripeWebhook(payload: Buffer, sig: string): Stripe.Event | null {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return null

  try {
    return stripe.webhooks.constructEvent(payload, sig, secret)
  } catch (e) {
    console.error("[Stripe] Webhook verification failed:", (e as Error).message)
    return null
  }
}
