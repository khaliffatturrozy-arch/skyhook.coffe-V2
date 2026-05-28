import { create } from "zustand"
import type { User, Order, Notification, CartItem } from "@/types"

interface AppState {
  user: User | null
  cart: CartItem[]
  notifications: Notification[]
  isAIOpen: boolean
  setUser: (user: User | null) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  toggleAI: () => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  cart: [],
  notifications: [],
  isAIOpen: false,
  setUser: (user) => set({ user }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  clearCart: () => set({ cart: [] }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
    })),
  toggleAI: () => set((state) => ({ isAIOpen: !state.isAIOpen })),
}))
