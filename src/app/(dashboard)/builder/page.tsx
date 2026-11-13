'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TemplateId } from '@/types/resume';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { FormStepper, STEPS } from '@/components/builder/FormStepper';
import { ContactForm } from '@/components/builder/forms/ContactForm';
import { SummaryForm } from '@/components/builder/forms/SummaryForm';
import { EducationForm } from '@/components/builder/forms/EducationForm';
import { SkillsForm } from '@/components/builder/forms/SkillsForm';
import { ExperienceForm } from '@/components/builder/forms/ExperienceForm';
import { ProjectsForm } from '@/components/builder/forms/ProjectsForm';
import { CertificationsForm } from '@/components/builder/forms/CertificationsForm';
import { AchievementsForm } from '@/components/builder/forms/AchievementsForm';
import { ReferencesForm } from '@/components/builder/forms/ReferencesForm';
import { LivePreview } from '@/components/builder/LivePreview';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Palette,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
  Check,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const {
    title,
    setTitle,
    activeStep,
    setActiveStep,
    loadSampleData,
    resetToEmpty,
    templateId,
    setTemplateId,
    content
  } = useResumeStore();

  useEffect(() => {
    const tpl = searchParams.get('template');
    if (tpl && ['traditional-ats', 'classic-ats', 'modern-executive', 'technical-clean'].includes(tpl)) {
      setTemplateId(tpl as TemplateId);
    }
    const step = searchParams.get('step');
    if (step !== null) {
      const stepNum = parseInt(step, 10);
      if (!isNaN(stepNum) && stepNum >= 0 && stepNum < STEPS.length) {
        setActiveStep(stepNum);
      }
    }
  }, [searchParams, setTemplateId, setActiveStep]);

  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // ── Comprehensive Real-Time ATS Score Engine with Detailed Breakdown ──
  const getAtsDetails = () => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements } = content;

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
    if (summary) {
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
    const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);
    const categories = skills.filter((s) => s.categoryName?.trim() && s.skills.length > 0).length;

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
    const actionVerbs = [
      'achieved', 'architected', 'automated', 'built', 'created', 'delivered',
      'deployed', 'designed', 'developed', 'drove', 'engineered', 'enhanced', 'established',
      'executed', 'generated', 'grew', 'implemented', 'improved', 'increased', 'integrated',
      'launched', 'led', 'managed', 'modernized', 'optimized', 'orchestrated', 'piloted',
      'pioneered', 'produced', 'reduced', 'refactored', 'resolved', 'scaled', 'spearheaded',
      'streamlined', 'transformed', 'upgraded'
    ];

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
          if (actionVerbs.includes(firstWord)) {
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

    return {
      total,
      sections: [
        { name: 'Contact Information', score: Math.min(15, Math.round(contactScore)), max: 15, step: 0, tips: contactTips },
        { name: 'Professional Summary', score: Math.min(10, Math.round(summaryScore)), max: 10, step: 1, tips: summaryTips },
        { name: 'Education & Degree', score: Math.min(10, Math.round(educationScore)), max: 10, step: 2, tips: educationTips },
        { name: 'Technical Skills', score: Math.min(15, Math.round(skillsScore)), max: 15, step: 3, tips: skillsTips },
        { name: 'Work Experience & Verbs', score: Math.min(20, Math.round(experienceScore)), max: 20, step: 4, tips: experienceTips },
        { name: 'Key Projects & Tech Stack', score: Math.min(10, Math.round(projectsScore)), max: 10, step: 5, tips: projectTips },
        { name: 'Certifications & Honors', score: Math.min(5, Math.round(extrasScore)), max: 5, step: 6, tips: extrasTips }
      ]
    };
  };

  const atsData = getAtsDetails();
  const atsScore = atsData.total;

  const renderActiveStepForm = () => {
    switch (activeStep) {
      case 0:
        return <ContactForm />;
      case 1:
        return <SummaryForm />;
      case 2:
        return <EducationForm />;
      case 3:
        return <SkillsForm />;
      case 4:
        return <ExperienceForm />;
      case 5:
        return <ProjectsForm />;
      case 6:
        return <CertificationsForm />;
      case 7:
        return <AchievementsForm />;
      case 8:
        return <ReferencesForm />;
      case 9:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" /> Choose ATS Template
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                All templates are engineered with clean single-column structure and guaranteed 100% ATS parseability.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTemplateId('traditional-ats')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  templateId === 'traditional-ats'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Traditional ATS (Gold Standard)</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold">
                    Top Tech Pick
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  The quintessential Ivy League / Software Engineering standard. Centered contact header with horizontal rules.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplateId('classic-ats')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  templateId === 'classic-ats'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Classic ATS Modern</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                    Most Popular
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Clean sans-serif layout with subtle dividers, ideal for general software and tech roles.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplateId('modern-executive')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  templateId === 'modern-executive'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Modern Executive</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">
                    Leadership
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Sleek accent bar with emphasized branding and clean typography.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplateId('technical-clean')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  templateId === 'technical-clean'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Technical Clean</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold">
                    Tech Stack First
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Prominently highlights technical skills and system architecture projects.
                </p>
              </button>
            </div>
          </div>
        );
      default:
        return <ContactForm />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 w-full animate-fade-in">
      
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 min-w-[240px] transition-colors"
          />
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-Saved
          </span>
        </div>

        {/* Live ATS Score Indicator Meter - Clickable for details modal */}
        <button
          type="button"
          onClick={() => setShowScoreModal(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 transition-all cursor-pointer group"
          title="Click to view ATS Score Breakdown & Recommendations"
        >
          <ShieldCheck className={`w-4 h-4 ${atsScore >= 80 ? 'text-emerald-600' : 'text-amber-500'}`} />
          <span className="text-xs font-bold text-slate-700">Live ATS Score:</span>
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-md ${
              atsScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {atsScore}/100
          </span>
          <span className="text-[11px] text-emerald-700 font-bold underline opacity-80 group-hover:opacity-100 ml-0.5">
            Tips
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Sample
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          <Link
            href="/checker"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-sm transition-all ml-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Scan with Checker →
          </Link>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form Pane */}
        <div className="lg:col-span-6 space-y-4">
          <FormStepper />

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 min-h-[520px] flex flex-col justify-between shadow-sm">
            <div>{renderActiveStepForm()}</div>

            {/* Stepper Navigation Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-8">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs text-slate-400 font-semibold">
                Step {activeStep + 1} of {STEPS.length}
              </span>

              <button
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold disabled:opacity-40 transition-colors shadow-sm"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Pane */}
        <div className="lg:col-span-6 sticky top-20">
          <LivePreview />
        </div>
      </div>

      {/* ── ATS SCORE BREAKDOWN MODAL ── */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live ATS Score Breakdown</h3>
                  <p className="text-xs text-slate-500">Real-time algorithmic quality assessment</p>
                </div>
              </div>
              <button
                onClick={() => setShowScoreModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Overview Gauge */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Current Standing</span>
                <h4 className="text-2xl font-black text-emerald-950 mt-0.5">
                  {atsScore}/100{' '}
                  <span className="text-xs font-bold text-emerald-700 ml-1">
                    {atsScore >= 85 ? '✓ Top 5% ATS Ready' : atsScore >= 70 ? '• Strong Foundation' : '⚠️ Action Needed'}
                  </span>
                </h4>
                <p className="text-xs text-emerald-800/80 mt-1 max-w-sm">
                  {atsScore >= 85
                    ? 'Excellent job! Your resume meets high-tier enterprise ATS parsing standards.'
                    : 'Address the section recommendations below to boost your interview callback rate.'}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center font-black text-lg text-emerald-800 shadow-sm shrink-0">
                {atsScore}
              </div>
            </div>

            {/* Category Score Bars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Category Points Breakdown</h4>
              <div className="space-y-2.5">
                {atsData.sections.map((sec) => (
                  <div key={sec.name} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{sec.name}</span>
                      <span className="font-black text-emerald-700">
                        {sec.score} / {sec.max} pts
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${(sec.score / sec.max) * 100}%` }}
                      />
                    </div>

                    {/* Recommendations */}
                    {sec.tips.length > 0 && (
                      <div className="pt-1 space-y-1">
                        {sec.tips.map((tip, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2 text-xs text-amber-800 bg-amber-50/70 border border-amber-200/70 rounded-lg p-1.5">
                            <span className="flex items-center gap-1 font-medium">
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              {tip}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveStep(sec.step);
                                setShowScoreModal(false);
                              }}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 flex items-center gap-0.5"
                            >
                              Fix <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Close &amp; Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESET CONFIRMATION MODAL ── */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Resume Content?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will clear all contact details, work experience, education, and skills back to an empty draft. This action cannot be undone.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
              <span className="font-bold">Tip:</span> If you just want to test, you can click <span className="font-semibold text-emerald-700">&quot;Load Sample&quot;</span> at any time to repopulate standard Ivy League tech software engineer data.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToEmpty();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-semibold text-slate-400">Loading CV Builder...</div>}>
      <BuilderPageContent />
    </Suspense>
  );
}
