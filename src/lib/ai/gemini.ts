import { GoogleGenAI } from '@google/genai';
import { generateBulletImprovement, generateSummaryImprovement } from '@/lib/checker/ruleEngine';
import { ResumeContent } from '@/types/resume';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

function getGeminiClient(): GoogleGenAI | null {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export async function analyzeResumeWithGemini(resumeText: string, jobDescription?: string, fileName?: string) {
  const client = getGeminiClient();

  if (!client) {
    console.warn('GEMINI_API_KEY is missing. Using heuristic fallback evaluation.');
    return generateFallbackAiAnalysis(resumeText, jobDescription, fileName);
  }

  try {
    const prompt = `You are an enterprise Applicant Tracking System (ATS) algorithmic parser and senior technical recruiter.
Evaluate the following resume text against the target job description (if provided, otherwise evaluate against modern industry standards).
Also accurately parse and structure the candidate's actual resume into the provided JSON schema so it can be loaded directly into our interactive resume editor.

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
    ]
  }
}`;

    const response = await client.models.generateContent({
      model: modelName,
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

    // Ensure extractedResume has valid structure
    if (!parsed.extractedResume) {
      parsed.extractedResume = fallbackStructuredResume(resumeText, fileName);
    }

    return parsed;
  } catch (error) {
    console.error('Gemini API Error, falling back to deterministic engine:', error);
    return generateFallbackAiAnalysis(resumeText, jobDescription, fileName);
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
      model: modelName,
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

export function fallbackStructuredResume(text: string, fileName?: string): ResumeContent {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  
  // 1. Name: first line that doesn't look like an email/phone or header
  const nameCandidate = lines.find((l) => l.length < 50 && !l.includes('@') && !/\d{5,}/.test(l) && !/resume|curriculum|cv/i.test(l));
  const fallbackName = fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '';
  const fullName = nameCandidate || fallbackName || 'Candidate';

  // 2. Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // 3. Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 4. LinkedIn & GitHub & Website
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '';

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '';

  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|dev|io|me|org|net))(?:\/[^\s]*)?/i);
  const website = websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github')
    ? (websiteMatch[0].startsWith('http') ? websiteMatch[0] : `https://${websiteMatch[0]}`)
    : '';

  // 5. Detect Skills from Common Tech Dictionary
  const commonTech = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express',
    'Python', 'Java', 'C++', 'C#', 'PHP', 'Dart', 'Flutter', 'HTML5', 'CSS3',
    'Tailwind CSS', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase',
    'Firebase', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'GitHub',
    'REST APIs', 'GraphQL', 'Prisma', 'Linux', 'CI/CD', 'Figma'
  ];
  const detectedSkills = commonTech.filter((skill) => {
    const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  });

  const skills = detectedSkills.length > 0
    ? [{ id: 'sk-1', categoryName: 'Technical Skills', skills: detectedSkills }]
    : [];

  // 6. Detect Target Job Title candidate
  const titleKeywords = [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer',
    'Backend Developer', 'Software Engineering Intern', 'Web Developer',
    'DevOps Engineer', 'Mobile Application Developer', 'Data Scientist',
    'Product Manager', 'Project Manager', 'UI/UX Designer', 'Cloud Architect'
  ];
  const matchedTitle = titleKeywords.find((tk) => new RegExp(`\\b${tk}\\b`, 'i').test(text)) || '';

  return {
    personalInfo: {
      fullName,
      jobTitle: matchedTitle,
      email,
      phone,
      location: '',
      website,
      linkedin,
      github,
    },
    summary: '',
    experience: [],
    education: [],
    skills,
    projects: [],
    certifications: [],
    achievements: [],
    references: [],
  };
}

function generateFallbackAiAnalysis(resumeText: string, _jobDescription?: string, fileName?: string) {
  return {
    _isAiGenerated: false,
    contentScore: null,
    skillsScore: null,
    summary: null,
    matchedSkills: [],
    missingKeywords: [],
    bulletImprovements: [],
    extractedResume: fallbackStructuredResume(resumeText, fileName),
  };
}
