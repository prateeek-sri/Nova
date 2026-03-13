"use client";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MessageSquare, Zap, Brain, Rocket, Sparkles, Search, BookOpen } from "lucide-react";

export default function HomePage() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[#050510] text-white noise">
      {/* === Animated Background Orbs === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/8 to-red-500/5 blur-[100px] animate-float" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/6 to-purple-500/4 blur-[120px] animate-float-delayed" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-orange-500/5 to-yellow-500/3 blur-[80px] animate-glow-pulse" />
      </div>

      {/* === Grid Pattern Overlay === */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* === Hero Section === */}
      <section className="relative z-10 flex flex-col justify-center items-center text-center pt-36 pb-24 px-6">
        {/* Badge */}
        <div className="animate-slide-up mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass border border-orange-500/20 text-orange-300">
            <Sparkles className="w-3 h-3" />
            Powered by Gemini AI & AstraDB
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-slide-up text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", animationDelay: "0.1s", animationFillMode: "both" }}>
          <span className="gradient-text animate-gradient-shift glow-text-orange">Nova</span>
        </h1>

        <p className="animate-slide-up text-lg md:text-xl text-gray-400 max-w-xl mb-4 leading-relaxed font-light"
           style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          Your AI companion for the legendary{" "}
          <span className="text-orange-400 font-medium">Big 3</span> anime.
        </p>

        <p className="animate-slide-up text-sm text-gray-500 max-w-md mb-10"
           style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          Deep knowledge of One Piece, Naruto & Bleach — characters, arcs, power systems, and lore.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center items-center"
             style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
          {isSignedIn ? (
            <>
              <Link
                href="/chat"
                className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-500/40 hover:scale-[1.03]"
              >
                <MessageSquare className="w-4 h-4 transition-transform group-hover:rotate-12" />
                Start Chatting
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-500/40 hover:scale-[1.03]">
                  <Rocket className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  Get Started
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-8 py-3.5 rounded-xl text-base font-medium text-gray-300 glass hover:bg-white/[0.06] border border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.03]">
                  Create Account
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {isSignedIn && (
          <p className="text-gray-500 mt-5 text-sm animate-fade-in">
            Welcome back, <span className="text-orange-400 font-medium">{user?.firstName}</span>
          </p>
        )}
      </section>

      {/* === Anime Showcase === */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="gradient-text-cool">The Big 3</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Ask anything about the most iconic anime series ever created
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimeShowcaseCard
            emoji="🏴‍☠️"
            title="One Piece"
            items={["Devil Fruits & Haki", "Straw Hat Crew", "The Grand Line", "Yonko & Warlords"]}
            accentColor="orange"
          />
          <AnimeShowcaseCard
            emoji="🍥"
            title="Naruto"
            items={["Jutsu & Chakra", "Tailed Beasts", "Akatsuki", "Shinobi Villages"]}
            accentColor="yellow"
          />
          <AnimeShowcaseCard
            emoji="💀"
            title="Bleach"
            items={["Zanpakutō & Bankai", "Soul Society", "Gotei 13", "Thousand-Year Blood War"]}
            accentColor="blue"
          />
        </div>
      </section>

      {/* === Features Section === */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Why <span className="gradient-text">Nova</span>?
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Built with cutting-edge AI for the ultimate anime experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="w-6 h-6" />}
            title="Deep Knowledge"
            desc="Trained on extensive wiki data covering lore, abilities, and story arcs from all three series."
          />
          <FeatureCard
            icon={<Search className="w-6 h-6" />}
            title="Vector Search"
            desc="Uses AstraDB to find the most relevant anime knowledge for your questions in milliseconds."
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Context-Aware"
            desc="Understands nuance and can discuss complex topics like power scaling, plot theories, and more."
          />
        </div>
      </section>

      {/* === Bottom CTA === */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="glass-strong rounded-2xl p-12 gradient-border">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to explore?
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Dive into debates about Gear 5, the Rinnegan, or Yhwach's Almighty.
            Nova knows it all.
          </p>
          <Link
            href={isSignedIn ? "/chat" : "#"}
            onClick={(e) => { if (!isSignedIn) e.preventDefault(); }}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.03] ${
              isSignedIn
                ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-600/25"
                : "glass border border-white/10 text-gray-300 hover:border-orange-500/30"
            }`}
          >
            <Zap className="w-4 h-4" />
            {isSignedIn ? "Open Chat" : "Sign in to Begin"}
          </Link>
        </div>
      </section>
    </div>
  );
}

/* === Anime Showcase Card === */
function AnimeShowcaseCard({
  emoji,
  title,
  items,
  accentColor,
}: {
  emoji: string;
  title: string;
  items: string[];
  accentColor: "orange" | "yellow" | "blue";
}) {
  const borderMap = {
    orange: "hover:border-orange-500/30",
    yellow: "hover:border-yellow-500/30",
    blue: "hover:border-blue-500/30",
  };
  const glowMap = {
    orange: "hover:shadow-[0_0_50px_rgba(249,115,22,0.08)]",
    yellow: "hover:shadow-[0_0_50px_rgba(234,179,8,0.08)]",
    blue: "hover:shadow-[0_0_50px_rgba(59,130,246,0.08)]",
  };
  const dotMap = {
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`group glass rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] ${borderMap[accentColor]} ${glowMap[accentColor]} cursor-default`}>
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full ${dotMap[accentColor]} opacity-60`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* === Feature Card === */
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
    <div className="group glass rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-orange-500/20 hover:shadow-[0_0_50px_rgba(249,115,22,0.05)] cursor-default">
      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 group-hover:bg-orange-500/15 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
