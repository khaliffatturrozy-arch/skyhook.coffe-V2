import { create } from "zustand"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

type CartStore = {
  items: CartItem[]
  open: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  setNotes: (id: string, notes: string) => void
  clearCart: () => void
  toggleCart: () => void
  setOpen: (v: boolean) => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  open: false,
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)
      return existing
        ? { items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)) }
        : { items: [...state.items, { ...item, quantity: 1 }] }
    }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, qty) =>
    set((state) => ({
      items: qty <= 0 ? state.items.filter((i) => i.id !== id) : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    })),
  setNotes: (id, notes) => set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, notes } : i)) })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ open: !state.open })),
  setOpen: (v) => set({ open: v }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}))
