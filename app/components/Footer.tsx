export default function Footer() {
  return (
    <footer className="relative z-10 w-full text-center py-8 border-t border-white/5">
      <p className="text-xs text-gray-600">
        © {new Date().getFullYear()}{" "}
        <span className="gradient-text font-semibold">Nova</span>
        <span className="text-gray-700 mx-2">·</span>
        One Piece · Naruto · Bleach
      </p>
      <p className="text-[10px] mt-1.5 text-gray-700">
        Built with Next.js, Gemini AI & AstraDB
      </p>
    </footer>
  )
}
