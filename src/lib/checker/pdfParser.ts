import { extractText, extractLinks, getDocumentProxy } from 'unpdf';
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
  if (trimmed.toLowerCase().startsWith('tel:')) {
    return '';
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

/**
 * Extracts layout-aware text and inline hyperlink mappings per page using PDF coordinates.
 * Preserves left/right column separation via tab delimiters and attaches link annotations
 * directly to the text items they overlap.
 */
async function extractLayoutAwarePdf(uint8: Uint8Array): Promise<{
  text: string;
  totalPages: number;
  links: string[];
}> {
  const pdf = await getDocumentProxy(new Uint8Array(uint8));
  const totalPages = pdf.numPages || 1;
  const pageLines: string[] = [];
  const allLinks: string[] = [];

  for (let p = 1; p <= totalPages; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    const annots = await page.getAnnotations().catch(() => []);

    const linkAnnots: Array<{ url: string; rect: number[] }> = [];
    for (const a of annots as any[]) {
      if (a?.subtype === 'Link' && Array.isArray(a.rect) && a.rect.length >= 4) {
        const safeUrl = filterSafeLink(a.url || a.unsafeUrl);
        if (safeUrl) {
          linkAnnots.push({ url: safeUrl, rect: a.rect.map(Number) });
          if (!allLinks.includes(safeUrl)) {
            allLinks.push(safeUrl);
          }
        }
      }
    }

    interface RowItem {
      str: string;
      x: number;
      y: number;
      w: number;
      h: number;
    }

    const rows: Array<{ y: number; items: RowItem[] }> = [];
    for (const rawItem of tc.items as any[]) {
      if (!rawItem || typeof rawItem.str !== 'string' || rawItem.str.length === 0) continue;
      const x = Number(rawItem.transform?.[4] ?? 0);
      const y = Number(rawItem.transform?.[5] ?? 0);
      const w = Number(rawItem.width ?? 0);
      const h = Number(rawItem.height ?? 10) || 10;

      let row = rows.find((r) => Math.abs(r.y - y) <= 3.0);
      if (!row) {
        row = { y, items: [] };
        rows.push(row);
      }
      row.items.push({ str: rawItem.str, x, y, w, h });
    }

    // Sort visual rows from top of page to bottom (descending PDF y coordinate)
    rows.sort((a, b) => b.y - a.y);

    for (const row of rows) {
      row.items.sort((a, b) => a.x - b.x);
      let line = '';
      let prevEnd: number | null = null;
      const attachedUrlsOnRow = new Set<string>();

      for (const it of row.items) {
        // Wide whitespace spacer item between left and right columns
        if (it.str.trim() === '' && it.w > 30) {
          if (line && !line.endsWith('\t')) line += '\t';
          prevEnd = it.x + it.w;
          continue;
        }

        if (prevEnd !== null) {
          const gap = it.x - prevEnd;
          if (gap > 35) {
            if (line && !line.endsWith('\t')) line += '\t';
          } else if (
            gap > 1.5 &&
            !line.endsWith(' ') &&
            !line.endsWith('\t') &&
            !it.str.startsWith(' ')
          ) {
            line += ' ';
          }
        }

        line += it.str;
        prevEnd = it.x + it.w;

        // Check if a PDF Link annotation directly overlaps this text item
        const trimmedStr = it.str.trim();
        if (trimmedStr.length > 1) {
          const cx = it.x + it.w / 2;
          const cy = it.y + it.h / 2;
          for (const la of linkAnnots) {
            const [x1, y1, x2, y2] = la.rect;
            if (
              cx >= x1 - 3 &&
              cx <= x2 + 3 &&
              cy >= y1 - 2.5 &&
              cy <= y2 + 2.5 &&
              !la.url.startsWith('mailto:') &&
              !attachedUrlsOnRow.has(la.url)
            ) {
              attachedUrlsOnRow.add(la.url);
              // Append (url) inline if the visible text does not already include the full URL or path
              const bareUrl = la.url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
              const normText = trimmedStr.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
              if (normText.toLowerCase() !== bareUrl.toLowerCase()) {
                line += ` (${la.url})`;
              }
            }
          }
        }
      }

      const trimmedLine = line.replace(/[ \f\r]+/g, ' ').trim();
      if (trimmedLine) {
        pageLines.push(trimmedLine);
      }
    }
  }

  return {
    text: pageLines.join('\n'),
    totalPages,
    links: allLinks,
  };
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
      let fullText = '';
      let totalPages = 1;
      let links: string[] = [];

      try {
        const layoutResult = await extractLayoutAwarePdf(uint8);
        fullText = layoutResult.text;
        totalPages = layoutResult.totalPages;
        links = layoutResult.links;
      } catch (layoutErr) {
        console.warn('Layout-aware PDF extraction fallback:', layoutErr);
        const fallback = await extractText(new Uint8Array(fileBuffer));
        fullText = Array.isArray(fallback.text) ? fallback.text.join('\n') : fallback.text;
        totalPages = fallback.totalPages || 1;
      }

      // Ensure any additional annotation links from unpdf extractLinks are merged
      try {
        const linkResult = await extractLinks(new Uint8Array(fileBuffer));
        if (linkResult && Array.isArray(linkResult.links)) {
          for (const rawLink of linkResult.links) {
            const safe = filterSafeLink(rawLink);
            if (safe && !links.includes(safe)) {
              links.push(safe);
            }
          }
        }
      } catch (linkErr) {
        console.warn('PDF link extraction notice:', linkErr);
      }

      return {
        text: fullText,
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
