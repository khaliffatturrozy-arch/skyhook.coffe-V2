import Stripe from "stripe"

const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions"
const MIDTRANS_CORE_URL = "https://api.sandbox.midtrans.com/v2"

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" })
}

function getMidtransAuth(): string | null {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) return null
  return Buffer.from(`${serverKey}:`).toString("base64")
}

// ─── Midtrans ─────────────────────────────────────────────

export async function createMidtransTransaction(params: {
  orderId: string
  grossAmount: number
  customerDetails: { firstName: string; email: string; phone?: string }
  items: { name: string; price: number; quantity: number }[]
}) {
  const auth = getMidtransAuth()
  if (!auth) {
    return { error: "Midtrans server key not configured" }
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
    return { error: `Midtrans error: ${err}` }
  }

  const data = await res.json()
  return { token: data.token, redirectUrl: data.redirect_url }
}

export async function getMidtransTransactionStatus(orderId: string) {
  const auth = getMidtransAuth()
  if (!auth) return { error: "Midtrans server key not configured" }

  const res = await fetch(`${MIDTRANS_CORE_URL}/${orderId}/status`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!res.ok) return { error: "Failed to get status" }

  return await res.json()
}

// ─── Stripe ────────────────────────────────────────────────

export async function createStripePaymentIntent(params: {
  amount: number // in cents
  currency: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripe()
  if (!stripe) {
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
    return { error: `Stripe error: ${(e as Error).message}` }
  }
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
}

// ─── QRIS (via Midtrans) ───────────────────────────────────

export async function createQRISTransaction(params: {
  orderId: string
  grossAmount: number
  customerName: string
}) {
  const auth = getMidtransAuth()
  if (!auth) return { error: "Midtrans server key not configured" }

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
    return { error: `QRIS error: ${err}` }
  }

  return await res.json()
}

// ─── Verify Webhook Signature ──────────────────────────────

export function verifyStripeWebhook(payload: Buffer, sig: string): Stripe.Event | null {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return null

  try {
    return stripe.webhooks.constructEvent(payload, sig, secret)
  } catch {
    return null
  }
}
