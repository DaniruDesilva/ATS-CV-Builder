import { GoogleGenAI } from '@google/genai';
import { generateBulletImprovement, generateSummaryImprovement } from '@/lib/checker/ruleEngine';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

function getGeminiClient(): GoogleGenAI | null {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export async function analyzeResumeWithGemini(resumeText: string, jobDescription?: string) {
  const client = getGeminiClient();

  if (!client) {
    console.warn('GEMINI_API_KEY is missing. Using heuristic fallback evaluation.');
    return generateFallbackAiAnalysis(resumeText, jobDescription);
  }

  try {
    const prompt = `You are an enterprise Applicant Tracking System (ATS) algorithmic parser and senior technical recruiter.
Evaluate the following resume text against the target job description (if provided, otherwise evaluate against modern industry standards).

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
  ]
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
    return parsed;
  } catch (error) {
    console.error('Gemini API Error, falling back to deterministic engine:', error);
    return generateFallbackAiAnalysis(resumeText, jobDescription);
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

    // Clean any residual quotes, bullets, or asterisks
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

function generateFallbackAiAnalysis(_resumeText: string, _jobDescription?: string) {
  return {
    _isAiGenerated: false,
    contentScore: null,
    skillsScore: null,
    summary: null,
    matchedSkills: [],
    missingKeywords: [],
    bulletImprovements: [],
  };
}
