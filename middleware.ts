import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Check if the route is an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      const sessionCookie = request.cookies.get('admin-session')?.value;
      if (sessionCookie) {
        try {
          const session = await decrypt(sessionCookie);
          if (session) {
            // If already logged in, redirect to dashboard
            return NextResponse.redirect(new URL('/admin', request.url));
          }
        } catch (error) {
          // Invalid session, allow access to login
        }
      }
      return NextResponse.next();
    }

    // Check for authenticated session
    const sessionCookie = request.cookies.get('admin-session')?.value;
    
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = await decrypt(sessionCookie);
      if (!session) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

