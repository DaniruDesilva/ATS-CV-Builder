import { FormattingIssue, QuantificationStats } from '@/types/checker';

export interface DeterministicResult {
  formatScore: number;
  contactCompleteness: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    score: number;
  };
  quantificationStats: QuantificationStats;
  atsHeadingsFound: string[];
  missingStandardHeadings: string[];
  formattingIssues: FormattingIssue[];
}

const STANDARD_HEADINGS = [
  'WORK EXPERIENCE',
  'EDUCATION',
  'SKILLS',
  'SUMMARY',
  'PROJECTS'
];

export function evaluateDeterministicRules(text: string, pageCount: number): DeterministicResult {
  const issues: FormattingIssue[] = [];
  const upperText = text.toUpperCase();

  // 1. Contact Info Check
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;

  const hasEmail = emailRegex.test(text);
  const hasPhone = phoneRegex.test(text);
  const hasLinkedIn = linkedinRegex.test(text);

  let contactScore = 0;
  if (hasEmail) contactScore += 40;
  if (hasPhone) contactScore += 40;
  if (hasLinkedIn) contactScore += 20;

  if (!hasEmail) {
    issues.push({
      issue: 'Missing Email Address',
      severity: 'high',
      recommendation: 'Add a professional email address at the top of your resume.'
    });
  }
  if (!hasPhone) {
    issues.push({
      issue: 'Missing Phone Number',
      severity: 'medium',
      recommendation: 'Include a direct phone number with country code.'
    });
  }
  if (!hasLinkedIn) {
    issues.push({
      issue: 'Missing LinkedIn Profile URL',
      severity: 'low',
      recommendation: 'Add your LinkedIn profile link to improve recruiter searchability.'
    });
  }

  // 2. Page Count Penalty
  let pageScore = 100;
  if (pageCount > 2) {
    pageScore = 60;
    issues.push({
      issue: `Excessive Page Length (${pageCount} Pages)`,
      severity: 'medium',
      recommendation: 'Consolidate resume to 1-2 pages maximum. ATS systems and recruiters favor concise layouts.'
    });
  } else if (pageCount === 0) {
    pageScore = 50;
  }

  // 3. Quantification Check (Impact numbers: %, $, multipliers, metrics)
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 15);
  const metricRegex = /(\d+%\b|\$\d+|\b\d+\s*(k|m|million|billion|x|users|customers|percent)\b|\b\d{2,}\b)/i;

  let totalBullets = 0;
  let quantifiedBullets = 0;

  lines.forEach((line) => {
    // Check if line looks like a bullet or achievement statement
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.length > 30) {
      totalBullets++;
      if (metricRegex.test(line)) {
        quantifiedBullets++;
      }
    }
  });

  const quantPercentage = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;

  if (quantPercentage < 30) {
    issues.push({
      issue: `Low Metric Quantification (${quantPercentage}% of Bullets)`,
      severity: 'high',
      recommendation: 'Add numerical metrics (%, $, scale, users saved) to at least 40-50% of your experience bullets.'
    });
  }

  // 4. Standard Headings Detection
  const headingsFound: string[] = [];
  const missingHeadings: string[] = [];

  STANDARD_HEADINGS.forEach((heading) => {
    if (upperText.includes(heading) || (heading === 'WORK EXPERIENCE' && upperText.includes('EXPERIENCE'))) {
      headingsFound.push(heading);
    } else {
      missingHeadings.push(heading);
      issues.push({
        issue: `Missing Standard Header "${heading}"`,
        severity: 'medium',
        recommendation: `Use standard section headers like "${heading}" so ATS parsers accurately index your experience.`
      });
    }
  });

  // Calculate Overall Deterministic Format Score
  const formatScore = Math.round(
    contactScore * 0.35 +
    pageScore * 0.25 +
    (headingsFound.length / STANDARD_HEADINGS.length) * 100 * 0.2 +
    Math.min(100, quantPercentage * 1.5) * 0.2
  );

  return {
    formatScore: Math.min(100, Math.max(0, formatScore)),
    contactCompleteness: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      score: contactScore
    },
    quantificationStats: {
      totalBullets,
      quantifiedBullets,
      percentage: quantPercentage
    },
    atsHeadingsFound: headingsFound,
    missingStandardHeadings: missingHeadings,
    formattingIssues: issues
  };
}
