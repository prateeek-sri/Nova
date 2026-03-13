"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, RotateCcw } from "lucide-react"

interface Message {
  sender: "user" | "ai"
  text: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ text: input }] }),
      })

      const data = await res.text()
      const aiMessage: Message = { sender: "ai", text: data }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error(err)
      const errorMessage: Message = { sender: "ai", text: "Something went wrong. Please try again!" }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage()
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-screen bg-[#050510] noise">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Chat Container */}
      <div className="relative z-10 flex flex-col h-full max-w-4xl w-full mx-auto px-4 pt-20 pb-4">

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-base font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span className="gradient-text">Nova</span>
              <span className="text-gray-500 font-normal ml-2 text-sm">Anime AI</span>
            </h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 glass hover:bg-white/[0.06] transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto rounded-xl glass p-4 space-y-4 flex flex-col">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-10">
              {/* Animated Logo */}
              <div className="relative">
                <div className="text-5xl animate-float">⚔️</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-orange-500/20 rounded-full blur-sm" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  What do you want to know?
                </h2>
                <p className="text-sm text-gray-500 max-w-sm">
                  Ask about One Piece, Naruto, or Bleach — characters, powers, arcs, theories, and more.
                </p>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {[
                  "Explain Luffy's Gear 5",
                  "Who are the Akatsuki?",
                  "What is Bankai?",
                  "Strongest in Big 3?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion)
                      inputRef.current?.focus()
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-gray-400 glass hover:bg-white/[0.06] hover:text-orange-400 border border-white/5 hover:border-orange-500/20 transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`animate-message-in max-w-[80%] md:max-w-[70%] ${
                msg.sender === "user" ? "self-end" : "self-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-[8px]">✦</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Nova</span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-br-md shadow-lg shadow-orange-600/10"
                    : "glass-strong text-gray-200 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="animate-message-in self-start max-w-[70%]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-[8px]">✦</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Nova</span>
              </div>
              <div className="glass-strong px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-3 glass rounded-xl p-2 flex gap-2 animate-border-glow">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about One Piece, Naruto, or Bleach..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium hover:scale-[1.03] active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-2">
          Nova can make mistakes. Verify important anime facts.
        </p>
      </div>
    </div>
  )
}
