'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Target,
  FileCheck2,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Wand2,
  Layers,
  Search,
  FileText,
  CheckCheck,
  Zap,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface FeatureTab {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  tag: string;
  shortDesc: string;
}

const tabs: FeatureTab[] = [
  {
    id: 'bullet-optimizer',
    icon: Wand2,
    name: 'AI Bullet Rewriter',
    tag: 'Google X-Y-Z Formula',
    shortDesc: 'Turns passive duties into quantified, high-impact achievements.',
  },
  {
    id: 'ats-scoring',
    icon: ShieldCheck,
    name: 'Live ATS Scoring Audit',
    tag: 'Real-Time 0–100',
    shortDesc: 'Detects format traps, header errors, and parsing issues instantly.',
  },
  {
    id: 'keyword-matcher',
    icon: Target,
    name: 'Job Description Matcher',
    tag: 'Keyword Gap Analysis',
    shortDesc: 'Identifies missing keywords from any job posting to pass ATS filters.',
  },
  {
    id: 'ats-export',
    icon: FileCheck2,
    name: 'ATS-Certified PDF Export',
    tag: '100% OCR Readable',
    shortDesc: 'Generates clean single-column PDFs tested on Workday and Taleo.',
  },
];

export default function AiFeaturesSection() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [bulletApplied, setBulletApplied] = useState(false);
  const [addedSkills, setAddedSkills] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleApplyBullet = () => {
    setBulletApplied(true);
  };

  const handleResetBullet = () => {
    setBulletApplied(false);
  };

  const handleToggleSkill = (skill: string) => {
    if (addedSkills.includes(skill)) {
      setAddedSkills(addedSkills.filter((s) => s !== skill));
    } else {
      setAddedSkills([...addedSkills, skill]);
    }
  };

  const handleCopyBullet = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] relative overflow-hidden border-t border-slate-200/80">
      
      {/* Ambient background subtle lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Intelligent Resume Copilot</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 leading-[1.2] tracking-tight">
            How ResumAI Transforms Your Resume in Real Time
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            See how our built-in intelligence audits your formatting, rewrites weak bullets into quantified achievements, and matches the exact keywords hiring managers search for.
          </p>
        </div>

        {/* Modern Interactive Segmented Navigation Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/80 border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 group-hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wide ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {tab.tag}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-extrabold tracking-tight ${
                      isActive ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {tab.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {tab.shortDesc}
                  </p>
                </div>

                {/* Active Indicator Underline */}
                {isActive && (
                  <div className="mt-3 h-1 w-full bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Central High-Fidelity Product Canvas (Light Mode Studio) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 overflow-hidden relative">
          
          {/* Top Window Bar: Browser/Studio Chrome */}
          <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <span className="h-4 w-px bg-slate-200 mx-1 hidden sm:inline-block" />
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ResumAI Studio</span>
                <span className="text-slate-400 font-normal hidden sm:inline">
                  — Interactive Live Preview
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ATS Safe: Workday &amp; Taleo Verified
              </span>
            </div>
          </div>

          {/* Interactive Screen Content Body */}
          <div className="p-6 sm:p-8 lg:p-10 min-h-[480px] flex items-center justify-center">
            
            {/* ─────────────────────────────────────────────────────────────
                VIEW 1: AI Bullet Rewriter (Modern In-Context Copilot)
                ───────────────────────────────────────────────────────────── */}
            {activeTab === 'bullet-optimizer' && (
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-300">
                
                {/* Context Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Live Document Editor
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      Work Experience: Senior Operations &amp; Project Lead
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                      Impact Score: {bulletApplied ? '+24 pts' : '+18 pts available'}
                    </span>
                  </div>
                </div>

                {/* Document Canvas Preview */}
                <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4">
                  
                  {/* Stable bullet item */}
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 font-bold mt-1 text-sm">•</span>
                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                      Spearheaded cross-functional sprint planning and weekly milestones across product, design, and business development units.
                    </p>
                  </div>

                  {/* The Interactive Target Bullet */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold mt-1 text-sm">•</span>
                      
                      {/* Active Text State */}
                      <div className="flex-1">
                        {bulletApplied ? (
                          <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-slate-900 text-sm font-medium leading-relaxed transition-all">
                            <span className="font-bold text-emerald-800">Spearheaded 14 cross-functional sprints</span> across 3 business units, reducing project delivery cycle times by <span className="font-bold text-emerald-700 underline decoration-emerald-400">28%</span> while optimizing a <span className="font-bold text-emerald-700">$1.2M</span> annual operational budget.
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Quantified Google X-Y-Z Achievement successfully applied to CV!</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-slate-800 text-sm leading-relaxed">
                            <span className="line-through decoration-rose-500/80 text-slate-500 mr-2">
                              Responsible for managing project schedules, sprint planning, and helping teams deliver software updates on time.
                            </span>
                            <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                              Passive phrasing &amp; lacks quantified metrics
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floating ResumAI Copilot Suggestion Box */}
                    <div className="ml-6 sm:ml-7 bg-white rounded-2xl border-2 border-emerald-500/40 p-4 sm:p-5 shadow-lg shadow-emerald-500/5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                              ResumAI Suggestion (Google X-Y-Z Formula)
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Accomplished [X], measured by [Y], by doing [Z]
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          100% Recruiter Approved
                        </span>
                      </div>

                      {/* Rewritten Preview */}
                      <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        &ldquo;Spearheaded 14 cross-functional sprints across 3 business units, reducing project delivery cycle times by <strong className="text-emerald-700 font-bold">28%</strong> while optimizing a <strong className="text-emerald-700 font-bold">$1.2M</strong> annual operational budget.&rdquo;
                      </p>

                      {/* Formula Badges */}
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          Strong Action Verb (&quot;Spearheaded&quot;)
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                          Measurable Impact (&quot;28%&quot;, &quot;$1.2M&quot;)
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          <Check className="w-3 h-3 text-purple-600 stroke-[3]" />
                          ATS Target Keywords
                        </span>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyBullet}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                          </button>

                          {bulletApplied && (
                            <button
                              type="button"
                              onClick={handleResetBullet}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset</span>
                            </button>
                          )}
                        </div>

                        {!bulletApplied ? (
                          <button
                            type="button"
                            onClick={handleApplyBullet}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Apply to Resume</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                            <CheckCheck className="w-4 h-4 text-emerald-600" />
                            Applied to Document
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Works seamlessly across engineering, marketing, finance, healthcare, and operations roles.</span>
                  <Link href="/builder" className="text-emerald-700 font-extrabold hover:text-emerald-800 flex items-center gap-1">
                    Try Bullet Optimizer <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                VIEW 2: Live ATS Scoring Audit (Diagnostic Studio)
                ───────────────────────────────────────────────────────────── */}
            {activeTab === 'ats-scoring' && (
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-300">
                
                {/* Header & Target Engine */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Automated ATS Screening Engine
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      Live Pre-Submission Compatibility Audit
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Passed All 14 Compliance Checks
                    </span>
                  </div>
                </div>

                {/* Main Audit Diagnostic Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 items-center">
                  
                  {/* Score Gauge (Cols 1-4) */}
                  <div className="md:col-span-4 text-center md:border-r md:border-slate-200 md:pr-6 space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Overall ATS Score
                    </span>
                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-emerald-500 bg-white shadow-sm">
                      <div className="text-center">
                        <span className="text-3xl font-black text-slate-900 leading-none">96</span>
                        <span className="text-xs font-bold text-slate-400 block mt-0.5">/ 100</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-emerald-700 block">
                        Top 2% Candidate Tier
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Guaranteed to pass enterprise screening
                      </span>
                    </div>
                  </div>

                  {/* Breakdown Bars (Cols 5-12) */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-extrabold text-slate-800">
                          Document Structure &amp; Single-Column Hierarchy
                        </span>
                        <span className="font-bold text-emerald-700">100% (Flawless)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Zero multi-column traps, floating text boxes, or unparseable headers.</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-extrabold text-slate-800">
                          Target Role Keyword Coverage
                        </span>
                        <span className="font-bold text-emerald-700">94% (24/25 matched)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full" style={{ width: '94%' }} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Strong presence of standard technical and functional industry skills.</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-extrabold text-slate-800">
                          Quantified Achievement Bullets
                        </span>
                        <span className="font-bold text-emerald-700">92% (11/12 with metrics)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">High ratio of measurable outcomes, percentages, and leadership impact.</p>
                    </div>
                  </div>

                </div>

                {/* Enterprise Systems Verified Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-slate-900 block">Workday</span>
                    <span className="text-[10px] text-slate-500">100% Parsed</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-slate-900 block">Taleo OCR</span>
                    <span className="text-[10px] text-slate-500">No Read Errors</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-slate-900 block">Greenhouse</span>
                    <span className="text-[10px] text-slate-500">Auto-Categorized</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs font-extrabold text-slate-900 block">Lever</span>
                    <span className="text-[10px] text-slate-500">Full Extraction</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Score updates automatically with every keystroke in our resume builder.</span>
                  <Link href="/checker" className="text-emerald-700 font-extrabold hover:text-emerald-800 flex items-center gap-1">
                    Upload Your CV to Test Score <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                VIEW 3: Target Job Keyword Gap Matcher (Interactive Matcher)
                ───────────────────────────────────────────────────────────── */}
            {activeTab === 'keyword-matcher' && (
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-300">
                
                {/* Header & Match Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Target Role Comparison
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      Senior Product &amp; Operations Manager
                    </h4>
                  </div>
                  
                  {/* Dynamic Match Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                      Match Score: {84 + addedSkills.length * 4}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">
                      Keyword Match: {84 + addedSkills.length * 4}% (Target: 95%+)
                    </span>
                    <span className="text-emerald-700">
                      {addedSkills.length > 0 ? `+${addedSkills.length * 4}% Boost Added` : 'Click keywords below to add'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(84 + addedSkills.length * 4, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Two Distinct Skill Buckets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Matched Skills */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matched in Your Resume (20 Found)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Roadmap Strategy',
                        'Agile / Scrum',
                        'Cross-Functional Teams',
                        'KPI Analytics',
                        'Stakeholder Management',
                        'Product Lifecycle',
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                      {addedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold animate-in zoom-in-95 duration-200"
                        >
                          ✓ {skill} (Added)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills from Job Description */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-amber-800">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Missing Job Keywords (Click to Add):
                      </span>
                      <span className="text-[10px] font-normal text-slate-500">Interactive</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Budget Allocation ($1M+)',
                        'Go-To-Market (GTM)',
                        'User Retention Optimization',
                        'Risk Mitigation Planning',
                      ].map((skill) => {
                        const isAdded = addedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                : 'bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-100/90 shadow-2xs hover:scale-102'
                            }`}
                          >
                            <span>{isAdded ? '✓ Added' : '+ Add'}</span>
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Click any missing skill to weave it automatically into your experience bullet points.
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Paste any job description from LinkedIn, Indeed, or company career portals.</span>
                  <Link href="/builder" className="text-emerald-700 font-extrabold hover:text-emerald-800 flex items-center gap-1">
                    Try Target Job Matcher <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                VIEW 4: ATS-Certified Vector PDF Export
                ───────────────────────────────────────────────────────────── */}
            {activeTab === 'ats-export' && (
              <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-300">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Production Document Renderer
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      100% Vector Single-Column A4 Output
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                      Standard Print Standard (794 × 1123 pt)
                    </span>
                  </div>
                </div>

                {/* Authentic Clean A4 Document Preview Card */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-md text-left space-y-4 max-w-2xl mx-auto">
                  
                  {/* Name & Header */}
                  <div className="border-b border-slate-900 pb-3 text-center sm:text-left">
                    <h5 className="text-lg font-black uppercase tracking-wider text-slate-900">
                      DANIRU DE SILVA
                    </h5>
                    <p className="text-xs text-slate-600 font-semibold mt-1">
                      Software Engineering Intern • Sri Lanka • daniru.desilva2023@gmail.com • +94 77 123 4567
                    </p>
                  </div>

                  {/* Professional Summary */}
                  <div className="space-y-1">
                    <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                      PROFESSIONAL SUMMARY
                    </h6>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Dedicated technologist with proven experience architecting full-stack web platforms, SaaS platforms, and enterprise APIs using Next.js, Node.js, and PostgreSQL. Focused on delivering scalable, high-impact software solutions.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
                      <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        WORK EXPERIENCE
                      </h6>
                      <span className="text-[10px] text-slate-500 font-bold">2024 — Present</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-900 font-bold">
                        Director &amp; Co-Founder • Delight Consumer Products (Pvt) Ltd.
                      </p>
                      <ul className="text-xs text-slate-700 space-y-1 mt-1">
                        <li>• Spearheaded full-stack platform architecture, improving payment checkout speed by 35%.</li>
                        <li>• Led agile sprint delivery for 4 core web products with 99.8% server uptime.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
                      <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        EDUCATION
                      </h6>
                      <span className="text-[10px] text-slate-500 font-bold">2024 — 2028</span>
                    </div>
                    <p className="text-xs text-slate-900 font-bold">
                      BSc (Hons) in Information Technology • University of Moratuwa
                    </p>
                  </div>

                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pure single-column text stream. Zero multi-column tables or unreadable icons.</span>
                  </div>

                  <Link
                    href="/builder"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ATS-Safe PDF in Builder</span>
                  </Link>
                </div>

              </div>
            )}

          </div>

          {/* Bottom Status Bar */}
          <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Enterprise OCR Certified
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline text-slate-500">
                Validated against Workday, Taleo, Greenhouse &amp; Lever
              </span>
            </div>

            <Link
              href="/builder"
              className="text-emerald-700 font-extrabold hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Open ResumAI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}