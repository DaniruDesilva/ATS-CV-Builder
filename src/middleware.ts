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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect /dashboard route from unauthenticated access
  if (pathname.startsWith('/dashboard') && !user) {
    const redirectUrl = new URL('/login', request.url);
    const safePath = sanitizeRedirect(pathname, '/dashboard');
    redirectUrl.searchParams.set('redirect', safePath);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated, redirect away from guest-only auth pages
  if ((pathname === '/login' || pathname === '/register') && user) {
    const rawRedirect = request.nextUrl.searchParams.get('redirect');
    const safeTarget = sanitizeRedirect(rawRedirect, '/dashboard');
    return NextResponse.redirect(new URL(safeTarget, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
