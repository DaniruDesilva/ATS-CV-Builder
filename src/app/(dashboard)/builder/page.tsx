'use client';

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
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function BuilderPage() {
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

  // Real-time ATS Content Score Engine
  const calculateAtsScore = () => {
    let score = 0;
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements } = content;
    
    if (personalInfo.fullName) score += 5;
    if (personalInfo.email) score += 5;
    if (personalInfo.phone) score += 5;
    if (personalInfo.location) score += 5;
    if (personalInfo.linkedin || personalInfo.github) score += 5;
    
    if (summary && summary.length > 40) score += 10;
    
    if (education.length > 0) score += 10;
    
    if (skills.length > 0 && skills.some((s) => s.skills.length > 0)) score += 15;

    if (experience.length > 0) {
      score += 15;
      const totalExpHighlights = experience.reduce((acc, e) => acc + (e.highlights?.length || 0), 0);
      if (totalExpHighlights >= 2) score += 5;
    }
    
    if (projects && projects.length > 0) {
      score += 10;
      const totalProjHighlights = projects.reduce((acc, p) => acc + (p.highlights?.length || 0), 0);
      if (totalProjHighlights >= 2) score += 5;
    }

    if (certifications && certifications.length > 0) score += 5;
    if (achievements && achievements.length > 0) score += 5;
    
    return Math.min(100, score);
  };

  const atsScore = calculateAtsScore();

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
      
      {/* Enhancv-Style Top Controls Bar */}
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

        {/* Live ATS Score Indicator Meter */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <ShieldCheck className={`w-4 h-4 ${atsScore >= 80 ? 'text-emerald-600' : 'text-amber-500'}`} />
          <span className="text-xs font-bold text-slate-700">Live ATS Score:</span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${atsScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {atsScore}/100
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Sample
          </button>
          <button
            onClick={resetToEmpty}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-semibold transition-colors"
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
    </div>
  );
}
