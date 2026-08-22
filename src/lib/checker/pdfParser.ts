import { extractText } from 'unpdf';
import mammoth from 'mammoth';

export interface ExtractedDoc {
  text: string;
  pageCount: number;
  isParseable: boolean;
  fileType: 'pdf' | 'docx' | 'unknown';
}

export async function parseDocument(fileBuffer: Buffer, mimeType: string, fileName: string): Promise<ExtractedDoc> {
  try {
    const lowerName = fileName.toLowerCase();

    if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
      const { text, totalPages } = await extractText(new Uint8Array(fileBuffer));
      const fullText = Array.isArray(text) ? text.join('\n') : text;

      return {
        text: fullText,
        pageCount: totalPages || 1,
        isParseable: fullText.trim().length > 100, // Flag image-only/scanned PDFs
        fileType: 'pdf'
      };
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      lowerName.endsWith('.docx') ||
      lowerName.endsWith('.doc')
    ) {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      const pageEstimate = Math.max(1, Math.ceil(value.length / 2800));

      return {
        text: value,
        pageCount: pageEstimate,
        isParseable: value.trim().length > 100,
        fileType: 'docx'
      };
    }

    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  } catch (error) {
    console.error('Error parsing document:', error);
    return { text: '', pageCount: 0, isParseable: false, fileType: 'unknown' };
  }
}
