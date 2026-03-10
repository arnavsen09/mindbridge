import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  // API routes that need special handling
  if (pathname.startsWith('/api/')) {
    // Auth API routes are public
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }
    // Share API is public
    if (pathname.startsWith('/api/share/')) {
      return NextResponse.next();
    }
    // Other API routes need auth (handled in the routes themselves)
    return NextResponse.next();
  }

  // Share pages are public
  if (pathname.startsWith('/share/')) {
    return NextResponse.next();
  }

  // Skip middleware for public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get session
  const session = await getSession();

  // Redirect to auth if no session
  if (!session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Check role-based access
  if (pathname.startsWith('/teen')) {
    if (session.role !== 'teen') {
      return NextResponse.redirect(new URL('/adult', request.url));
    }
  }

  if (pathname.startsWith('/adult')) {
    if (session.role !== 'adult') {
      return NextResponse.redirect(new URL('/teen', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};

