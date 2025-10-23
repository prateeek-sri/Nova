export default function Footer() {
  return (
    <footer className="w-full text-center py-6 mt-12 border-t border-white/10 bg-white/5 backdrop-blur-md text-gray-300">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="text-purple-400 font-semibold">Nova</span>. 
        All rights reserved.
      </p>
      <p className="text-xs mt-1 text-gray-500">
        Built with ❤️ using Next.js, Clerk & Gemini AI
      </p>
    </footer>
  )
}
