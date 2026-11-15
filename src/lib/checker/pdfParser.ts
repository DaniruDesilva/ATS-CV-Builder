import { extractText, extractLinks } from 'unpdf';
import mammoth from 'mammoth';
import { sanitizeExternalUrl, sanitizeMailto } from '@/lib/utils';

export interface ExtractedDoc {
  text: string;
  pageCount: number;
  isParseable: boolean;
  fileType: 'pdf' | 'docx' | 'unknown';
  links: string[];
  errorMessage?: string;
}

function filterSafeLink(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    return sanitizeMailto(trimmed.slice(7));
  }
  return sanitizeExternalUrl(trimmed);
}

function hasPdfSignature(buf: Buffer): boolean {
  const header = buf.subarray(0, 1024).toString('latin1');
  return header.includes('%PDF-');
}

function hasZipSignature(buf: Buffer): boolean {
  return buf.length >= 2 && buf[0] === 0x50 && buf[1] === 0x4b;
}

export async function parseDocument(fileBuffer: Buffer, mimeType: string, fileName: string): Promise<ExtractedDoc> {
  try {
    const lowerName = fileName.toLowerCase();

    if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
      if (!hasPdfSignature(fileBuffer)) {
        return {
          text: '',
          pageCount: 0,
          isParseable: false,
          fileType: 'unknown',
          links: [],
          errorMessage: 'Invalid PDF file signature. Please upload a valid PDF document.',
        };
      }

      const uint8 = new Uint8Array(fileBuffer);
      const { text, totalPages } = await extractText(uint8);
      const fullText = Array.isArray(text) ? text.join('\n') : text;

      // Extract hyperlink annotations embedded in the PDF
      let links: string[] = [];
      try {
        const linkResult = await extractLinks(uint8);
        if (linkResult && Array.isArray(linkResult.links)) {
          links = Array.from(
            new Set(
              linkResult.links
                .map((l: any) => filterSafeLink(l))
                .filter((l: string) => l.length > 0)
            )
          );
        }
      } catch (linkErr) {
        console.warn('PDF link extraction notice:', linkErr);
      }

      // If hyperlinks exist that are not explicitly in the visible text, append them
      let enrichedText = fullText;
      if (links.length > 0) {
        const missingLinks = links.filter((l) => !fullText.includes(l));
        if (missingLinks.length > 0) {
          enrichedText += '\n\nExtracted Hyperlinks & Annotations:\n' + missingLinks.join('\n');
        }
      }

      return {
        text: enrichedText,
        pageCount: totalPages || 1,
        isParseable: fullText.trim().length > 100, // Flag image-only/scanned PDFs
        fileType: 'pdf',
        links,
      };
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      lowerName.endsWith('.docx') ||
      lowerName.endsWith('.doc')
    ) {
      if (!hasZipSignature(fileBuffer)) {
        return {
          text: '',
          pageCount: 0,
          isParseable: false,
          fileType: 'unknown',
          links: [],
          errorMessage: 'Unsupported or corrupted Word file. Please save as a standard .docx or .pdf file.',
        };
      }

      const { value: htmlText } = await mammoth.convertToHtml({ buffer: fileBuffer });
      const { value: rawText } = await mammoth.extractRawText({ buffer: fileBuffer });

      // Extract all URLs from HTML href attributes
      const hrefMatches = Array.from(
        htmlText.matchAll(/href=["'](https?:\/\/[^"'\s]+|mailto:[^"'\s]+)["']/gi)
      );
      const docxLinks: string[] = [];
      for (const m of hrefMatches) {
        const safe = filterSafeLink(m[1]);
        if (safe) docxLinks.push(safe);
      }

      // Convert HTML structure to clean text while preserving hyperlinks as "Label (url)"
      const cleanHtmlText = htmlText
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      const textToUse = cleanHtmlText.length >= rawText.length ? cleanHtmlText : rawText;
      const pageEstimate = Math.max(1, Math.ceil(textToUse.length / 2800));

      return {
        text: textToUse,
        pageCount: pageEstimate,
        isParseable: textToUse.trim().length > 100,
        fileType: 'docx',
        links: Array.from(new Set(docxLinks)),
      };
    }

    return {
      text: '',
      pageCount: 0,
      isParseable: false,
      fileType: 'unknown',
      links: [],
      errorMessage: 'Unsupported file format. Please upload a PDF or DOCX file.',
    };
  } catch (error) {
    console.error('Error parsing document:', error);
    return { text: '', pageCount: 0, isParseable: false, fileType: 'unknown', links: [] };
  }
}
