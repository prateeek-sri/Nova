"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  sender: "user" | "ai"
  text: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

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

      const data = await res.text() // we return plain text from API
      const aiMessage: Message = { sender: "ai", text: data }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error(err)
      const errorMessage: Message = { sender: "ai", text: "Error: could not get a response." }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-4 pt-24">
      <h1 className="text-3xl font-bold text-white mb-6 text-center rounded-lg shadow-md bg-purple-950/80 py-3">
        Government Schemes AI Chatbot
      </h1>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg bg-purple-950/80 shadow-md flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-md shadow-md break-words ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-700 text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="max-w-xs px-4 py-2 rounded-lg shadow-md bg-gray-700 text-white self-start">
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-4 space-x-2 rounded-lg shadow-md bg-purple-950/80 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-900 text-white placeholder-gray-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
