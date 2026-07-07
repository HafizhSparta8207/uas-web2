import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protect /dashboard and /checkout routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/checkout') || pathname.startsWith('/orders') || pathname.startsWith('/cart')) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(req.url));
      return NextResponse.redirect(url);
    }
  }

  // Role-based protection for /dashboard
  if (pathname.startsWith('/dashboard/seller') && token?.role !== 'SELLER') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/dashboard/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout', '/orders', '/cart'],
};
