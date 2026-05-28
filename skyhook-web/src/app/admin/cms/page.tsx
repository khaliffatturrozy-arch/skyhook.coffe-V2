"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Settings, Image, FileText, Megaphone, Layout, Save } from "lucide-react"

const cmsSections = [
  { name: "Homepage Hero", type: "banner", status: "published", updated: "2 hours ago" },
  { name: "Featured Menu Items", type: "menu", status: "published", updated: "1 day ago" },
  { name: "Upcoming Events", type: "events", status: "published", updated: "3 hours ago" },
  { name: "Promotional Banner", type: "promo", status: "draft", updated: "Never" },
  { name: "Rooftop Gallery", type: "gallery", status: "published", updated: "5 days ago" },
  { name: "Membership Campaign", type: "campaign", status: "draft", updated: "2 days ago" },
]

export default function AdminCMSPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Content Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage website content — updates are instant</p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" /> Publish All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-5 h-5 text-skyhook-amber" />
            <h2 className="font-heading text-lg font-semibold">Sections</h2>
          </div>
          <p className="text-3xl font-bold text-white mb-1">6</p>
          <p className="text-white/30 text-xs">4 published · 2 drafts</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-5 h-5 text-blue-400" />
            <h2 className="font-heading text-lg font-semibold">Media</h2>
          </div>
          <p className="text-3xl font-bold text-white mb-1">24</p>
          <p className="text-white/30 text-xs">Images & assets</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-5 h-5 text-purple-400" />
            <h2 className="font-heading text-lg font-semibold">Campaigns</h2>
          </div>
          <p className="text-3xl font-bold text-white mb-1">3</p>
          <p className="text-white/30 text-xs">Active promotions</p>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left p-4">Section</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Last Updated</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cmsSections.map((section) => (
                <tr key={section.name} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{section.name}</td>
                  <td className="p-4 text-white/40 text-xs">{section.type}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      section.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"
                    }`}>
                      {section.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/40 text-xs">{section.updated}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  )
}
