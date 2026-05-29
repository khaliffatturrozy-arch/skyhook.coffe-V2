"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"

type Field = {
  name: string; label: string; type: "text" | "number" | "textarea" | "select" | "email" | "password"
  options?: { value: string; label: string }[]
  required?: boolean
}

export function AdminModal({
  open, onClose, title, fields, values, onChange, onSubmit, loading, submitLabel = "Save",
}: {
  open: boolean; onClose: () => void; title: string
  fields: Field[]; values: Record<string, any>; onChange: (name: string, value: any) => void
  onSubmit: () => void; loading?: boolean; submitLabel?: string
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-white">{title}</h2>
                <button onClick={onClose} className="p-1 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label className="block text-white/60 text-xs mb-1 uppercase tracking-wider">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        value={values[f.name] || ""}
                        onChange={(e) => onChange(f.name, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-skyhook-amber/50 min-h-[80px]"
                      />
                    ) : f.type === "select" ? (
                      <select
                        value={values[f.name] || ""}
                        onChange={(e) => onChange(f.name, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-skyhook-amber/50"
                      >
                        <option value="">Select...</option>
                        {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        value={values[f.name] || ""}
                        onChange={(e) => onChange(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-skyhook-amber/50"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                <Button variant="primary" onClick={onSubmit} disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {submitLabel}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
