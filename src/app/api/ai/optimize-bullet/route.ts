import { NextRequest, NextResponse } from 'next/server';
import { optimizeBulletPointWithGemini } from '@/lib/ai/gemini';
import { checkGuestLimit, applyGuestUsageCookie } from '@/lib/auth/guestLimits';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const MAX_BULLET_CHARS = 4000;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`ai:optimize-bullet:${ip}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many optimization requests. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

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

    const body = await req.json().catch(() => null);
    const bulletText = body?.bulletText;
    const isSummary = body?.isSummary;

    if (!bulletText || typeof bulletText !== 'string' || !bulletText.trim()) {
      return NextResponse.json({ error: 'Text content is required.' }, { status: 400 });
    }

    if (bulletText.length > MAX_BULLET_CHARS) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${MAX_BULLET_CHARS} characters.` },
        { status: 400 }
      );
    }

    const improved = await optimizeBulletPointWithGemini(bulletText.trim(), Boolean(isSummary));

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

