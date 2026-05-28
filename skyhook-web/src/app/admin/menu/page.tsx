"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit2, ToggleLeft, Trash2 } from "lucide-react"

const menuItems = [
  { name: "Skyhook Signature", category: "Coffee", price: 68000, available: true, popular: true },
  { name: "Rooftop Matcha", category: "Specialty", price: 75000, available: true, popular: true },
  { name: "Gold Cappuccino", category: "Coffee", price: 78000, available: true, popular: true },
  { name: "Butter Croissant", category: "Pastry", price: 45000, available: true, popular: false },
  { name: "Midnight Affogato", category: "Dessert", price: 85000, available: false, popular: true },
  { name: "Truffle Fries", category: "Pastry", price: 55000, available: true, popular: true },
]

export default function AdminMenuPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Menu Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage your menu items and categories</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              placeholder="Search menu..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50"
            />
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/60 outline-none">
            <option>All Categories</option>
            <option>Coffee</option>
            <option>Specialty</option>
            <option>Pastry</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Item</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Popular</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {menuItems.map((item) => (
              <tr key={item.name} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{item.name}</td>
                <td className="p-4 text-white/60">{item.category}</td>
                <td className="p-4 text-white">IDR {item.price.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.available ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-4">
                  {item.popular && <span className="text-skyhook-amber text-xs">Popular</span>}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                      <ToggleLeft className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
