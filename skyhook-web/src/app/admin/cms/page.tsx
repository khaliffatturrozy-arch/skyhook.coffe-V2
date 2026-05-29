"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { FileText, Eye, EyeOff, Edit2, Loader2 } from "lucide-react"

export default function AdminCMSPage() {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: "", content: "", image_url: "", is_published: true })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/cms")
    const d = await res.json()
    setSections(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openEdit(section: any) {
    setForm({
      title: section.title || "", content: section.content || "",
      image_url: section.image_url || "", is_published: section.is_published ?? true,
    })
    setEditing(section); setModalOpen(true)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        body: JSON.stringify({ ...form, id: editing.id }),
      })
      if (res.ok) { setModalOpen(false); load() }
    } finally { setSaving(false) }
  }

  async function togglePublish(section: any) {
    setSaving(true)
    await fetch("/api/admin/cms", {
      method: "PUT",
      body: JSON.stringify({ id: section.id, title: section.title, content: section.content, is_published: !section.is_published }),
    })
    load()
    setSaving(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">CMS Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage content sections across the site</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <GlassCard key={section.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-skyhook-amber" />
                  <h3 className="text-white font-semibold capitalize">{section.section}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => togglePublish(section)} disabled={saving} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white">
                    {section.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(section)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-white/40 text-sm mb-2">{section.title}</p>
              <p className="text-white/20 text-xs line-clamp-2">{section.content}</p>
            </GlassCard>
          ))}
        </div>
      )}

      <AdminModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title="Edit CMS Section"
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "content", label: "Content", type: "textarea" },
          { name: "image_url", label: "Image URL", type: "text" },
          { name: "is_published", label: "Published", type: "select", options: [{ value: "true", label: "Published" }, { value: "false", label: "Draft" }] },
        ]}
        values={{ ...form, is_published: String(form.is_published) }}
        onChange={(n, v) => setForm((f) => ({ ...f, [n]: n === "is_published" ? v === "true" : v }))}
        onSubmit={handleSave} loading={saving} submitLabel="Update"
      />
    </div>
  )
}
