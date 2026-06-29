export type MembershipTier = "Skyhook Royalty" | "VIP Elite" | "Platinum" | "Gold" | "Silver" | "Member"

export interface User {
  id: string; email: string; full_name: string; avatar_url?: string; phone?: string
  membership_tier: MembershipTier; loyalty_points: number; total_orders: number; total_spent: number; created_at: string
}

export interface Order {
  id: string; user_id: string; table_id?: string; outlet_id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  subtotal: number; tax: number; service_charge: number; total: number
  payment_status: "unpaid" | "paid" | "refunded"; payment_method?: string; notes?: string; created_at: string; updated_at: string
}

export interface MenuItem {
  id: string; name: string; category_id: string; price: number; image_url?: string
  is_available: boolean; is_featured: boolean; preparation_time: number; description?: string
}

export interface Category { id: string; name: string; slug: string; sort_order: number }

export interface Staff {
  id: string; user_id: string; outlet_id: string; role: string; is_active: boolean; shift?: string
}

export interface Outlet { id: string; name: string; slug: string; address: string; city: string; is_active: boolean }

export interface Wallet { id: string; user_id: string; balance: number; cashback_balance: number; reward_points: number; promo_credits: number }

export interface Notification { id: string; user_id: string; title: string; body: string; type: string; is_read: boolean; created_at: string }
