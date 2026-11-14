import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const customName = body.name;

    const name =
      customName ||
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email.split('@')[0];
    const avatarUrl =
      authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;

    const dbUser = await prisma.user.upsert({
      where: { email: authUser.email },
      create: {
        id: authUser.id,
        email: authUser.email,
        name,
        avatarUrl,
        tier: 'FREE',
      },
      update: {
        name: name || undefined,
        avatarUrl: avatarUrl || undefined,
      },
      include: {
        _count: {
          select: { resumes: true, scans: true },
        },
      },
    });

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
        name: dbUser.name || dbUser.email.split('@')[0],
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
    console.error('Error in /api/auth/sync:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to sync user' },
      { status: 500 }
    );
  }
}
