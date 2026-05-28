"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { TrendingUp, BrainCircuit, RefreshCw } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [insights, setInsights] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/analytics?scope=global")
      const data = await res.json()
      setInsights(data.insights || "No insights available.")
    } catch {
      setInsights("Unable to load AI insights. Check your connection and API key.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">AI Business Intelligence</h1>
          <p className="text-white/40 text-sm mt-1">Data-driven insights powered by artificial intelligence</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-skyhook-amber/10 border border-skyhook-amber/20 text-skyhook-amber text-sm hover:bg-skyhook-amber/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="w-5 h-5 text-skyhook-amber" />
            <h2 className="font-heading text-lg font-semibold">AI Insights</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-white/70 whitespace-pre-wrap">
              {insights || "No insights yet. Click Refresh to generate."}
            </div>
          )}
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-heading text-lg font-semibold mb-4">Revenue Forecast</h2>
            <div className="h-48 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white/10" />
              <span className="text-white/20 text-sm ml-2">Chart coming soon</span>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-lg font-semibold mb-4">AI Recommendations</h2>
            <p className="text-white/40 text-sm">
              Fetch personalized AI recommendations for menu updates, promotions, and operational improvements.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
