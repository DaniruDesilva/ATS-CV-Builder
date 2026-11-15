import { NextRequest, NextResponse } from 'next/server';
import { matchJobKeywordsWithGemini } from '@/lib/ai/gemini';
import { checkGuestLimit, applyGuestUsageCookie } from '@/lib/auth/guestLimits';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
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

    const { jobDescription, resumeText } = await req.json();

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json({ error: 'Target job description is required.' }, { status: 400 });
    }

    const analysis = await matchJobKeywordsWithGemini(jobDescription, resumeText || '');

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
