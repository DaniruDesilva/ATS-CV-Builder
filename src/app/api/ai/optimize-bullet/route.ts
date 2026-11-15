import { NextRequest, NextResponse } from 'next/server';
import { optimizeBulletPointWithGemini } from '@/lib/ai/gemini';
import { checkGuestLimit, applyGuestUsageCookie } from '@/lib/auth/guestLimits';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 0. Enforce guest usage limits (1 free bullet optimization for unauthenticated users)
    const { allowed, isAuthenticated, usage } = await checkGuestLimit(req, 'bullet');
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'You have used your 1 free bullet point optimization. Please sign in or create an account to optimize unlimited achievements.',
          requireAuth: true,
        },
        { status: 403 }
      );
    }

    const { bulletText, isSummary } = await req.json();

    if (!bulletText || typeof bulletText !== 'string') {
      return NextResponse.json({ error: 'Text content is required.' }, { status: 400 });
    }

    const improved = await optimizeBulletPointWithGemini(bulletText, Boolean(isSummary));

    const response = NextResponse.json({ original: bulletText, improved });
    if (!isAuthenticated) {
      applyGuestUsageCookie(response, 'bullet', usage);
    }
    return response;
  } catch (error) {
    console.error('Error in optimize-bullet API:', error);
    return NextResponse.json({ error: 'Failed to optimize bullet text.' }, { status: 500 });
  }
}

