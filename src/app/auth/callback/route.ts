import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sanitizeRedirect } from '@/lib/validation/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next');
  const safeNext = sanitizeRedirect(rawNext, '/dashboard');

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const email = user.email?.trim().toLowerCase();

      if (email) {
        try {
          const rawName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            email.split('@')[0];
          const sanitizedName = String(rawName).trim().slice(0, 60);

          const rawAvatar =
            user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
          const sanitizedAvatar =
            typeof rawAvatar === 'string' && rawAvatar.startsWith('http')
              ? rawAvatar.slice(0, 500)
              : null;

          await prisma.user.upsert({
            where: { email },
            create: {
              id: user.id,
              email,
              name: sanitizedName,
              avatarUrl: sanitizedAvatar,
              tier: 'FREE',
            },
            update: {
              name: sanitizedName || undefined,
              avatarUrl: sanitizedAvatar || undefined,
            },
          });
        } catch (dbErr) {
          console.error('Failed to sync user to database in auth callback:', dbErr);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${safeNext}`);
      } else {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    }
  }

  // Return the user to login with a sanitized error indicator
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
