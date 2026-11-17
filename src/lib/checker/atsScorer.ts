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
  'achieved', 'architected', 'automated', 'built', 'collaborated', 'configured',
  'created', 'delivered', 'deployed', 'designed', 'developed', 'drove',
  'engineered', 'enhanced', 'established', 'executed', 'expanded', 'generated',
  'grew', 'implemented', 'improved', 'increased', 'integrated', 'launched',
  'led', 'maintained', 'managed', 'modernized', 'optimized', 'orchestrated',
  'piloted', 'pioneered', 'produced', 'reduced', 'refactored', 'resolved',
  'scaled', 'secured', 'served', 'spearheaded', 'streamlined', 'transformed',
  'upgraded'
];

function isQuantifiedOrTechnicalBullet(bullet: string): boolean {
  return /(\d+%|\$[\d,]+|\b\d+(\.\d+)?\s*(k|m|x|ghz|mbps|ms|gb|tb|users|clients|students|percent|gpa|skus|orders|items|portals|apis)\b|\b\d{2,}\b|oauth\s*2\.0|row-level\s+security|multi-tenant|real-time|cross-platform|full-stack|restful)/i.test(
    bullet
  );
}

export function getAtsScoreBreakdown(content?: ResumeContent | null): AtsScoreBreakdown {
  if (!content) {
    return {
      total: 0,
      sections: [],
      topTips: ['Add contact info and personal details to start scoring.'],
    };
  }

  const {
    personalInfo = { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    references = [],
  } = content;

  // 1. Contact Information (max 15)
  let contactScore = 0;
  const contactTips: string[] = [];
  if (personalInfo.fullName?.trim()) contactScore += 3; else contactTips.push('Add your full legal name');
  if (personalInfo.email?.trim()) contactScore += 3; else contactTips.push('Add a professional email address');
  if (personalInfo.phone?.trim()) contactScore += 3; else contactTips.push('Add a direct phone number with country code');
  if (personalInfo.location?.trim()) contactScore += 2; else contactTips.push('Add your location (City, Country)');
  if (personalInfo.linkedin?.trim()) contactScore += 2; else contactTips.push('Add your LinkedIn profile URL');
  if (personalInfo.github?.trim() || personalInfo.website?.trim()) contactScore += 2; else contactTips.push('Add GitHub or Portfolio website URL');

  // 2. Professional Summary (max 12)
  let summaryScore = 0;
  const summaryTips: string[] = [];
  if (summary && summary.trim().length > 0) {
    const len = summary.trim().length;
    if (len >= 140 && len <= 600) summaryScore += 8;
    else if (len >= 50 && len < 140) { summaryScore += 5; summaryTips.push('Expand summary to 150–500 characters'); }
    else if (len > 600) { summaryScore += 6; summaryTips.push('Keep summary concise (under 600 characters)'); }
    else { summaryScore += 3; summaryTips.push('Write a 2–4 sentence professional summary (150–500 chars)'); }

    if (!/\b(I|my|me)\b/i.test(summary)) summaryScore += 2;
    else summaryTips.push('Remove first-person pronouns ("I", "my", "me")');

    if (/\d|full-stack|software|engineer|developer|architect/i.test(summary)) summaryScore += 2;
    else summaryTips.push('Include role keywords, GPA, or years of experience in summary');
  } else {
    summaryTips.push('Add a 2–4 sentence professional summary');
  }

  // 3. Education & Degree (max 13)
  let educationScore = 0;
  const educationTips: string[] = [];
  if (education.length > 0) {
    educationScore += 5;
    const firstEdu = education[0];
    if (firstEdu.institution?.trim()) educationScore += 3; else educationTips.push('Add university / institution name');
    if (firstEdu.degree?.trim()) educationScore += 2; else educationTips.push('Add degree or qualification title');
    if (firstEdu.startDate || firstEdu.endDate) educationScore += 1.5; else educationTips.push('Add graduation dates / years');
    const hasGpaOrHighlights =
      Boolean(firstEdu.gpa?.trim()) ||
      Boolean(firstEdu.highlights && firstEdu.highlights.length > 0) ||
      education.some((e) => Boolean(e.gpa?.trim()) || Boolean(e.highlights && e.highlights.length > 0));
    if (hasGpaOrHighlights) educationScore += 1.5;
    else educationTips.push('Add cumulative GPA, academic honors, or exam rank');
  } else {
    educationTips.push('Add your academic degree or qualification');
  }

  // 4. Technical Skills (max 18)
  let skillsScore = 0;
  const skillsTips: string[] = [];
  const totalSkills = skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const categories = skills.filter((s) => s.categoryName?.trim() && s.skills?.length > 0).length;

  if (categories >= 4) skillsScore += 6;
  else if (categories >= 3) skillsScore += 5;
  else if (categories >= 2) { skillsScore += 3; skillsTips.push('Group skills into 3+ distinct categories'); }
  else if (categories >= 1) { skillsScore += 2; skillsTips.push('Group skills into 3+ distinct categories'); }
  else skillsTips.push('Create skill categories (e.g. Languages, Frontend, Backend)');

  if (totalSkills >= 15) skillsScore += 7;
  else if (totalSkills >= 10) { skillsScore += 5; skillsTips.push('Include 15+ relevant technical skills'); }
  else if (totalSkills >= 5) { skillsScore += 3; skillsTips.push('Include 15+ relevant technical skills'); }
  else if (totalSkills >= 1) { skillsScore += 1; skillsTips.push('Include 15+ relevant technical skills'); }
  else skillsTips.push('Add at least 10–15 industry skills');

  if (categories >= 3 && totalSkills >= 12) skillsScore += 5;
  else if (categories >= 2 && totalSkills >= 6) skillsScore += 3;

  // 5. Work Experience & Verbs (max 20)
  let experienceScore = 0;
  const experienceTips: string[] = [];
  let totalBullets = 0;
  let quantifiedBullets = 0;
  let actionVerbBullets = 0;

  if (experience.length > 0) {
    experienceScore += 6;
    experience.forEach((exp) => {
      if (exp.position?.trim()) experienceScore += 1;
      if (exp.company?.trim()) experienceScore += 1;
      if (exp.startDate || exp.endDate) experienceScore += 1;

      (exp.highlights || []).forEach((bullet) => {
        if (!bullet?.trim()) return;
        totalBullets++;
        if (isQuantifiedOrTechnicalBullet(bullet)) {
          quantifiedBullets++;
        }
        const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
        if (ACTION_VERBS.includes(firstWord)) {
          actionVerbBullets++;
        }
      });
    });

    // Also include project bullets when evaluating overall bullet depth for early-career / intern resumes
    const projectBullets = (projects || []).flatMap((p) => p.highlights || []).filter((b) => b?.trim());
    const combinedBulletCount = totalBullets + projectBullets.length;
    const combinedQuantCount =
      quantifiedBullets + projectBullets.filter((b) => isQuantifiedOrTechnicalBullet(b)).length;
    const combinedVerbCount =
      actionVerbBullets +
      projectBullets.filter((b) => {
        const fw = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
        return ACTION_VERBS.includes(fw);
      }).length;

    if (totalBullets >= 3 || combinedBulletCount >= 8) experienceScore += 3;
    else if (totalBullets >= 1) {
      experienceScore += 1.5;
      experienceTips.push('Include at least 3 impact bullets per work experience');
    } else {
      experienceTips.push('Add at least 3 bullet points describing your work impact');
    }

    if (combinedBulletCount > 0) {
      const quantRate = combinedQuantCount / combinedBulletCount;
      if (quantRate >= 0.45) experienceScore += 5;
      else if (quantRate >= 0.25) {
        experienceScore += 3.5;
        experienceTips.push('Add more quantified metrics (%, latency, users, scale) to bullets');
      } else {
        experienceScore += 1.5;
        experienceTips.push('Add quantified metrics (%, $, time saved, users) to experience bullets');
      }

      const verbRate = combinedVerbCount / combinedBulletCount;
      if (verbRate >= 0.6) experienceScore += 3;
      else if (verbRate >= 0.3) {
        experienceScore += 1.5;
        experienceTips.push('Start every bullet with a strong action verb (Engineered, Architected)');
      } else {
        experienceTips.push('Start bullets with strong action verbs (Engineered, Architected, Spearheaded)');
      }
    }
  } else {
    experienceTips.push('Add at least 1 work experience or internship role');
  }

  // 6. Key Projects & Tech Stack (max 14)
  let projectsScore = 0;
  const projectTips: string[] = [];
  if (projects && projects.length > 0) {
    projectsScore += 4;
    const projWithDetails = projects.filter(
      (p) => p.name?.trim() && (p.description?.trim() || (p.highlights && p.highlights.length > 0))
    ).length;
    if (projWithDetails >= 3) projectsScore += 5;
    else if (projWithDetails >= 2) projectsScore += 3.5;
    else if (projWithDetails >= 1) projectsScore += 2;
    else projectTips.push('Add detailed achievement bullets to projects');

    const projWithTech = projects.filter((p) => p.technologies && p.technologies.length > 0).length;
    if (projWithTech >= 3) projectsScore += 3;
    else if (projWithTech >= 1) projectsScore += 2;
    else projectTips.push('List tech stack tags (e.g. Next.js, PostgreSQL) on each project');

    const projWithLinks = projects.filter((p) => Boolean(p.url?.trim() || p.githubUrl?.trim())).length;
    if (projWithLinks >= 2) projectsScore += 2;
    else if (projWithLinks >= 1) projectsScore += 1;
    else projectTips.push('Include GitHub repository or live demo links for projects');
  } else {
    projectTips.push('Add 2–4 key technical projects');
  }

  // 7. Certifications, Honors & Referees (max 8)
  let extrasScore = 0;
  const extrasTips: string[] = [];
  if (certifications && certifications.length > 0) extrasScore += 4;
  else extrasTips.push('Add professional certifications or course credentials');
  if (achievements && achievements.length > 0) extrasScore += 2.5;
  else extrasTips.push('Add awards, university clubs, or competition achievements');
  if (references && references.length > 0) extrasScore += 1.5;

  const cappedContact = Math.min(15, Math.round(contactScore));
  const cappedSummary = Math.min(12, Math.round(summaryScore));
  const cappedEducation = Math.min(13, Math.round(educationScore));
  const cappedSkills = Math.min(18, Math.round(skillsScore));
  const cappedExperience = Math.min(20, Math.round(experienceScore));
  const cappedProjects = Math.min(14, Math.round(projectsScore));
  const cappedExtras = Math.min(8, Math.round(extrasScore));

  const total = Math.min(
    100,
    cappedContact +
      cappedSummary +
      cappedEducation +
      cappedSkills +
      cappedExperience +
      cappedProjects +
      cappedExtras
  );

  const sections: AtsScoreSection[] = [
    { name: 'Contact Information', score: cappedContact, max: 15, step: 0, tips: contactTips },
    { name: 'Professional Summary', score: cappedSummary, max: 12, step: 1, tips: summaryTips },
    { name: 'Education & Degree', score: cappedEducation, max: 13, step: 2, tips: educationTips },
    { name: 'Technical Skills', score: cappedSkills, max: 18, step: 3, tips: skillsTips },
    { name: 'Work Experience & Verbs', score: cappedExperience, max: 20, step: 4, tips: experienceTips },
    { name: 'Key Projects & Tech Stack', score: cappedProjects, max: 14, step: 5, tips: projectTips },
    { name: 'Certifications & Honors', score: cappedExtras, max: 8, step: 6, tips: extrasTips }
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
