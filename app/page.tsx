"use client";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MessageSquare, Zap, Shield, Brain, Rocket } from "lucide-react";

export default function HomePage() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center">
      <section className="flex flex-col justify-center items-center text-center pt-32 pb-20 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-200 bg-clip-text text-transparent ">
          Welcome to Nova <span className="text-[initial]"> ✨</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-10 leading-relaxed">
          Your intelligent AI chat companion powered by{" "}
          <span className="text-purple-300 font-semibold drop-shadow-md">
            Next.JS
          </span>{" "}
          and{" "}
          <span className="text-pink-300 font-semibold drop-shadow-md">
            Gemini
          </span>
          . Nova helps you think smarter, write faster, and explore ideas — all
          in one cosmic chat experience.
        </p>

        {isSignedIn ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-8 py-3 bg-purple-700 hover:bg-purple-800 rounded-xl text-lg transition-all shadow-lg shadow-purple-700/50 hover:shadow-purple-600/60 text-white"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              Open Chat
            </Link>

            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-lg transition-all shadow-lg shadow-purple-700/50 hover:shadow-purple-600/60">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white/20 hover:bg-white/40 rounded-xl text-lg text-white border border-white/40 backdrop-blur-sm">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}

        {isSignedIn && (
          <p className="text-gray-200 mt-4">
            Logged in as{" "}
            <span className="text-purple-300 font-medium">
              {user?.firstName}
            </span>
          </p>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        <FeatureCard
          icon={<Brain className="w-10 h-10 text-purple-400" />}
          title="Smart AI Responses"
          desc="Nova uses Gemini AI to understand context deeply, providing insightful and creative answers."
        />
        <FeatureCard
          icon={<Shield className="w-10 h-10 text-pink-400" />}
          title="Secure with Clerk"
          desc="Your data and chats are fully protected with Clerk authentication and encrypted sessions."
        />
        <FeatureCard
          icon={<Zap className="w-10 h-10 text-blue-400" />}
          title="Lightning Fast"
          desc="Experience instant responses powered by AstraDB vector search and optimized APIs."
        />
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]">
          Why Choose Nova?
        </h2>
        <p className="text-gray-100 text-lg leading-relaxed mb-8">
          Nova isn’t just a chatbot — it’s your AI partner for productivity,
          learning, and discovery. Ask questions, brainstorm ideas, or chat
          about anything — Nova adapts to you. Whether you’re a student,
          developer, or creator, Nova helps you achieve more with less effort.
        </p>
        <Link
          href={isSignedIn ? "/chat" : "#"}
          onClick={(e) => {
            if (!isSignedIn) e.preventDefault();
          }}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-semibold transition-all ${
            isSignedIn
              ? "bg-gradient-to-r from-purple-700 to-pink-500 hover:opacity-90 shadow-lg shadow-pink-500/50 text-white"
              : "bg-white/30 border border-white/40 hover:bg-white/50 text-white"
          }`}
        >
          <Rocket className="w-5 h-5" />
          {isSignedIn ? "Start Chatting" : "Sign in to Begin"}
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-purple-200 drop-shadow-sm">
        {title}
      </h3>
      <p className="text-gray-100 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
