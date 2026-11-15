import { NextRequest, NextResponse } from 'next/server';
import { matchJobKeywordsWithGemini } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeText } = await req.json();

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json({ error: 'Target job description is required.' }, { status: 400 });
    }

    const analysis = await matchJobKeywordsWithGemini(jobDescription, resumeText || '');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in match-keywords API:', error);
    return NextResponse.json({ error: 'Failed to analyze keyword gap.' }, { status: 500 });
  }
}
