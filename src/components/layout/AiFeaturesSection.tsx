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
} from 'lucide-react';
import Link from 'next/link';

interface FeatureItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tag: string;
  description: string;
  bullets: string[];
}

const features: FeatureItem[] = [
  {
    id: 'bullet-optimizer',
    icon: Sparkles,
    title: 'AI Bullet Point Optimizer',
    tag: 'Impact Formula',
    description: 'Converts ordinary job duties into quantifiable, metric-driven achievements that impress hiring managers and ATS algorithms.',
    bullets: [
      'Rewrites passive duty lists using strong, industry-proven action verbs',
      'Automatically prompts and weaves in measurable metrics (%, $, scale)',
      'Direct one-click replacement into your active resume experience'
    ]
  },
  {
    id: 'ats-scoring',
    icon: ShieldCheck,
    title: 'Real-Time ATS Compatibility Scoring',
    tag: 'Instant 0–100 Audit',
    description: 'Continuously scores your resume format, keyword coverage, and section structure against enterprise ATS screening standards.',
    bullets: [
      'Live score audit assessing format compliance, content depth, and keyword density',
      'Detects text traps, table corruptions, and missing standard section headers',
      'Actionable recommendations to push your CV into the top 5% candidate pool'
    ]
  },
  {
    id: 'keyword-matcher',
    icon: Target,
    title: 'Target Job Keyword Gap Matcher',
    tag: 'Beat Job Filters',
    description: 'Compares your resume against any target job description to highlight high-priority keywords missing from your application.',
    bullets: [
      'Paste any job posting to identify exact skills ATS screeners look for',
      'Highlights hard skills, software tools, and certifications you should add',
      'One-click keyword injection to dramatically increase ATS match rate'
    ]
  },
  {
    id: 'ats-export',
    icon: FileCheck2,
    title: 'One-Click ATS-Safe PDF Export',
    tag: '100% Readable',
    description: 'Generates clean, standardized A4 PDF resumes with flawless typography that candidate tracking systems read without errors.',
    bullets: [
      'Standard single-column hierarchy guaranteed to pass Workday, Taleo, and Greenhouse',
      'Clean typography and divider rules with zero unparseable text traps',
      'Maintains exact formatting on screen, in print, and inside recruiter databases'
    ]
  }
];

