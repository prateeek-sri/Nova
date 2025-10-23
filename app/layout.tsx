import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import './globals.css'
import Footer from './components/Footer'
export const metadata: Metadata = {
  title: 'Nova - AI Assistant',
  description: 'Your personal AI assistant powered by Gemini and AstraDB.',
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
