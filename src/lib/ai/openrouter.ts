import OpenAI from 'openai';
import { generateBulletImprovement, generateSummaryImprovement } from '@/lib/checker/ruleEngine';

const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '';
const modelName = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

export function getOpenRouterClient() {
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://ats-cv-builder.local',
      'X-Title': 'ATS CV Builder & Checker',
    },
  });
}

export async function analyzeResumeWithOpenRouter(resumeText: string, jobDescription?: string) {
  const client = getOpenRouterClient();

  if (!client) {
    console.warn('OPENROUTER_API_KEY is missing. Using heuristic fallback evaluation.');
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
  "contentScore": number (0-100 score on impact and action verbs),
  "skillsScore": number (0-100 score on keyword alignment and skill density),
  "summary": string (Executive summary of candidate ATS compatibility),
  "matchedSkills": string[] (Hard and soft skills identified in the resume),
  "missingKeywords": string[] (Crucial keywords missing for this role),
  "bulletImprovements": [
    {
      "original": string,
      "improved": string (Rewritten using Google's X-Y-Z formula: "Accomplished [X], measured by [Y], by doing [Z]"),
      "reason": string
    }
  ]
}`;

    const completion = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an ATS resume evaluator. You MUST respond with raw valid JSON only. Do not include markdown codeblocks or extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const cleanedJson = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanedJson);
    parsed._isAiGenerated = true;
    return parsed;
  } catch (error) {
    console.error('OpenRouter API Error, falling back to deterministic engine:', error);
    return generateFallbackAiAnalysis(resumeText, jobDescription);
  }
}

export async function optimizeBulletPointWithOpenRouter(bulletText: string, isSummary = false): Promise<string> {
  const fallbackOptimization = () => {
    if (isSummary) {
      return generateSummaryImprovement(bulletText);
    }
    const imp = generateBulletImprovement(bulletText);
    return imp?.improved || bulletText;
  };

  const client = getOpenRouterClient();
  if (!client) {
    return fallbackOptimization();
  }

  try {
    const prompt = isSummary
      ? `Rewrite the following professional summary to be high-impact, ATS-optimized, and compelling. Keep it under 400 characters.\n\nSummary:\n${bulletText}`
      : `Rewrite the following resume bullet point using Google's X-Y-Z formula ("Accomplished [X], measured by [Y], by doing [Z]"). Include strong action verbs and quantified metrics.\n\nBullet Point:\n${bulletText}`;

    const completion = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an executive resume writer. Respond ONLY with the rewritten text without quotes or preamble.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const result = completion.choices[0]?.message?.content || '';
    if (!result || result.trim().length === 0) {
      return fallbackOptimization();
    }
    return result.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('OpenRouter Bullet Optimization Error, falling back to deterministic engine:', error);
    return fallbackOptimization();
  }
}

function generateFallbackAiAnalysis(_resumeText: string, _jobDescription?: string) {
  // Return neutral values — the comprehensive deterministic rule engine
  // in ruleEngine.ts handles all actual scoring and analysis.
  return {
    _isAiGenerated: false,
    contentScore: null,
    skillsScore: null,
    summary: null,
    matchedSkills: [],
    missingKeywords: [],
    bulletImprovements: []
  };
}
