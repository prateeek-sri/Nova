"use client"

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-4">
      <div className="bg-purple-950 shadow-xl rounded-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Sign in to your account
        </p>

        <SignIn
          routing="path"
          path="/sign-in"
          redirectUrl="/chat"
          appearance={{
            elements: {
              formButtonPrimary:
                "px-4 py-2 rounded-md w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white",
              formInput:
                "border border-gray-600 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 bg-purple-900 text-white placeholder-gray-400",
            },
          }}
        />

        <p className="text-center text-gray-400 mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}
