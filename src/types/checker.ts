export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface FormattingIssue {
  issue: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface QuantificationStats {
  totalBullets: number;
  quantifiedBullets: number;
  percentage: number;
}

export interface ScanReportData {
  overallScore: number;
  formatScore: number;
  contentScore: number;
  skillsScore: number;
  summary: string;
  matchedSkills: string[];
  missingKeywords: string[];
  bulletImprovements: BulletImprovement[];
  formattingIssues: FormattingIssue[];
  quantificationStats: QuantificationStats;
  contactCompleteness: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    score: number;
  };
  atsHeadingsFound: string[];
  missingStandardHeadings: string[];
}

export interface ScanResultData {
  id?: string;
  fileName: string;
  overallScore: number;
  formatScore: number;
  contentScore: number;
  skillsScore: number;
  parsedText: string;
  reportData: ScanReportData;
  jobDescription?: string;
  createdAt?: string;
}
