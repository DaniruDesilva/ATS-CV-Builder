import { NextRequest, NextResponse } from 'next/server';
import { optimizeBulletPointWithGemini } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { bulletText, isSummary } = await req.json();

    if (!bulletText || typeof bulletText !== 'string') {
      return NextResponse.json({ error: 'Text content is required.' }, { status: 400 });
    }

    const improved = await optimizeBulletPointWithGemini(bulletText, Boolean(isSummary));

    return NextResponse.json({ original: bulletText, improved });
  } catch (error) {
    console.error('Error in optimize-bullet API:', error);
    return NextResponse.json({ error: 'Failed to optimize bullet text.' }, { status: 500 });
  }
}

