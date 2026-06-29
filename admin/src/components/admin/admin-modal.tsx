"use client"

import { X } from "lucide-react"

interface Field { name: string; label: string; type: "text" | "number" | "select"; options?: { value: string; label: string }[] }

export function AdminModal({ open, onClose, title, fields, values, onChange, onSubmit, loading, submitLabel }: {
  open: boolean; onClose: () => void; title: string
  fields: Field[]; values: Record<string, string>; onChange: (name: string, value: string) => void
  onSubmit: () => void; loading?: boolean; submitLabel?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#212121]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 mb-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
              {f.type === "select" ? (
                <select value={values[f.name] || ""} onChange={(e) => onChange(f.name, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121] bg-white">
                  <option value="">Select...</option>
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input type={f.type} value={values[f.name] || ""} onChange={(e) => onChange(f.name, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121]" />
              )}
            </div>
          ))}
        </div>
        <button onClick={onSubmit} disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#212121] text-white font-semibold text-sm hover:bg-black disabled:opacity-50">
          {loading ? "Saving..." : submitLabel || "Save"}
        </button>
      </div>
    </div>
  )
}
