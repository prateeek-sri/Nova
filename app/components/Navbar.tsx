"use client"
import { useState, useEffect } from "react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function Navbar() {
  const { isSignedIn } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null // prevent server/client mismatch

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Nova</Link>

        <div className="flex text-white items-center gap-6">
          <Link href="/" className="hover:text-purple-400 text-white transition-all">Home</Link>

          {isSignedIn ? (
            <Link href="/chat" className="hover:text-purple-400 text-white transition-all flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="hover:text-purple-400 text-white transition-all flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            </SignInButton>
          )}

          {isSignedIn ? <UserButton afterSignOutUrl="/" /> : (
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 border border-purple-500 hover:bg-purple-700/30 rounded-lg transition-all text-white">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
