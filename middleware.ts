import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    // Protect everything except Clerk public routes and static files
    '/((?!_next|.*\\..*|sign-in|sign-up|api/webhook).*)',
  ],
}
