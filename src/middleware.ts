import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/diet') ||
    pathname.startsWith('/progress') || pathname.startsWith('/settings');

  if (isDashboard && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/diet/:path*', '/progress/:path*', '/settings/:path*', '/login', '/register'],
};
