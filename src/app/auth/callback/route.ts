import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const email = user.email;

      if (email) {
        try {
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            email.split('@')[0];
          const avatarUrl =
            user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

          await prisma.user.upsert({
            where: { email },
            create: {
              id: user.id,
              email,
              name,
              avatarUrl,
              tier: 'FREE',
            },
            update: {
              name: name || undefined,
              avatarUrl: avatarUrl || undefined,
            },
          });
        } catch (dbErr) {
          console.error('Failed to sync user to database in auth callback:', dbErr);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
