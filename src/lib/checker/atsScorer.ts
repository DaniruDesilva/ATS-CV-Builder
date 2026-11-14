import { ResumeContent } from '@/types/resume';

export interface AtsScoreSection {
  name: string;
  score: number;
  max: number;
  step: number;
  tips: string[];
}

export interface AtsScoreBreakdown {
  total: number;
  sections: AtsScoreSection[];
  topTips: string[];
}

const ACTION_VERBS = [
  'achieved', 'architected', 'automated', 'built', 'created', 'delivered',
  'deployed', 'designed', 'developed', 'drove', 'engineered', 'enhanced', 'established',
  'executed', 'generated', 'grew', 'implemented', 'improved', 'increased', 'integrated',
  'launched', 'led', 'managed', 'modernized', 'optimized', 'orchestrated', 'piloted',
  'pioneered', 'produced', 'reduced', 'refactored', 'resolved', 'scaled', 'spearheaded',
  'streamlined', 'transformed', 'upgraded'
];

export function getAtsScoreBreakdown(content?: ResumeContent | null): AtsScoreBreakdown {
  if (!content) {
    return {
      total: 0,
      sections: [],
      topTips: ['Add contact info and personal details to start scoring.'],
    };
  }

  const {
    personalInfo = { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = []
  } = content;

  // Contact (max 15)
  let contactScore = 0;
  const contactTips: string[] = [];
  if (personalInfo.fullName?.trim()) contactScore += 3; else contactTips.push('Add your full legal name');
  if (personalInfo.email?.trim()) contactScore += 3; else contactTips.push('Add a professional email address');
  if (personalInfo.phone?.trim()) contactScore += 3; else contactTips.push('Add a direct phone number with country code');
  if (personalInfo.location?.trim()) contactScore += 2; else contactTips.push('Add your location (City, Country)');
  if (personalInfo.linkedin?.trim()) contactScore += 2; else contactTips.push('Add your LinkedIn profile URL');
  if (personalInfo.github?.trim() || personalInfo.website?.trim()) contactScore += 2; else contactTips.push('Add GitHub or Portfolio website URL');

  // Summary (max 10)
  let summaryScore = 0;
  const summaryTips: string[] = [];
  if (summary && summary.trim().length > 0) {
    const len = summary.trim().length;
    if (len >= 150 && len <= 500) summaryScore += 7;
    else if (len >= 50 && len < 150) { summaryScore += 4; summaryTips.push('Expand summary to 150–500 characters'); }
    else if (len > 500) { summaryScore += 5; summaryTips.push('Shorten summary to under 500 characters'); }
    else { summaryScore += 2; summaryTips.push('Write a professional summary (150–500 chars)'); }

    if (!/\b(I|my|me)\b/i.test(summary)) summaryScore += 2;
    else summaryTips.push('Remove first-person pronouns ("I", "my", "me")');

    if (/\d/.test(summary)) summaryScore += 1;
    else summaryTips.push('Include numerical metrics or years of experience');
  } else {
    summaryTips.push('Add a 2–4 sentence professional summary');
  }

  // Education (max 10)
  let educationScore = 0;
  const educationTips: string[] = [];
  if (education.length > 0) {
    educationScore += 4;
    const firstEdu = education[0];
    if (firstEdu.institution?.trim()) educationScore += 2; else educationTips.push('Add university / institution name');
    if (firstEdu.degree?.trim()) educationScore += 2; else educationTips.push('Add degree title');
    if (firstEdu.startDate || firstEdu.endDate) educationScore += 1; else educationTips.push('Add graduation dates / years');
    if (firstEdu.gpa?.trim()) educationScore += 1; else educationTips.push('Add cumulative GPA, honors, or rank');
  } else {
    educationTips.push('Add your academic degree or qualification');
  }

  // Skills (max 15)
  let skillsScore = 0;
  const skillsTips: string[] = [];
  const totalSkills = skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const categories = skills.filter((s) => s.categoryName?.trim() && s.skills?.length > 0).length;

  if (categories >= 3) skillsScore += 5;
  else if (categories >= 2) { skillsScore += 3; skillsTips.push('Group skills into 3+ distinct categories'); }
  else if (categories >= 1) { skillsScore += 2; skillsTips.push('Group skills into 3+ distinct categories'); }
  else skillsTips.push('Create skill categories (e.g. Languages, Frontend, Backend)');

  if (totalSkills >= 15) skillsScore += 5;
  else if (totalSkills >= 8) { skillsScore += 4; skillsTips.push('Include 15+ relevant technical skills'); }
  else if (totalSkills >= 4) { skillsScore += 2; skillsTips.push('Include 15+ relevant technical skills'); }
  else if (totalSkills >= 1) { skillsScore += 1; skillsTips.push('Include 15+ relevant technical skills'); }
  else skillsTips.push('Add at least 8–15 industry skills');

  if (categories >= 2 && totalSkills >= 6) skillsScore += 5;
  else if (categories >= 1 && totalSkills >= 3) skillsScore += 3;

  // Experience (max 20)
  let experienceScore = 0;
  const experienceTips: string[] = [];
  let totalBullets = 0;
  let quantifiedBullets = 0;
  let actionVerbBullets = 0;

  if (experience.length > 0) {
    experienceScore += 5;
    experience.forEach((exp) => {
      if (exp.position?.trim()) experienceScore += 0.5;
      if (exp.company?.trim()) experienceScore += 0.5;
      if (exp.startDate) experienceScore += 0.25;

      (exp.highlights || []).forEach((bullet) => {
        if (!bullet?.trim()) return;
        totalBullets++;
        if (/(\d+%|\$[\d,]+|\b\d+\s*(k|m|users|clients|percent|x)\b|\b\d{2,}\b)/i.test(bullet)) {
          quantifiedBullets++;
        }
        const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
        if (ACTION_VERBS.includes(firstWord)) {
          actionVerbBullets++;
        }
      });
    });

    if (totalBullets >= 8) experienceScore += 3;
    else if (totalBullets >= 4) experienceScore += 2;
    else if (totalBullets >= 1) experienceScore += 1;
    else experienceTips.push('Add at least 3-4 bullet points per work experience');

    if (totalBullets > 0) {
      const quantRate = quantifiedBullets / totalBullets;
      if (quantRate >= 0.5) experienceScore += 5;
      else if (quantRate >= 0.3) { experienceScore += 3; experienceTips.push('Quantify 50%+ of bullets with %, $, or metrics'); }
      else { experienceScore += 1; experienceTips.push('Add quantified metrics (%, $, time saved, users) to experience bullets'); }

      const verbRate = actionVerbBullets / totalBullets;
      if (verbRate >= 0.5) experienceScore += 2;
      else if (verbRate >= 0.2) { experienceScore += 1; experienceTips.push('Start bullets with strong action verbs (Engineered, Architected)'); }
      else experienceTips.push('Start bullets with strong action verbs (Engineered, Architected, Spearheaded)');
    }
  } else {
    experienceTips.push('Add at least 1 work experience or internship role');
  }

  // Projects (max 10)
  let projectsScore = 0;
  const projectTips: string[] = [];
  if (projects && projects.length > 0) {
    projectsScore += 3;
    const projWithDetails = projects.filter(
      (p) => p.name?.trim() && (p.description?.trim() || (p.highlights && p.highlights.length > 0))
    ).length;
    if (projWithDetails >= 3) projectsScore += 4;
    else if (projWithDetails >= 2) projectsScore += 3;
    else if (projWithDetails >= 1) projectsScore += 2;
    else projectTips.push('Add detailed feature bullets to projects');

    const projWithTech = projects.filter((p) => p.technologies && p.technologies.length > 0).length;
    if (projWithTech >= 2) projectsScore += 3;
    else if (projWithTech >= 1) projectsScore += 2;
    else projectTips.push('List tech stack tags (e.g. Next.js, PostgreSQL) on each project');
  } else {
    projectTips.push('Add 2–3 key software projects');
  }

  // Extras (max 5)
  let extrasScore = 0;
  const extrasTips: string[] = [];
  if (certifications && certifications.length > 0) extrasScore += 3;
  else extrasTips.push('Add professional certifications or online course credentials');
  if (achievements && achievements.length > 0) extrasScore += 2;
  else extrasTips.push('Add awards, university honors, or hackathon achievements');

  const total = Math.min(
    100,
    Math.round(
      contactScore + summaryScore + educationScore + skillsScore +
      Math.min(20, experienceScore) + Math.min(10, projectsScore) + extrasScore
    )
  );

  const sections: AtsScoreSection[] = [
    { name: 'Contact Information', score: Math.min(15, Math.round(contactScore)), max: 15, step: 0, tips: contactTips },
    { name: 'Professional Summary', score: Math.min(10, Math.round(summaryScore)), max: 10, step: 1, tips: summaryTips },
    { name: 'Education & Degree', score: Math.min(10, Math.round(educationScore)), max: 10, step: 2, tips: educationTips },
    { name: 'Technical Skills', score: Math.min(15, Math.round(skillsScore)), max: 15, step: 3, tips: skillsTips },
    { name: 'Work Experience & Verbs', score: Math.min(20, Math.round(experienceScore)), max: 20, step: 4, tips: experienceTips },
    { name: 'Key Projects & Tech Stack', score: Math.min(10, Math.round(projectsScore)), max: 10, step: 5, tips: projectTips },
    { name: 'Certifications & Honors', score: Math.min(5, Math.round(extrasScore)), max: 5, step: 6, tips: extrasTips }
  ];

  const topTips = [
    ...experienceTips,
    ...skillsTips,
    ...summaryTips,
    ...contactTips,
    ...projectTips,
    ...educationTips,
    ...extrasTips,
  ].slice(0, 5);

  return { total, sections, topTips };
}

export function calculateResumeAtsScore(content?: ResumeContent | null): number {
  return getAtsScoreBreakdown(content).total;
}
