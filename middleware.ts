import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import morgan from 'morgan'
import { Stream } from 'stream'

// Create a custom stream for Morgan
const stream = new Stream.Writable({
  write(chunk: Buffer, encoding: BufferEncoding, next: () => void) {
    console.log(chunk.toString())
    next()
  }
})

// Initialize Morgan with custom format
const logger = morgan('tiny', { stream })

export async function middleware(request: NextRequest) {
  // Create a response
  const response = NextResponse.next()
  
  // Log the request
  await new Promise((resolve) => {
    logger(
      {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers)
      } as never,
      {
        getHeader: (name: string) => response.headers.get(name),
        setHeader: (name: string, value: string) => response.headers.set(name, value)
      } as never,
      resolve as never
    )
  })

  return response
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