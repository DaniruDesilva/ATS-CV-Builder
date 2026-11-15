import { createServerClient, type CookieOptions } from '@supabase/ssr';

import { NextResponse, type NextRequest } from 'next/server';
import { sanitizeRedirect } from '@/lib/validation/auth';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options || {})
        );
      },
    },
  });

  // Always use getUser() instead of getSession() for secure server-side verification
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (err) {
    console.error('Middleware auth check error:', err);
  }

  const pathname = request.nextUrl.pathname;

  // Protect /dashboard route from unauthenticated access
  if (pathname.startsWith('/dashboard') && !user) {
    const redirectUrl = new URL('/login', request.url);
    const safePath = sanitizeRedirect(pathname, '/dashboard');
    redirectUrl.searchParams.set('redirect', safePath);
    const redirectRes = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => redirectRes.cookies.set(cookie));
    return redirectRes;
  }

  // If already authenticated, redirect away from guest-only auth pages
  if ((pathname === '/login' || pathname === '/register') && user) {
    const rawRedirect = request.nextUrl.searchParams.get('redirect');
    const safeTarget = sanitizeRedirect(rawRedirect, '/dashboard');
    const redirectRes = NextResponse.redirect(new URL(safeTarget, request.url));
    response.cookies.getAll().forEach((cookie) => redirectRes.cookies.set(cookie));
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
