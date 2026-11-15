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
  HelpCircle,
  Loader2,
  Cloud,
  CloudOff,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGuestUsageStore } from '@/lib/store/useGuestUsageStore';
import { GuestAuthModal, GuestFeatureType } from '@/components/auth/GuestAuthModal';
import { getAtsScoreBreakdown } from '@/lib/checker/atsScorer';

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const {
    userId,
    setUserId,
    currentResumeId,
    setCurrentResumeId,
    title,
    setTitle,
    activeStep,
    setActiveStep,
    loadSampleData,
    resetToEmpty,
    resetToEmptyWithUser,
    loadResumeData,
    templateId,
    setTemplateId,
    content,
  } = useResumeStore();

  const [savingCloud, setSavingCloud] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalFeature, setAuthModalFeature] = useState<GuestFeatureType>('builder_save');

  const handleSaveToCloud = async () => {
    if (!isAuthenticated) {
      setAuthModalFeature('builder_save');
      setShowAuthModal(true);
      return;
    }

    setSavingCloud(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentResumeId || undefined,
          title,
          templateId,
          content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.resume?.id && !currentResumeId) {
          setCurrentResumeId(data.resume.id);
        }
        setLastSavedTime(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      }
    } catch (err) {
      console.error('Manual save error:', err);
    } finally {
      setSavingCloud(false);
    }
  };

  // User synchronization & initial active resume loading
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // 1. If the current store was owned by a DIFFERENT user, reset & sync
    if (userId && userId !== user.id) {
      setUserId(user.id);
      fetch('/api/resumes')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.resumes && data.resumes.length > 0) {
            const first = data.resumes[0];
            loadResumeData({
              id: first.id,
              title: first.title,
              templateId: (first.templateId as TemplateId) || 'classic-ats',
              content: first.content,
            });
          } else {
            resetToEmptyWithUser(user.name || '', user.email || '');
          }
        })
        .catch((err) => console.error('Error syncing user resumes:', err));
      return;
    }

    setUserId(user.id);

    // 2. If the store is completely empty (no fullName) and has no currentResumeId,
    // check if this user already has a saved resume in the cloud. If so, load it.
    // If not, initialize a clean draft with their own profile name & email.
    const hasActiveContent = Boolean(content.personalInfo?.fullName?.trim());
    if (!hasActiveContent && !currentResumeId) {
      fetch('/api/resumes')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.resumes && data.resumes.length > 0) {
            const first = data.resumes[0];
            loadResumeData({
              id: first.id,
              title: first.title,
              templateId: (first.templateId as TemplateId) || 'classic-ats',
              content: first.content,
            });
          } else {
            resetToEmptyWithUser(user.name || '', user.email || '');
          }
        })
        .catch((err) => console.error('Error checking user resumes on mount:', err));
    }
  }, [isAuthenticated, user, userId]);

  // Cloud Auto-Save for Authenticated Users (debounced 1.5s)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Do not save completely empty drafts to cloud
    if (!content.personalInfo.fullName || content.personalInfo.fullName.trim() === '') {
      return;
    }

    const timer = setTimeout(async () => {
      setSavingCloud(true);
      try {
        const res = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentResumeId || undefined,
            title,
            templateId,
            content,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.resume?.id && !currentResumeId) {
            setCurrentResumeId(data.resume.id);
          }
          setLastSavedTime(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );
        }
      } catch (err) {
        console.error('Cloud auto-save error:', err);
      } finally {
        setSavingCloud(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, templateId, content, isAuthenticated, currentResumeId, setCurrentResumeId]);

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

  // ── Real-Time ATS Score Engine with Section Breakdown ──
  const atsData = getAtsScoreBreakdown(content);
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
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold">
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
      
      {/* Guest Mode Status Banner */}
      {!isAuthenticated && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>
              <strong>Guest Builder Mode:</strong> You can build and download 1 free resume. Sign in to save your CV to cloud and unlock all templates & AI features.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setAuthModalFeature('builder_save');
              setShowAuthModal(true);
            }}
            className="text-amber-900 font-extrabold hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Save CV to Account →</span>
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 min-w-[240px] transition-colors"
          />
          {savingCloud ? (
            <span className="text-xs text-slate-500 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> Saving...
            </span>
          ) : isAuthenticated ? (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lastSavedTime ? `Cloud Saved (${lastSavedTime})` : 'Cloud Synced'}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthModalFeature('builder_save');
                setShowAuthModal(true);
              }}
              className="text-xs text-amber-800 font-bold flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition-colors cursor-pointer"
              title="Click to sign in and save your CV to cloud"
            >
              <CloudOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Guest Draft • Sign in to Save</span>
            </button>
          )}
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
            type="button"
            onClick={handleSaveToCloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-colors cursor-pointer"
            title={isAuthenticated ? 'Save changes to cloud' : 'Sign in to save to your account'}
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAuthenticated ? 'Save Cloud' : 'Save to Account'}</span>
          </button>
          <button
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Sample
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
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
                  resetToEmptyWithUser(user?.name || '', user?.email || '');
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

      {/* Guest Authentication Modal */}
      <GuestAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature={authModalFeature}
        redirectUrl="/builder"
      />
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
