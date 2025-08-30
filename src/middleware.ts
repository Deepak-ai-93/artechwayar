import { type NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (!sessionCookie && isAdminPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (sessionCookie) {
    const session = await decrypt(sessionCookie.value);
    
    if (!session?.isLoggedIn && isAdminPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session?.isLoggedIn && isLoginPage) {
       return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
