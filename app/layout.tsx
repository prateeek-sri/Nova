import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import './globals.css'
import Footer from './components/Footer'
export const metadata: Metadata = {
  title: 'Nova — Big 3 Anime AI',
  description: 'Your AI-powered companion for One Piece, Naruto, and Bleach. Ask anything about the Big 3.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <Navbar />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  )
}
