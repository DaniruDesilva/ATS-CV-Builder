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

function hasImpactMetric(bullet: string): boolean {
  // Strip technology version / spec tokens so "OAuth 2.0", "2.4/5GHz", "2D", "HTML5", "CSS3", "ES6+" are not mistaken for impact metrics
  const cleaned = bullet
    .replace(/\b(oauth\s*2\.0|2\.4\/5\s*ghz|[23]d|html5|css3|es6\+|ipv[46]|sha-?\d+|base64|a4|v\d+(\.\d+)*)\b/gi, '')
    .trim();

  return /(\d+(\.\d+)?%|\$[\d,]+|\b\d+(\.\d+)?x\b|\b\d[\d,]*\+?\s*(k|m|million|billion|users|customers|clients|students|orders|skus|requests|records|queries|endpoints|downloads|installs|sessions|transactions|team|engineers|developers|members|hours|days|weeks|months|ms|seconds|mins|minutes|percent|gpa|portals|modules|tenants|institutes|teachers|brands| puzzles|levels)\b|\b\d{2,}\b)/i.test(
    cleaned
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
  if (personalInfo.jobTitle?.trim()) contactScore += 1; else contactTips.push('Add your target job title');
  if (personalInfo.email?.trim()) contactScore += 3; else contactTips.push('Add a professional email address');
  if (personalInfo.phone?.trim()) contactScore += 2.5; else contactTips.push('Add a direct phone number with country code');
  if (personalInfo.location?.trim()) contactScore += 1.5; else contactTips.push('Add your location (City, Country)');
  if (personalInfo.linkedin?.trim()) contactScore += 1.5; else contactTips.push('Add your LinkedIn profile URL');
  if (personalInfo.github?.trim()) contactScore += 1.5; else contactTips.push('Add your GitHub profile URL');
  if (personalInfo.website?.trim()) contactScore += 1; else contactTips.push('Add a personal portfolio or website URL');

  // 2. Professional Summary (max 12)
  let summaryScore = 0;
  const summaryTips: string[] = [];
  if (summary && summary.trim().length > 0) {
    const len = summary.trim().length;
    if (len >= 200 && len <= 500) summaryScore += 7;
    else if (len >= 120 && len < 200) { summaryScore += 5; summaryTips.push('Expand summary to 200–500 characters for optimal keyword density'); }
    else if (len > 500) { summaryScore += 5.5; summaryTips.push('Keep summary concise (between 200 and 500 characters)'); }
    else { summaryScore += 3; summaryTips.push('Write a 2–4 sentence professional summary (200–500 chars)'); }

    if (!/\b(I|my|me)\b/i.test(summary)) summaryScore += 2;
    else summaryTips.push('Remove first-person pronouns ("I", "my", "me")');

    // Check for measurable metric (%, years, GPA, N+ apps/projects/users)
    if (/(\d+(\.\d+)?%|\b\d+(\.\d+)?\s*gpa\b|\b\d+\+?\s*(years?|projects?|apps?|applications?|users?|clients?))/i.test(summary)) {
      summaryScore += 2;
    } else {
      summaryTips.push('Include a concrete metric in your summary (e.g. GPA, years of experience, or number of production apps shipped)');
    }

    if (/(\d+%|\b\d+\+\s*(projects?|apps?|users?|years?))/i.test(summary)) {
      summaryScore += 1;
    } else {
      summaryTips.push('Add a quantified impact figure (e.g. "5+ production apps" or "99.9% uptime") to your summary');
    }
  } else {
    summaryTips.push('Add a 2–4 sentence professional summary');
  }

  // 3. Education & Degree (max 13)
  let educationScore = 0;
  const educationTips: string[] = [];
  if (education.length > 0) {
    educationScore += 4;
    const firstEdu = education[0];
    if (firstEdu.institution?.trim()) educationScore += 3; else educationTips.push('Add university / institution name');
    if (firstEdu.degree?.trim()) educationScore += 2.5; else educationTips.push('Add degree or qualification title');
    if (firstEdu.startDate && firstEdu.endDate) educationScore += 1.5;
    else if (firstEdu.startDate || firstEdu.endDate) {
      educationScore += 1;
      educationTips.push('Include both start and graduation years for your primary degree');
    } else {
      educationTips.push('Add graduation dates / years');
    }
    const hasGpaOrHighlights =
      Boolean(firstEdu.gpa?.trim()) ||
      Boolean(firstEdu.highlights && firstEdu.highlights.length > 0) ||
      education.some((e) => Boolean(e.gpa?.trim()) || Boolean(e.highlights && e.highlights.length > 0));
    if (hasGpaOrHighlights) educationScore += 2;
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

  if (totalSkills >= 18) skillsScore += 7;
  else if (totalSkills >= 12) { skillsScore += 5.5; skillsTips.push('Include 18+ relevant technical skills across your stack'); }
  else if (totalSkills >= 6) { skillsScore += 3.5; skillsTips.push('Include 15+ relevant technical skills'); }
  else if (totalSkills >= 1) { skillsScore += 1.5; skillsTips.push('Include 15+ relevant technical skills'); }
  else skillsTips.push('Add at least 12–18 industry skills');

  if (categories >= 3 && totalSkills >= 15) skillsScore += 5;
  else if (categories >= 2 && totalSkills >= 8) skillsScore += 3;

  // 5. Work Experience & Verbs (max 20)
  let experienceScore = 0;
  const experienceTips: string[] = [];
  let totalExpBullets = 0;
  let quantifiedExpBullets = 0;
  let actionVerbExpBullets = 0;

  if (experience.length > 0) {
    experienceScore += 4;
    experience.forEach((exp) => {
      if (exp.position?.trim()) experienceScore += 1;
      if (exp.company?.trim()) experienceScore += 1;
      if (exp.startDate || exp.endDate) experienceScore += 1;

      (exp.highlights || []).forEach((bullet) => {
        if (!bullet?.trim()) return;
        totalExpBullets++;
        if (hasImpactMetric(bullet)) {
          quantifiedExpBullets++;
        }
        const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
        if (ACTION_VERBS.includes(firstWord)) {
          actionVerbExpBullets++;
        }
      });
    });
    // Cap base metadata score at 7
    experienceScore = Math.min(7, experienceScore);

    // Bullet depth in Work Experience (max 3)
    if (totalExpBullets >= 5) {
      experienceScore += 3;
    } else if (totalExpBullets >= 3) {
      experienceScore += 2;
      experienceTips.push('Add 1–2 more quantified achievement bullets to your work experience');
    } else if (totalExpBullets >= 1) {
      experienceScore += 1;
      experienceTips.push('Include at least 3–4 impact bullets per work experience');
    } else {
      experienceTips.push('Add at least 3 bullet points describing your work impact');
    }

    // True Quantification Rate in Experience (max 7)
    if (totalExpBullets > 0) {
      const expQuantRate = quantifiedExpBullets / totalExpBullets;
      if (expQuantRate >= 0.65) {
        experienceScore += 7;
      } else if (expQuantRate >= 0.33) {
        experienceScore += 4.5;
        experienceTips.push('Quantify at least 2/3 of your experience bullets with %, $, latency reduction, or user volume (use "AI Optimize")');
      } else {
        experienceScore += 1.5;
        experienceTips.push('Add measurable impact metrics (e.g. % latency reduction, 99.9% uptime, order volume) to experience bullets using "AI Optimize"');
      }

      // Strong Action Verbs (max 3)
      const verbRate = actionVerbExpBullets / totalExpBullets;
      if (verbRate >= 0.8) {
        experienceScore += 3;
      } else if (verbRate >= 0.5) {
        experienceScore += 2;
        experienceTips.push('Start every experience bullet with a strong action verb (Engineered, Architected, Spearheaded)');
      } else {
        experienceScore += 1;
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
    projectsScore += 3;
    const projWithDetails = projects.filter(
      (p) => p.name?.trim() && (p.description?.trim() || (p.highlights && p.highlights.length > 0))
    ).length;
    if (projWithDetails >= 3) projectsScore += 3;
    else if (projWithDetails >= 2) projectsScore += 2;
    else if (projWithDetails >= 1) projectsScore += 1;
    else projectTips.push('Add detailed achievement bullets to projects');

    const projWithTech = projects.filter((p) => p.technologies && p.technologies.length > 0).length;
    if (projWithTech >= 3) projectsScore += 3;
    else if (projWithTech >= 1) projectsScore += 1.5;
    else projectTips.push('List tech stack tags (e.g. Next.js, PostgreSQL) on each project');

    const projWithLinks = projects.filter((p) => Boolean(p.url?.trim() || p.githubUrl?.trim())).length;
    if (projWithLinks >= 3) projectsScore += 2;
    else if (projWithLinks >= 1) projectsScore += 1;
    else projectTips.push('Include GitHub repository or live demo links for projects');

    // Check quantified metrics in project bullets (max 3)
    const projectBullets = projects.flatMap((p) => p.highlights || []).filter((b) => b?.trim());
    const quantProjBullets = projectBullets.filter((b) => hasImpactMetric(b)).length;
    const projQuantRate = projectBullets.length > 0 ? quantProjBullets / projectBullets.length : 0;
    if (projQuantRate >= 0.5) {
      projectsScore += 3;
    } else if (projQuantRate >= 0.25) {
      projectsScore += 2;
      projectTips.push('Add measurable impact numbers (%, users, latency, scale) to more project bullets');
    } else {
      projectsScore += 1;
      projectTips.push('Quantify project bullets with concrete metrics (e.g. % speed improvement, user count, or dataset scale)');
    }
  } else {
    projectTips.push('Add 2–4 key technical projects');
  }

  // 7. Certifications, Honors & Referees (max 8)
  let extrasScore = 0;
  const extrasTips: string[] = [];
  if (certifications && certifications.length > 0) {
    extrasScore += 3;
    const hasCredId = certifications.some((c) => Boolean(c.credentialId?.trim()));
    if (hasCredId) {
      extrasScore += 1;
    } else {
      extrasTips.push('Add certificate credential IDs or verification codes in Certifications');
    }
  } else {
    extrasTips.push('Add professional certifications or course credentials');
  }
  if (achievements && achievements.length > 0) extrasScore += 2.5;
  else extrasTips.push('Add awards, university clubs, or competition achievements');
  if (references && references.length > 0) extrasScore += 1.5;
  else extrasTips.push('Add at least 1 academic or professional referee');

  const capSection = (raw: number, max: number, hasTips: boolean): number => {
    const rounded = Math.min(max, Math.round(raw));
    // Never display max/max if there are still actionable improvement tips for that section
    if (hasTips && rounded >= max) {
      return Math.max(0, max - 1);
    }
    return rounded;
  };

  const cappedContact = capSection(contactScore, 15, contactTips.length > 0);
  const cappedSummary = capSection(summaryScore, 12, summaryTips.length > 0);
  const cappedEducation = capSection(educationScore, 13, educationTips.length > 0);
  const cappedSkills = capSection(skillsScore, 18, skillsTips.length > 0);
  const cappedExperience = capSection(experienceScore, 20, experienceTips.length > 0);
  const cappedProjects = capSection(projectsScore, 14, projectTips.length > 0);
  const cappedExtras = capSection(extrasScore, 8, extrasTips.length > 0);

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
