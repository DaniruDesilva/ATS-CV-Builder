import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/checker/pdfParser';
import {
  evaluateDeterministicRules,
  parseStructuredResumeFromText,
  mergeResumeData,
} from '@/lib/checker/ruleEngine';
import { analyzeResumeWithGemini, fallbackStructuredResume } from '@/lib/ai/gemini';
import { ScanReportData, ScanResultData } from '@/types/checker';
import { checkGuestLimit, applyGuestUsageCookie } from '@/lib/auth/guestLimits';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 0. Enforce guest usage limits (1 free scan for unauthenticated users)
    const { allowed, isAuthenticated, usage } = await checkGuestLimit(req, 'scan');
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'You have used your 1 free guest scan. Please sign in or create an account to scan unlimited resumes.',
          requireAuth: true,
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = (formData.get('jobDescription') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No document file provided.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const fileName = file.name;

    // 1. Parse text & page count
    const extracted = await parseDocument(fileBuffer, mimeType, fileName);

    if (!extracted.isParseable || extracted.text.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Unparseable or image-only document detected. Please upload a standard text-based PDF or DOCX file.'
        },
        { status: 422 }
      );
    }

    // 2. Comprehensive Deterministic Evaluation (works without any API key)
    const deterministic = evaluateDeterministicRules(extracted.text, extracted.pageCount, jobDescription);

    // 3. Try AI enhancement (optional — falls back gracefully if no API key)
    let aiEnhanced = false;
    let aiResult: any = null;
    try {
      aiResult = await analyzeResumeWithGemini(extracted.text, jobDescription, fileName);
      // Check if this is a real AI result (not fallback) by checking if it has non-default values
      if (aiResult && aiResult._isAiGenerated) {
        aiEnhanced = true;
      }
    } catch {
      // AI failed silently — deterministic engine handles everything
    }

    // 4. Use deterministic scores as primary, AI as optional enhancement
    const contentScore = aiEnhanced ? Math.round((deterministic.contentScore + (aiResult.contentScore || deterministic.contentScore)) / 2) : deterministic.contentScore;
    const skillsScore = aiEnhanced ? Math.round((deterministic.skillsScore + (aiResult.skillsScore || deterministic.skillsScore)) / 2) : deterministic.skillsScore;
    const formatScore = deterministic.formatScore;

    const overallScore = Math.round(contentScore * 0.4 + formatScore * 0.3 + skillsScore * 0.3);

    // Merge AI bullet improvements with deterministic ones
    const bulletImprovements = aiEnhanced && aiResult.bulletImprovements?.length > 0
      ? aiResult.bulletImprovements
      : deterministic.bulletImprovements;

    // Merge matched skills (union of both)
    const matchedSkills = [...new Set([
      ...deterministic.matchedSkills,
      ...(aiEnhanced && aiResult.matchedSkills ? aiResult.matchedSkills : [])
    ])];

    // Merge missing keywords
    const missingKeywords = [...new Set([
      ...deterministic.missingKeywords,
      ...(aiEnhanced && aiResult.missingKeywords ? aiResult.missingKeywords : [])
    ])];

    const reportData: ScanReportData = {
      overallScore,
      formatScore,
      contentScore,
      skillsScore,
      summary: aiEnhanced && aiResult.summary ? aiResult.summary : deterministic.summary,
      matchedSkills,
      missingKeywords,
      bulletImprovements,
      formattingIssues: deterministic.formattingIssues,
      quantificationStats: deterministic.quantificationStats,
      actionVerbStats: deterministic.actionVerbStats,
      contactCompleteness: deterministic.contactCompleteness,
      atsHeadingsFound: deterministic.atsHeadingsFound,
      missingStandardHeadings: deterministic.missingStandardHeadings
    };

    const deterministicResume = parseStructuredResumeFromText(extracted.text, fileName, extracted.links || []);
    const extractedResume = aiResult?.extractedResume
      ? mergeResumeData(aiResult.extractedResume, deterministicResume)
      : deterministicResume;

    const scanResult: ScanResultData = {
      fileName,
      overallScore,
      formatScore,
      contentScore,
      skillsScore,
      parsedText: extracted.text,
      reportData,
      jobDescription,
      extractedResume,
      createdAt: new Date().toISOString()
    };

    const response = NextResponse.json(scanResult);
    if (!isAuthenticated) {
      applyGuestUsageCookie(response, 'scan', usage);
    }
    return response;
  } catch (error) {
    console.error('Error processing check-resume API:', error);
    return NextResponse.json(
      { error: 'Failed to process document scan. Please try again.' },
      { status: 500 }
    );
  }
}
