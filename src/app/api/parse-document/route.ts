import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/checker/pdfParser';
import { parseStructuredResumeFromText } from '@/lib/checker/ruleEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No document file provided.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const fileName = file.name;

    const extracted = await parseDocument(fileBuffer, mimeType, fileName);

    if (!extracted.isParseable || extracted.text.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            'Unparseable or image-only document detected. Please upload a standard text-based PDF or DOCX file.',
        },
        { status: 422 }
      );
    }

    const extractedResume = parseStructuredResumeFromText(extracted.text, fileName, extracted.links || []);

    return NextResponse.json({
      success: true,
      fileName,
      fileSize: file.size,
      fileType: extracted.fileType,
      pageCount: extracted.pageCount,
      text: extracted.text,
      characterCount: extracted.text.length,
      links: extracted.links || [],
      extractedResume,
    });
  } catch (error: any) {
    console.error('Error parsing document in parse-document API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to extract text from document.' },
      { status: 500 }
    );
  }
}
