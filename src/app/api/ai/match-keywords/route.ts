import { NextRequest, NextResponse } from 'next/server';
import { matchJobKeywordsWithGemini } from '@/lib/ai/gemini';
import { checkGuestLimit, applyGuestUsageCookie } from '@/lib/auth/guestLimits';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const MAX_JD_CHARS = 15_000;
const MAX_RESUME_CHARS = 40_000;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`ai:match-keywords:${ip}`, 15, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many keyword match requests. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    // 0. Enforce guest usage limits (1 free keyword scan for unauthenticated users)
    const { allowed, isAuthenticated, usage } = await checkGuestLimit(req, 'keyword');
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'You have used your 1 free keyword analysis. Please sign in or create an account to match unlimited job postings.',
          requireAuth: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const jobDescription = body?.jobDescription;
    const resumeText = typeof body?.resumeText === 'string' ? body.resumeText : '';

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json({ error: 'Target job description is required.' }, { status: 400 });
    }

    if (jobDescription.length > MAX_JD_CHARS) {
      return NextResponse.json(
        { error: `Job description exceeds maximum length of ${MAX_JD_CHARS} characters.` },
        { status: 400 }
      );
    }

    if (resumeText.length > MAX_RESUME_CHARS) {
      return NextResponse.json(
        { error: `Resume text exceeds maximum length of ${MAX_RESUME_CHARS} characters.` },
        { status: 400 }
      );
    }

    const analysis = await matchJobKeywordsWithGemini(jobDescription, resumeText);

    const response = NextResponse.json(analysis);
    if (!isAuthenticated) {
      applyGuestUsageCookie(response, 'keyword', usage);
    }
    return response;
  } catch (error) {
    console.error('Error in match-keywords API:', error);
    return NextResponse.json({ error: 'Failed to analyze keyword gap.' }, { status: 500 });
  }
}
