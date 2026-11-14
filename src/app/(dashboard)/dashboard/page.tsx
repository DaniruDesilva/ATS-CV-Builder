'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Crown,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  FileSearch,
  Lock,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { title, content, templateId } = useResumeStore();
  const { user, isAuthenticated, login, initAuth } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-slate-400 text-xs font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  // ── 1. UNAUTHENTICATED GUEST STATE ──
  // If the user visits /dashboard without logging in, guide them clearly!
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to View Your Dashboard
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your dashboard organizes your active resume drafts, ATS score history, keyword analytics, and PDF downloads.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl max-w-md mx-auto space-y-4">
          <Link
            href="/login?redirect=/dashboard"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => login({ email: 'daniru.desilva2023@gmail.com', name: 'Daniru De Silva' })}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-300 text-emerald-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>⚡ Instant Demo Access (Daniru De Silva)</span>
          </button>

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-emerald-600 font-bold hover:underline">
              Create an account free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. AUTHENTICATED USER DASHBOARD ──
  const totalSkills = content.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  const templateName =
    templateId === 'classic-ats'
      ? 'Classic ATS (Parsing Optimized)'
      : templateId === 'traditional-ats'
      ? 'Traditional ATS (Gold Standard)'
      : templateId === 'modern-executive'
      ? 'Modern Executive'
      : 'Technical Clean';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full animate-fade-in">
      
      {/* ── HERO GREETING BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Workspace • {user?.plan === 'pro' ? 'Pro Plan' : 'Free Tier'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, {user?.name || 'Daniru'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your ATS career command center. Edit your current resume, test real-time ATS compatibility, or scan existing documents.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/builder"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Resume Builder</span>
            </Link>
            <Link
              href="/checker"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
            >
              <FileSearch className="w-4 h-4 text-emerald-400" />
              <span>Scan CV Score</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── KEY METRICS OVERVIEW ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Resume */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Resume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 truncate">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{content.personalInfo.jobTitle || 'Software Engineer'}</p>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready for Export
          </div>
        </div>

        {/* Card 2: Live ATS Score */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live ATS Score</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">72</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1 pt-1">
            <span>Top 15% ATS Parsed</span>
          </div>
        </div>

        {/* Card 3: Skills & Keywords */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skills Indexed</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalSkills}</span>
            <span className="text-xs font-bold text-slate-400">Technical Skills</span>
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1 pt-1">
            <span>Across {content.skills.length} Categories</span>
          </div>
        </div>

        {/* Card 4: Plan Status */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan &amp; Credits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-slate-900">
              {user?.plan === 'lifetime'
                ? 'Lifetime Access'
                : user?.plan === 'pro_monthly' || user?.plan === 'pro'
                ? 'Pro Monthly'
                : 'Free Tier'}
            </span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500 font-semibold">
              {user?.aiCredits ?? 5} AI Credits left
            </span>
            <Link
              href="/pricing"
              className="text-emerald-700 font-bold hover:underline"
            >
              {user?.plan === 'free' || !user?.plan ? 'Upgrade →' : 'Manage →'}
            </Link>
          </div>
        </div>
      </div>

      {/* ── MY SAVED RESUMES SECTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">My Saved Resumes</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              1 Resume
            </span>
          </div>
          <Link
            href="/builder"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Open in Builder <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Active Resume Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 tracking-wider">
                  Active Draft
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {content.personalInfo.fullName} • {content.personalInfo.jobTitle}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Template</span>
                  <span className="font-semibold text-slate-800">{templateName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ATS Score</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    72 / 100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Format</span>
                  <span className="font-medium text-slate-600">Standard A4 Vector PDF</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Auto-Saved
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/builder"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1"
                >
                  Edit <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/checker"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Check
                </Link>
              </div>
            </div>
          </div>

          {/* New Resume Placeholder Card */}
          <Link
            href="/builder"
            className="group rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-emerald-50/20 transition-all duration-200 min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">
                Create New Resume
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Build another resume tailored for a specific role or company.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 group-hover:underline">
              Start Builder →
            </span>
          </Link>

          {/* AI Checker Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider">
                  AI Reviewer
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Scan Any Resume File
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Have an existing PDF or Word CV? Upload it to check formatting errors and get Google X-Y-Z formula rewrites.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">PDF, DOCX Supported</span>
              <Link
                href="/checker"
                className="text-xs text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1"
              >
                Scan Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATS PRO TIPS & TOOLS SECTION ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bullet Optimizer Tip */}
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-slate-900">
              Pro Tip: The Google X-Y-Z Formula
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Top recruiters look for: <strong className="text-slate-800">&quot;Accomplished [X], measured by [Y], by doing [Z]&quot;</strong>.
              Always include percentages, numbers, and scope metrics in your experience bullet points.
            </p>
            <Link
              href="/builder?step=4"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 pt-1"
            >
              Optimize Bullets Now →
            </Link>
          </div>
        </div>

        {/* ATS Parsing Rule Guide */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-slate-900">
              Why Single-Column Vector PDFs Win
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complex 2-column tables and non-standard icons often scramble ATS parsing scanners (Workday, Taleo). ResumAI generates pure text vector streams guaranteed to score 100% on OCR.
            </p>
            <Link
              href="/builder?step=9"
              className="text-xs font-bold text-slate-800 hover:text-slate-900 inline-flex items-center gap-1 pt-1"
            >
              Browse ATS Templates →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
