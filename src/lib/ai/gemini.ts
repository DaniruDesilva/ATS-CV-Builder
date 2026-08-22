import { analyzeResumeWithOpenRouter, optimizeBulletPointWithOpenRouter } from './openrouter';

export async function analyzeResumeWithGemini(resumeText: string, jobDescription?: string) {
  return analyzeResumeWithOpenRouter(resumeText, jobDescription);
}

export async function optimizeBulletPointWithGemini(bulletText: string, isSummary = false): Promise<string> {
  return optimizeBulletPointWithOpenRouter(bulletText, isSummary);
}

