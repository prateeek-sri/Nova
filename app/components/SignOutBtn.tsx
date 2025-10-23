"use client"

import { SignOutButton } from "@clerk/nextjs"

export default function SignOutBtn() {
  return (
    <SignOutButton>
      <button className="px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
    </SignOutButton>
  )
}
