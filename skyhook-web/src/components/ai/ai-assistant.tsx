"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to Skyhook Coffee. I'm your personal hospitality assistant. How can I elevate your experience today?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "I'm sorry, I couldn't process that." }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-skyhook-amber to-skyhook-orange flex items-center justify-center shadow-lg shadow-skyhook-amber/25 hover:shadow-xl hover:shadow-skyhook-amber/30 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]"
            >
              <GlassCard className="p-0 overflow-hidden max-h-[600px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-skyhook-amber to-skyhook-orange flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Skyhook AI</p>
                      <p className="text-white/30 text-xs">Always here to help</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div className={`flex gap-3 max-w-[80%] ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === "assistant" ? "bg-skyhook-amber/20" : "bg-skyhook-amber"
                        }`}>
                          {msg.role === "assistant" ? (
                            <Bot className="w-4 h-4 text-skyhook-amber" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${
                          msg.role === "assistant"
                            ? "bg-white/5 text-white/80"
                            : "bg-skyhook-amber text-skyhook-black"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-skyhook-amber/20 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-skyhook-amber" />
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5">
                          <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={loading}
                      className="w-10 h-10 rounded-xl bg-skyhook-amber flex items-center justify-center hover:bg-skyhook-orange transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
