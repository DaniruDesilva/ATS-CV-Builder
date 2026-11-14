import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    const email = authUser.email.trim().toLowerCase();

    // Find or create in Prisma database
    let dbUser = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: { resumes: true, scans: true },
        },
      },
    });

    if (!dbUser) {
      const rawName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        email.split('@')[0];
      const sanitizedName = String(rawName).trim().slice(0, 60);

      const rawAvatar =
        authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
      const sanitizedAvatar =
        typeof rawAvatar === 'string' && rawAvatar.startsWith('http')
          ? rawAvatar.slice(0, 500)
          : null;

      dbUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email,
          name: sanitizedName,
          avatarUrl: sanitizedAvatar,
          tier: 'FREE',
        },
        include: {
          _count: {
            select: { resumes: true, scans: true },
          },
        },
      });
    }

    const planTier = dbUser.tier.toLowerCase() as
      | 'free'
      | 'pro_monthly'
      | 'lifetime';

    let credits = 5;
    if (planTier === 'pro_monthly') credits = 150;
    else if (planTier === 'lifetime') credits = 300;

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name || email.split('@')[0],
        avatarUrl: dbUser.avatarUrl,
        plan: planTier,
        aiCredits: credits,
        maxAiCredits: credits,
        pdfExportsUsed: dbUser._count?.resumes || 0,
        createdAt: dbUser.createdAt.toISOString(),
      },
      isAuthenticated: true,
    });
  } catch (err: any) {
    console.error('Error in /api/auth/me:', err);
    return NextResponse.json(
      { error: 'Failed to fetch user session' },
      { status: 500 }
    );
  }
}
