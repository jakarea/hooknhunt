import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/account']

// Define public routes that should not redirect to login
const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  // Use nextUrl.pathname instead of request.url
  const { pathname } = request.nextUrl

  // Check if the path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Check if the path is a public auth route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Get auth token from cookie
  const token = request.cookies.get('auth_token')?.value

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Add return URL so user can be redirected back after login
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If accessing login/register page while already authenticated, redirect to account
  if (isPublicRoute && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/account'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
