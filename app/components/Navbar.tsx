"use client"
import { useState, useEffect } from "react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function Navbar() {
  const { isSignedIn } = useUser()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
            <span className="text-white text-xs font-black">N</span>
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Nova
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-5">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
            Home
          </Link>

          {isSignedIn ? (
            <Link href="/chat" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </button>
            </SignInButton>
          )}

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex gap-2.5">
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all duration-300 shadow-sm shadow-orange-600/20 hover:shadow-orange-500/30 hover:scale-[1.03]">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 text-sm font-medium text-gray-400 glass hover:text-white border border-white/10 hover:border-orange-500/20 rounded-lg transition-all duration-300">
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