export default function AiFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FBFDFB] relative overflow-hidden border-t border-slate-100">
      
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Built-In AI Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 leading-[1.15] tracking-tight">
            How ResumAI Transforms Your Resume with AI
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            From real-time ATS scoring to instant bullet point rewrites, our built-in AI tools analyze your experience against employer hiring criteria and enhance every section.
          </p>
        </div>

        {/* Main Content Grid: Left Interactive Tabs + Right High-Fidelity App Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT: Interactive Feature Cards (Cols 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              {features.map((feature) => {
                const isActive = activeFeature === feature.id;
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? 'bg-white border-emerald-500/80 shadow-md ring-2 ring-emerald-500/15'
                        : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3
                            className={`text-base font-extrabold tracking-tight truncate ${
                              isActive ? 'text-slate-900' : 'text-slate-800'
                            }`}
                          >
                            {feature.title}
                          </h3>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 border ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {feature.tag}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {feature.description}
                        </p>

                        {isActive && (
                          <div className="mt-3.5 pt-3.5 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                            <ul className="space-y-2">
                              {feature.bullets.map((bullet, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                  <span className="text-xs text-slate-700 leading-tight font-medium">
                                    {bullet}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/builder"
                className="group inline-flex items-center gap-2 text-emerald-700 font-extrabold text-sm hover:text-emerald-800 transition-colors"
              >
                <span>Try the AI Resume Builder in Action</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Authentic High-Fidelity Software Showcase (Cols 6-12) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden text-white min-h-[500px]">
            
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Window Top Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-400 font-mono text-[11px] ml-2 hidden sm:inline">
                  resumai-engine // {activeFeature}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Model: Gemini 1.5 Pro
                </span>
              </div>
            </div>

            {/* DYNAMIC SCREEN CONTENT ACCORDING TO SELECTED TAB */}
            <div className="py-5 flex-1 flex items-center justify-center relative z-10">
              
              {/* ──────────────────────────────────────────────────
                  TAB 1: AI Bullet Point Optimizer
                  ────────────────────────────────────────────────── */}
              {activeFeature === 'bullet-optimizer' && (
                <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-250">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Experience Bullet Point Optimizer</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                      +18 ATS Score Boost
                    </span>
                  </div>

                  {/* Before Box */}
                  <div className="bg-slate-950/80 rounded-xl p-4 border border-rose-900/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Before (Weak &amp; Passive)
                      </span>
                      <span className="text-slate-500 text-[10px]">Lacks Metrics</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed line-through decoration-rose-500/60">
                      Responsible for managing project schedules and helping team members deliver software updates on time.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-800/40">
                        Passive phrasing: &quot;Responsible for&quot;
                      </span>
                      <span className="text-[10px] bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-800/40">
                        Zero quantified metrics
                      </span>
                    </div>
                  </div>

                  {/* After / Optimized Box */}
                  <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-500/40 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Optimized ATS Version (Google X-Y-Z Formula)
                      </span>
                      <span className="text-emerald-300 text-[10px] font-bold">100% Recruiter Approved</span>
                    </div>
                    <p className="text-xs text-slate-100 font-medium leading-relaxed">
                      Led cross-functional team of 8 to execute 4 critical platform releases ahead of schedule, reducing deployment cycle times by <strong className="text-emerald-300 font-bold underline decoration-emerald-400">28%</strong> and boosting user throughput.
                    </p>
                    
                    {/* Achievement Metrics Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                        ✓ Strong Action Verb (&quot;Led&quot;)
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                        ✓ Quantified Result (&quot;28%&quot;)
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                        ✓ High ATS Keyword Weight
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Proven formula: <em className="text-slate-300">&quot;Accomplished [X], measured by [Y], by doing [Z]&quot;</em>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied to Clipboard!' : 'Use This Bullet'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  TAB 2: Real-Time ATS Compatibility Scoring
                  ────────────────────────────────────────────────── */}
              {activeFeature === 'ats-scoring' && (
                <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-250">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Live ATS Compatibility Audit</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400 px-2.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                      Top 2% Candidate Pool
                    </span>
                  </div>

                  {/* Main Score Hero Card */}
                  <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-5 text-center sm:text-left sm:border-r sm:border-slate-800 sm:pr-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Overall ATS Score
                      </span>
                      <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
                        <span className="text-4xl font-black text-emerald-400">94</span>
                        <span className="text-slate-500 text-base font-bold">/ 100</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                        ✓ Ready to Submit
                      </span>
                    </div>

                    <div className="sm:col-span-7 space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">Layout &amp; Structure</span>
                          <span className="text-emerald-400 font-bold">98%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: '98%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">ATS Keyword Coverage</span>
                          <span className="text-teal-400 font-bold">92%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-teal-400 h-full rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">Quantified Bullet Ratio</span>
                          <span className="text-emerald-400 font-bold">88%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actionable Findings Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Screening Systems Verified:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">Workday &amp; Taleo OCR Safe</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">Contact Information Extracted</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">Standard Section Headers</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">Zero Multi-Column Traps</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  TAB 3: Target Job Keyword Gap Matcher
                  ────────────────────────────────────────────────── */}
              {activeFeature === 'keyword-matcher' && (
                <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-250">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span>Job Description Keyword Gap Matcher</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400 px-2.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                      Target Role: Senior Manager
                    </span>
                  </div>

                  {/* Match Progress Bar Card */}
                  <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">Match Score: 84% &rarr; 96% with recommendations</span>
                      <span className="text-emerald-400 font-bold">+12% Potential</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '84%' }} />
                    </div>
                  </div>

                  {/* Comparative Skills Matrix */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                        ✓ Detected In Your Resume (24 Skills Matched):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Project Planning', 'Team Leadership', 'Budget Management', 'Agile / Scrum', 'Stakeholder Reporting'].map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                        + Missing High-Priority Keywords (Click to Inject):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Process Optimization',
                          'Cross-Functional Collaboration',
                          'Risk Mitigation',
                          'Resource Allocation'
                        ].map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-colors flex items-center gap-1"
                          >
                            <span className="text-amber-400 font-black">+</span>
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    Adding these 4 missing skills into your experience bullet points raises your ranking into the top 5% of candidate pools.
                  </p>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  TAB 4: One-Click ATS Formatting & Export
                  ────────────────────────────────────────────────── */}
              {activeFeature === 'ats-export' && (
                <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-250">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>Standardized A4 ATS Document Stream</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                      100% Machine-Readable
                    </span>
                  </div>

                  {/* Clean Mini-Document Preview */}
                  <div className="bg-white rounded-xl p-4.5 text-slate-900 shadow-lg space-y-2.5 text-left border border-slate-200">
                    <div className="border-b border-slate-900 pb-1.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        DANIRU DE SILVA
                      </h4>
                      <p className="text-[10px] text-slate-600 font-semibold">
                        Software Engineering Intern • Sri Lanka • daniru.desilva2023@gmail.com
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-800 block border-b border-slate-300 pb-0.5">
                        PROFESSIONAL SUMMARY
                      </span>
                      <p className="text-[9.5px] text-slate-700 leading-snug">
                        Dedicated technologist with proven experience architecting full-stack web applications, SaaS platforms, and REST APIs using Next.js, Node.js, and Supabase.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">
                          EXPERIENCE
                        </span>
                        <span className="text-[8.5px] text-slate-500 font-bold">2024 — Present</span>
                      </div>
                      <p className="text-[9.5px] text-slate-800 font-bold">
                        Director &amp; Co-Founder • Delight Consumer Products
                      </p>
                      <p className="text-[9px] text-slate-600 leading-tight">
                        • Engineered full-stack e-commerce system delivering 35% faster checkout throughput.
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero tables • Guaranteed OCR pass rate</span>
                    </div>

                    <Link
                      href="/builder"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export ATS PDF</span>
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Window Bottom Status Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Validated against Workday, Taleo, Greenhouse &amp; Lever</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">
                Instant Cloud Sync
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
