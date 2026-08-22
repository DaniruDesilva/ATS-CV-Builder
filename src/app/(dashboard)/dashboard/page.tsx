'use client';

import Link from 'next/link';
import { FileText, CheckCircle2, Crown, Plus, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/lib/store/useResumeStore';

export default function DashboardPage() {
  const { title, content } = useResumeStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full animate-fade-in">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 rounded-2xl text-white">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-blue-100">
            Build ATS-compliant resumes and score your CV against enterprise tracking systems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/builder"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Resume
          </Link>
          <Link
            href="/checker"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/30 text-sm font-semibold transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Check Score
          </Link>
        </div>
      </div>

      {/* Quick Launch Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Active Resume Draft Card */}
        <div className="group bg-white rounded-xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-blue-600 tracking-wider">Active Draft</span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">{title}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {content.personalInfo.fullName || 'Candidate'} • {content.personalInfo.jobTitle || 'Software Engineer'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Auto-Saved
            </span>
            <Link
              href="/builder"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              Continue Editing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ATS Checker Tool Card */}
        <div className="group bg-white rounded-xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-indigo-600 tracking-wider">AI Analyzer</span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">Scan & Check Resume</h3>
              <p className="text-sm text-slate-500 mt-1">
                Upload your PDF or DOCX file to get an instant 0–100 ATS score and AI bullet rewrites.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Supports .PDF, .DOCX</span>
            <Link
              href="/checker"
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
            >
              Scan File Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="group bg-white rounded-xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-amber-600 tracking-wider">Pro Access</span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors mt-0.5">Upgrade to Pro</h3>
              <p className="text-sm text-slate-500 mt-1">
                Unlock unlimited PDF exports, unlimited AI scans, and custom keyword gap matching.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">From $9/mo</span>
            <Link
              href="/pricing"
              className="text-sm text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1"
            >
              View Plans <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">Pro Tip: Optimize Your Bullet Points</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Use the Google X-Y-Z formula: &quot;Accomplished [X], measured by [Y], by doing [Z]&quot;. 
            Our ATS Checker can automatically rewrite your bullets in this format.
          </p>
        </div>
      </div>
    </div>
  );
}
