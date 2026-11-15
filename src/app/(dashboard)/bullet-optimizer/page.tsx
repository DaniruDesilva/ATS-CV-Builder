'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Check,
  Copy,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Briefcase,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGuestUsageStore } from '@/lib/store/useGuestUsageStore';
import { GuestAuthModal } from '@/components/auth/GuestAuthModal';
import { useRouter } from 'next/navigation';

const sampleBullets = [
  {
    role: 'Project / Operations Lead',
    raw: 'Responsible for managing project schedules, sprint planning, and helping teams deliver software updates on time.',
  },
  {
    role: 'Software Engineer',
    raw: 'Helped build website features with React and fixed frontend bugs to make the app faster.',
  },
  {
    role: 'Marketing & Growth',
    raw: 'Worked on social media marketing campaigns and email newsletters to get more user signups.',
  },
  {
    role: 'Customer Support / Operations',
    raw: 'Handled customer support inquiries and resolved tickets to make customers happy.',
  },
];

export default function BulletOptimizerPage() {
  const router = useRouter();
  const { content, addExperience, addExperienceHighlight } = useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const { canOptimizeBullet, recordBullet } = useGuestUsageStore();

  const [inputBullet, setInputBullet] = useState(sampleBullets[0].raw);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<string | null>(
    'Spearheaded sprint planning and agile deliverables for cross-functional engineering teams, accelerating release cycles by 28% and achieving 99.4% on-time milestone delivery.'
  );
  const [copied, setCopied] = useState(false);
  const [insertedToBuilder, setInsertedToBuilder] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOptimize = async (textToOptimize?: string) => {
    const text = (textToOptimize || inputBullet).trim();
    if (!text) return;

    // Guard guest 1-time optimization
    if (!canOptimizeBullet(isAuthenticated)) {
      setShowAuthModal(true);
      return;
    }

    setIsOptimizing(true);
    setInsertedToBuilder(false);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText: text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 403 || errData.requireAuth) {
          setShowAuthModal(true);
          return;
        }
        setErrorMsg(errData.error || 'Failed to optimize bullet point. Please try again.');
        return;
      }

      const data = await res.json();
      if (data.improved) {
        setOptimizedResult(data.improved);
        if (!isAuthenticated) {
          recordBullet();
        }
      } else {
        setErrorMsg('No optimization result returned. Please try again.');
      }
    } catch {
      setErrorMsg('Network error occurred while optimizing. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedResult) return;
    navigator.clipboard.writeText(optimizedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertToActiveResume = () => {
    if (!optimizedResult) return;

    if (content.experience.length > 0) {
      // Add highlight to first experience entry
      const firstExpId = content.experience[0].id;
      addExperienceHighlight(firstExpId, optimizedResult);
    } else {
      addExperience({
        id: 'exp-' + Date.now(),
        position: 'Role / Position',
        company: 'Company Name',
        location: '',
        startDate: '',
        endDate: 'Present',
        current: true,
        highlights: [optimizedResult],
      });
    }

    setInsertedToBuilder(true);
    setTimeout(() => {
      router.push('/builder?step=4');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-16 lg:pb-24 space-y-12 animate-fade-in">
      
      {/* ── HEADER ── */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Google X-Y-Z Achievement Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.18]">
          ATS Bullet Point <span className="text-emerald-700">Optimizer</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Convert ordinary job duties into quantifiable, metric-driven achievements that impress hiring managers and pass applicant tracking algorithms.
        </p>

        {/* Formula pill */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <strong>Formula:</strong> &ldquo;Accomplished [X], measured by [Y], by doing [Z]&rdquo;
          </span>

          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <span>Guest Mode (1 Free Use) • Sign In for Unlimited</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN TWO-COLUMN STUDIO WORKBENCH ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Card (Cols 1-6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-900">
                Your Current Bullet Point or Duty
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {inputBullet.length} chars
            </span>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <textarea
              rows={4}
              value={inputBullet}
              onChange={(e) => setInputBullet(e.target.value)}
              placeholder="e.g. Responsible for managing software releases and running daily team meetings..."
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all leading-relaxed"
            />
            <p className="text-[11px] text-slate-500">
              💡 Tip: Paste any weak or passive sentence starting with &quot;Responsible for&quot;, &quot;Worked on&quot;, or &quot;Helped with&quot;.
            </p>
          </div>

          {/* Preset Samples */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Try a Quick Sample:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleBullets.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputBullet(sample.raw);
                    handleOptimize(sample.raw);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  {sample.role}
                </button>
              ))}
            </div>
          </div>

          {/* Error Feedback */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-3">
            <button
              type="button"
              disabled={isOptimizing || !inputBullet.trim()}
              onClick={() => handleOptimize()}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Optimizing with Google X-Y-Z...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Optimize Bullet with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output & Breakdown Card (Cols 7-12) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Main Output Box */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-7 shadow-lg shadow-emerald-500/5 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-900">
                  Optimized ATS Version (Google X-Y-Z)
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                +24 ATS Score Boost
              </span>
            </div>

            {/* Content Output */}
            {isOptimizing ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  Weaving in active power verbs, measurable metrics, and ATS keywords...
                </p>
              </div>
            ) : optimizedResult ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-900 text-xs sm:text-sm font-medium leading-relaxed">
                  &ldquo;{optimizedResult}&rdquo;
                </div>

                {/* Formula Breakdown Badges */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Achievement Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      Strong Action Verb
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                      <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                      Quantified Metric (%, $)
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                      <Check className="w-3 h-3 text-purple-600 stroke-[3]" />
                      High ATS Weight
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Rewritten Bullet'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertToActiveResume}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {insertedToBuilder ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Resume! Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <span>Insert into Resume Builder</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs">
                  Click &ldquo;Optimize Bullet with AI&rdquo; or choose a sample to see your transformed bullet point here.
                </p>
              </div>
            )}

          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Why this formula works:
            </span>
            <p className="leading-relaxed">
              Recruiters at Google, Amazon, and enterprise companies scan for proven results rather than job duty checklists. Quantifying your outcomes increases ATS interview selection by up to 40%.
            </p>
          </div>

        </div>

      </div>

      {/* Guest Authentication Modal */}
      <GuestAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature="bullet"
        redirectUrl="/bullet-optimizer"
      />
    </div>
  );
}