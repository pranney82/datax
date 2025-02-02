import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple request logger for Edge Runtime
function logRequest(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`)
}

export async function middleware(request: NextRequest) {
  // Log the request
  logRequest(request)
  
  // Return the response
  return NextResponse.next()
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 