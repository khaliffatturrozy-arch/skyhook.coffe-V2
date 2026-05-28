export type MembershipTier = "Skyhook Royalty" | "VIP Elite" | "Platinum" | "Gold" | "Silver" | "Member"

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  membership_tier: MembershipTier
  loyalty_points: number
  total_orders: number
  total_spent: number
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  category_id: string
  category_name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  is_featured: boolean
  preparation_time: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  sort_order: number
}

export interface Order {
  id: string
  user_id: string
  table_id?: string
  outlet_id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  items: OrderItem[]
  subtotal: number
  tax: number
  service_charge: number
  total: number
  payment_status: "unpaid" | "paid" | "refunded"
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  menu_item_id: string
  menu_item_name: string
  quantity: number
  unit_price: number
  subtotal: number
  notes?: string
  status: "pending" | "preparing" | "ready" | "completed"
}

export interface Table {
  id: string
  outlet_id: string
  table_number: string
  capacity: number
  status: "available" | "occupied" | "reserved" | "maintenance"
  section: string
  qr_code: string
}

export interface Reservation {
  id: string
  user_id: string
  outlet_id: string
  table_id?: string
  date: string
  time: string
  guests: number
  status: "pending" | "confirmed" | "seated" | "completed" | "cancelled"
  notes?: string
  created_at: string
}

export interface EventType {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  image_url: string
  type: "live_music" | "dj_night" | "vip" | "community" | "seasonal"
  price?: number
  capacity: number
  tickets_sold: number
  is_featured: boolean
}

export interface Outlet {
  id: string
  name: string
  slug: string
  address: string
  city: string
  country: string
  phone: string
  opening_hours: string
  closing_hours: string
  is_active: boolean
  latitude: number
  longitude: number
  image_url: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  cashback_balance: number
  reward_points: number
  promo_credits: number
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  type: "topup" | "payment" | "cashback" | "reward" | "promo" | "refund"
  amount: number
  description: string
  reference_id?: string
  created_at: string
}

export interface LeaderboardEntry {
  user_id: string
  full_name: string
  avatar_url?: string
  membership_tier: MembershipTier
  total_points: number
  rank: number
  previous_rank?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "orders" | "events" | "loyalty" | "social" | "special"
  points_required?: number
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  achievement: Achievement
  unlocked_at: string
}

export interface Staff {
  id: string
  user_id: string
  outlet_id: string
  role: "manager" | "cashier" | "server" | "kitchen" | "bartender" | "host"
  is_active: boolean
  shift?: string
}

export interface InventoryItem {
  id: string
  outlet_id: string
  name: string
  category: string
  quantity: number
  unit: string
  min_stock: number
  max_stock: number
  supplier?: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: "order" | "promotion" | "event" | "loyalty" | "payment" | "system"
  is_read: boolean
  data?: Record<string, unknown>
  created_at: string
}

export interface AIRecommendation {
  type: "menu" | "event" | "promotion"
  title: string
  description: string
  confidence: number
  image_url?: string
  action_url?: string
}

export interface AIConversation {
  id: string
  user_id: string
  messages: AIMessage[]
  context?: Record<string, unknown>
  created_at: string
}

export interface AIMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface CartItem {
  id: string
  menu_item_id: string
  name: string
  price: number
  quantity: number
  notes?: string
}
