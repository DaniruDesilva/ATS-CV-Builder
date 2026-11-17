import { GoogleGenAI } from '@google/genai';
import {
  generateBulletImprovement,
  generateSummaryImprovement,
  extractSkillsFromText,
  parseStructuredResumeFromText,
  mergeResumeData,
} from '@/lib/checker/ruleEngine';
import { ResumeContent } from '@/types/resume';

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

function getModelName(): string {
  const configured = process.env.GEMINI_MODEL;
  if (configured && configured !== 'gemini-3.5-flash') return configured;
  return 'gemini-2.5-flash';
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription?: string,
  fileName?: string,
  links: string[] = []
) {
  const client = getGeminiClient();

  if (!client) {
    console.warn('GEMINI_API_KEY is missing. Using deterministic evaluation.');
    return generateFallbackAiAnalysis(resumeText, jobDescription, fileName, links);
  }

  try {
    const prompt = `You are an enterprise Applicant Tracking System (ATS) algorithmic parser and senior technical recruiter.
Evaluate the following resume text against the target job description (if provided, otherwise evaluate against modern industry standards).
Also accurately parse and structure the candidate's actual resume into the provided JSON schema so it can be loaded directly into our interactive resume editor.

CRITICAL INSTRUCTIONS FOR RESUME DATA EXTRACTION:
1. Extract ALL links, including LinkedIn (personalInfo.linkedin), GitHub (personalInfo.github), and personal portfolio/website (personalInfo.website). Ensure full URLs starting with https://.
2. For each project, extract the project name, tech stack into the 'technologies' array, live project URL into 'url', repository URL into 'githubUrl', and bullet achievements into 'highlights'.
3. Extract all certifications into 'certifications' (including issuer and credential IDs).
4. Extract all extracurricular activities, awards, honors, and competition achievements into 'achievements'.
5. Extract professional or academic references into 'references'.
6. Categorize technical skills logically (e.g. 'Programming Languages', 'Frontend Technologies', 'Backend & APIs', 'Databases & ORM', 'Cloud & DevOps', 'Tools & Frameworks').

Job Description:
${jobDescription || 'Standard Professional Role - Senior Level Tech / Management'}

Resume Text:
${resumeText}

Respond ONLY with a valid JSON object matching this schema:
{
  "contentScore": number (0-100 score on impact, quantified metrics, and active power verbs),
  "skillsScore": number (0-100 score on keyword alignment and skill density),
  "summary": string (2-3 sentence executive summary of candidate ATS compatibility and recruiter recommendation),
  "matchedSkills": string[] (Hard and soft skills identified in the resume that match the role),
  "missingKeywords": string[] (Crucial skills or industry keywords missing for this role),
  "bulletImprovements": [
    {
      "original": string (Exact sentence from the resume that is weak or passive),
      "improved": string (Rewritten using Google's X-Y-Z formula: "Accomplished [X], measured by [Y], by doing [Z]" with metrics),
      "reason": string (Why this change boosts ATS score and recruiter impression)
    }
  ],
  "extractedResume": {
    "personalInfo": {
      "fullName": string,
      "jobTitle": string,
      "email": string,
      "phone": string,
      "location": string,
      "linkedin": string,
      "github": string,
      "website": string
    },
    "summary": string,
    "experience": [
      {
        "id": string (e.g. "exp-1"),
        "company": string,
        "position": string,
        "location": string,
        "startDate": string,
        "endDate": string,
        "current": boolean,
        "highlights": string[]
      }
    ],
    "education": [
      {
        "id": string (e.g. "edu-1"),
        "institution": string,
        "degree": string,
        "fieldOfStudy": string,
        "location": string,
        "startDate": string,
        "endDate": string,
        "gpa": string,
        "highlights": string[]
      }
    ],
    "skills": [
      {
        "id": string (e.g. "sk-1"),
        "categoryName": string,
        "skills": string[]
      }
    ],
    "projects": [
      {
        "id": string (e.g. "proj-1"),
        "name": string,
        "description": string,
        "technologies": string[],
        "url": string,
        "githubUrl": string,
        "highlights": string[]
      }
    ],
    "certifications": [
      {
        "id": string (e.g. "cert-1"),
        "name": string,
        "issuer": string,
        "issueDate": string,
        "credentialId": string,
        "url": string
      }
    ],
    "achievements": [
      {
        "id": string (e.g. "ach-1"),
        "title": string
      }
    ],
    "references": [
      {
        "id": string (e.g. "ref-1"),
        "name": string,
        "designation": string,
        "institution": string,
        "email": string,
        "phone": string
      }
    ]
  }
}`;

    const response = await client.models.generateContent({
      model: getModelName(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const content = response.text || '{}';
    const cleanedJson = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanedJson);
    parsed._isAiGenerated = true;

    // Merge AI extracted data with deterministic parser to guarantee no links, projects, certs, or fields are missed
    const deterministicFallback = parseStructuredResumeFromText(resumeText, fileName, links);
    parsed.extractedResume = parsed.extractedResume
      ? mergeResumeData(parsed.extractedResume, deterministicFallback)
      : deterministicFallback;

    return parsed;
  } catch (error) {
    console.error('Gemini API Error, falling back to deterministic engine:', error);
    return generateFallbackAiAnalysis(resumeText, jobDescription, fileName, links);
  }
}

export async function optimizeBulletPointWithGemini(bulletText: string, isSummary = false): Promise<string> {
  const fallbackOptimization = () => {
    if (isSummary) {
      return generateSummaryImprovement(bulletText);
    }
    const imp = generateBulletImprovement(bulletText);
    return imp?.improved || bulletText;
  };

  const client = getGeminiClient();
  if (!client) {
    return fallbackOptimization();
  }

  try {
    const prompt = isSummary
      ? `You are an executive resume writer. Rewrite the following professional summary to be high-impact, ATS-optimized, concise, and compelling (between 300 and 500 characters). Do NOT include first-person pronouns like "I" or "my". Respond ONLY with the single rewritten summary text without quotes, markdown bullets, or conversational preamble.\n\nSummary:\n${bulletText}`
      : `You are an executive resume writer. Rewrite the following resume bullet point using Google's X-Y-Z formula: "Accomplished [X], measured by [Y], by doing [Z]".
Guidelines:
1. Start with a strong past-tense action verb (e.g. Spearheaded, Architected, Accelerated, Streamlined, Delivered).
2. Include realistic quantified metrics (percentage %, dollar $, or operational volume numbers).
3. Output a SINGLE concise bullet sentence.
4. Respond ONLY with the rewritten text without quotes, markdown bullet symbols, asterisks, bold markers, or conversational preamble.\n\nBullet Point:\n${bulletText}`;

    const response = await client.models.generateContent({
      model: getModelName(),
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    const result = response.text || '';
    if (!result || result.trim().length === 0) {
      return fallbackOptimization();
    }

    const cleaned = result
      .trim()
      .replace(/^["'`]|["'`]$/g, '')
      .replace(/^[•\-\*]\s*/, '')
      .replace(/\*\*/g, '')
      .trim();

    return cleaned || fallbackOptimization();
  } catch (error) {
    console.error('Gemini Bullet Optimization Error, falling back to deterministic engine:', error);
    return fallbackOptimization();
  }
}

export function fallbackStructuredResume(text: string, fileName?: string, links: string[] = []): ResumeContent {
  return parseStructuredResumeFromText(text, fileName, links);
}

function generateFallbackAiAnalysis(
  resumeText: string,
  _jobDescription?: string,
  fileName?: string,
  links: string[] = []
) {
  return {
    _isAiGenerated: false,
    contentScore: null,
    skillsScore: null,
    summary: null,
    matchedSkills: [],
    missingKeywords: [],
    bulletImprovements: [],
    extractedResume: parseStructuredResumeFromText(resumeText, fileName, links),
  };
}

export interface KeywordGapItem {
  keyword: string;
  category: 'core' | 'tool' | 'soft';
  importance: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface KeywordMatchAnalysis {
  matchScore: number;
  jobTitle: string;
  matchedKeywords: string[];
  missingKeywords: KeywordGapItem[];
  summary: string;
  keyRecommendations: string[];
  totalJdKeywords: number;
}

export function generateFallbackKeywordMatch(jobDescription: string, resumeText: string): KeywordMatchAnalysis {
  const jdSkills = extractSkillsFromText(jobDescription || '');
  const resumeSkills = extractSkillsFromText(resumeText || '');
  const lowerResume = (resumeText || '').toLowerCase();

  const matchedKeywords = jdSkills.filter(
    (skill) => resumeSkills.includes(skill) || lowerResume.includes(skill.toLowerCase())
  );
  const rawMissing = jdSkills.filter((skill) => !matchedKeywords.includes(skill));

  const missingKeywords: KeywordGapItem[] = rawMissing.map((skill, index) => {
    const isHigh = index < 4;
    return {
      keyword: skill,
      category: /git|docker|aws|linux|jira|figma|postman/i.test(skill)
        ? 'tool'
        : /leadership|communication|management|agile|scrum/i.test(skill)
        ? 'soft'
        : 'core',
      importance: isHigh ? 'high' : 'medium',
      recommendation: `Add "${skill}" to your Technical Skills section and mention a concrete project utilizing it.`,
    };
  });

  const totalJd = Math.max(1, jdSkills.length);
  const matchScore = jdSkills.length === 0 ? 80 : Math.round((matchedKeywords.length / totalJd) * 100);

  // Extract candidate job title from first line of JD
  const firstLine = (jobDescription || '').split('\n').map((l) => l.trim()).find((l) => l.length > 5 && l.length < 80);
  const jobTitle = firstLine || 'Target Position';

  return {
    matchScore: Math.min(100, Math.max(25, matchScore)),
    jobTitle,
    matchedKeywords,
    missingKeywords,
    totalJdKeywords: jdSkills.length,
    summary:
      matchScore >= 80
        ? `Strong candidate keyword alignment (${matchScore}% match). Your resume covers ${matchedKeywords.length} essential qualifications specified in the job posting.`
        : `Moderate keyword coverage (${matchScore}% match). The job description highlights ${missingKeywords.length} critical skills and tools that are missing from your resume. Adding these keywords will significantly reduce ATS filtering risk.`,
    keyRecommendations: [
      `Incorporate high-priority keywords (${missingKeywords.slice(0, 3).map((m) => m.keyword).join(', ')}) into your Technical Skills and Experience bullet points.`,
      'Mirror exact phrasing used in the job description rather than acronyms or synonyms.',
      'Quantify your experience with these tools using Google X-Y-Z formula metrics.',
    ],
  };
}

export async function matchJobKeywordsWithGemini(
  jobDescription: string,
  resumeText: string
): Promise<KeywordMatchAnalysis> {
  const client = getGeminiClient();

  if (!client || !jobDescription?.trim()) {
    return generateFallbackKeywordMatch(jobDescription, resumeText);
  }

  try {
    const prompt = `You are an enterprise Applicant Tracking System (ATS) algorithmic parser and senior recruiter.
Analyze the following Target Job Description against the Candidate Resume Text.
1. Extract all key hard skills, technical requirements, tools, and methodologies required by the job posting.
2. Determine which keywords exist in the candidate's resume ("matchedKeywords") and which are missing ("missingKeywords").
3. Assign each missing keyword a category ("core" | "tool" | "soft"), importance ("high" | "medium" | "low"), and a concise recommendation for where/how to add it to the resume.
4. Calculate an accurate ATS Keyword Match Percentage (0-100).

Target Job Description:
${jobDescription}

Candidate Resume Text:
${resumeText || 'No resume text provided.'}

Respond ONLY with valid JSON matching this schema:
{
  "matchScore": number (0-100),
  "jobTitle": string (Target role detected from Job Description),
  "matchedKeywords": string[],
  "missingKeywords": [
    {
      "keyword": string,
      "category": "core" | "tool" | "soft",
      "importance": "high" | "medium" | "low",
      "recommendation": string
    }
  ],
  "summary": string (2-3 sentences evaluating ATS filter pass likelihood and recruiter impressions),
  "keyRecommendations": string[]
}`;

    const response = await client.models.generateContent({
      model: getModelName(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    const matched = Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [];
    const missing = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];

    return {
      matchScore: typeof parsed.matchScore === 'number' ? parsed.matchScore : 72,
      jobTitle: parsed.jobTitle || 'Target Position',
      matchedKeywords: matched,
      missingKeywords: missing,
      totalJdKeywords: matched.length + missing.length,
      summary: parsed.summary || 'Keyword match analysis completed.',
      keyRecommendations: Array.isArray(parsed.keyRecommendations)
        ? parsed.keyRecommendations
        : ['Add missing core skills to Technical Skills section.'],
    };
  } catch (error) {
    console.error('Gemini keyword match error, using fallback:', error);
    return generateFallbackKeywordMatch(jobDescription, resumeText);
  }
}
