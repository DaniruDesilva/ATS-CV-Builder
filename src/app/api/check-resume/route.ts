import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/checker/pdfParser';
import { evaluateDeterministicRules } from '@/lib/checker/ruleEngine';
import { analyzeResumeWithGemini } from '@/lib/ai/gemini';
import { ScanReportData, ScanResultData } from '@/types/checker';

export async function POST(req: NextRequest) {
  try {
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

    // 2. Deterministic Regex Evaluation
    const deterministic = evaluateDeterministicRules(extracted.text, extracted.pageCount);

    // 3. Gemini Semantic AI Evaluation
    const aiResult = await analyzeResumeWithGemini(extracted.text, jobDescription);

    // 4. Aggregated Score Calculation (Content: 40%, Format: 30%, Skills: 30%)
    const contentScore = aiResult.contentScore || 75;
    const formatScore = deterministic.formatScore;
    const skillsScore = aiResult.skillsScore || 70;

    const overallScore = Math.round(contentScore * 0.4 + formatScore * 0.3 + skillsScore * 0.3);

    const reportData: ScanReportData = {
      overallScore,
      formatScore,
      contentScore,
      skillsScore,
      summary: aiResult.summary || 'Resume analyzed successfully.',
      matchedSkills: aiResult.matchedSkills || [],
      missingKeywords: aiResult.missingKeywords || [],
      bulletImprovements: aiResult.bulletImprovements || [],
      formattingIssues: deterministic.formattingIssues,
      quantificationStats: deterministic.quantificationStats,
      contactCompleteness: deterministic.contactCompleteness,
      atsHeadingsFound: deterministic.atsHeadingsFound,
      missingStandardHeadings: deterministic.missingStandardHeadings
    };

    const scanResult: ScanResultData = {
      fileName,
      overallScore,
      formatScore,
      contentScore,
      skillsScore,
      parsedText: extracted.text,
      reportData,
      jobDescription,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('Error processing check-resume API:', error);
    return NextResponse.json(
      { error: 'Failed to process document scan. Please try again.' },
      { status: 500 }
    );
  }
}
