'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  ShieldCheck,
  Sparkles,
  Heart,
  Github,
  ArrowRight,
  CheckCircle2,
  Lock,
  X,
  FileCheck2,
  HelpCircle,
  BookOpen,
  Zap,
  Target,
  ExternalLink,
} from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Modal dialog states for legal & compliance guides
  const [activeModal, setActiveModal] = useState<
    'privacy' | 'terms' | 'ats-checklist' | 'ats-guide' | null
  >(null);

  // Hide the marketing footer on the builder workbench for an app-like workspace
  if (pathname === '/builder' || pathname?.startsWith('/builder/')) {
    return null;
  }

  return (
    <>
      <footer className="border-t border-slate-200/90 bg-slate-50/70 text-slate-600 text-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[250px] bg-gradient-to-t from-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 space-y-10">
          
          {/* ── MAIN NAVIGATION COLUMNS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-slate-200/80">
            
            {/* BRAND & MISSION COLUMN (Cols 1-4) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Logo & PRO Badge */}
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    ResumAI
                  </span>
                  <span className="text-[10px] uppercase font-black text-emerald-700 px-1.5 py-0.5 rounded-md bg-emerald-100/80 border border-emerald-300">
                    PRO
                  </span>
                </div>
              </Link>

              {/* Mission Statement */}
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                The enterprise-grade AI resume builder and real-time ATS compatibility checker. Engineered to pass Workday, Taleo, Greenhouse, and Lever screening filters.
              </p>

              {/* Status & Trust Badges */}
              <div className="space-y-2 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] text-slate-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>All Systems Operational</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold">99.4% ATS Parse Rate</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Workday, Taleo, Greenhouse &amp; Lever Tested</span>
                </div>
              </div>

              {/* Authentic GitHub Project Link */}
              <div className="pt-2">
                <a
                  href="https://github.com/DaniruDesilva/ATS-CV-Builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-xs font-semibold shadow-2xs"
                >
                  <Github className="w-4 h-4 text-slate-800" />
                  <span>GitHub: DaniruDesilva/ATS-CV-Builder</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* 4 STRUCTURED NAVIGATION COLUMNS (Cols 5-12) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Col 1: AI Resume Tools */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Resume Tools</span>
                </h4>
                <ul className="space-y-2.5 font-medium">
                  <li>
                    <Link
                      href="/builder"
                      className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>AI Resume Builder</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Top
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/checker"
                      className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>ATS Resume Checker</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                        Score
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bullet-optimizer"
                      className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Bullet Optimizer</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        X-Y-Z
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/keyword-matcher"
                      className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Keyword Matcher</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        New
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/templates"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Certified Templates
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2: ATS Templates */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  ATS Templates
                </h4>
                <ul className="space-y-2.5 font-medium">
                  <li>
                    <Link
                      href="/builder?template=classic-ats"
                      className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Classic ATS</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Popular
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/builder?template=traditional-ats"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Traditional ATS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/builder?template=modern-executive"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Modern Executive
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/builder?template=technical-clean"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Technical Clean
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/templates"
                      className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors inline-flex items-center gap-1 pt-0.5"
                    >
                      <span>Browse All 4 Layouts</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: ATS Resources & Guides */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  ATS Resources
                </h4>
                <ul className="space-y-2.5 font-medium">
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('ats-checklist')}
                      className="text-left hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
                    >
                      <span>Formatting Checklist</span>
                      <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('ats-guide')}
                      className="text-left hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
                    >
                      <span>Workday &amp; Taleo Guide</span>
                      <BookOpen className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/bullet-optimizer"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Google X-Y-Z Formula
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/checker"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      ATS Scoring Algorithm
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/keyword-matcher"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Job Keyword Matcher
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4: Platform & Account */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Platform
                </h4>
                <ul className="space-y-2.5 font-medium">
                  <li>
                    <Link
                      href="/pricing"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Pricing Plans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      User Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Create Free Account
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('privacy')}
                      className="hover:text-emerald-600 transition-colors text-left cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('terms')}
                      className="hover:text-emerald-600 transition-colors text-left cursor-pointer"
                    >
                      Terms of Service
                    </button>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* ── BOTTOM BAR: COPYRIGHT & SECURITY ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span>© {new Date().getFullYear()} ResumAI PRO. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline">
                Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> for job seekers worldwide.
              </span>
            </div>

            {/* Security & OCR Guarantee Badges */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Machine-Readable Vector PDF</span>
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          MODAL DIALOGS FOR LEGAL & ATS RESOURCES
          ═══════════════════════════════════════════════════════════ */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  {activeModal === 'privacy' && <ShieldCheck className="w-4 h-4" />}
                  {activeModal === 'terms' && <FileText className="w-4 h-4" />}
                  {activeModal === 'ats-checklist' && <CheckCircle2 className="w-4 h-4" />}
                  {activeModal === 'ats-guide' && <BookOpen className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {activeModal === 'privacy' && 'Privacy Policy'}
                    {activeModal === 'terms' && 'Terms of Service'}
                    {activeModal === 'ats-checklist' && 'ATS Formatting Checklist (100% Pass Rate)'}
                    {activeModal === 'ats-guide' && 'Workday & Taleo Enterprise ATS Guide'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {activeModal === 'privacy' || activeModal === 'terms' ? 'Last Updated: November 2026' : 'Recruitment Standard Guide'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed font-normal pr-2">
              
              {/* PRIVACY POLICY CONTENT */}
              {activeModal === 'privacy' && (
                <>
                  <p>
                    At <strong>ResumAI PRO</strong>, your privacy and career data security are our top priorities. We adhere to enterprise-grade data protection standards:
                  </p>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">1. Zero Sale of Personal Data</h4>
                      <p>We do not sell, rent, or trade your resume data, contact information, or job history to third-party recruiters, advertisers, or data brokers.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">2. AI Processing Standards</h4>
                      <p>When you use our AI bullet rewriter or ATS scoring, your text is securely processed via private enterprise endpoints. Your data is never used to train public machine learning models.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">3. Data Retention &amp; Deletion</h4>
                      <p>You have full control over your CVs. You can delete your resumes or account anytime from your User Dashboard, which permanently deletes all records from our database.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">4. 256-Bit SSL Encryption</h4>
                      <p>All data in transit and at rest is safeguarded using bank-grade AES-256 encryption.</p>
                    </div>
                  </div>
                </>
              )}

              {/* TERMS OF SERVICE CONTENT */}
              {activeModal === 'terms' && (
                <>
                  <p>
                    Welcome to <strong>ResumAI PRO</strong>. By accessing our platform, you agree to these clear terms of service:
                  </p>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">1. Authorized Use</h4>
                      <p>ResumAI is provided to assist individuals with career document creation, formatting, and ATS optimization. Users agree to input accurate, truthful representations of their experience.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">2. Intellectual Property</h4>
                      <p>You own 100% of the content you create and export on ResumAI. The platform design, algorithms, templates, and branding remain the property of ResumAI Inc.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">3. Free Trial &amp; Subscription Usage</h4>
                      <p>Guest users receive 1 free evaluation and build trial. Free registered and Pro accounts are subject to their respective allowances without hidden commitments.</p>
                    </div>
                  </div>
                </>
              )}

              {/* ATS CHECKLIST CONTENT */}
              {activeModal === 'ats-checklist' && (
                <>
                  <p>
                    Follow this recruiter-verified checklist before submitting your CV to any online job board:
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { title: 'Single-Column Layout', desc: 'Avoid multi-column tables, sidebars, and grid blocks that confuse parser reading order.' },
                      { title: 'Standard Section Headings', desc: 'Use standard titles: "Professional Summary", "Work Experience", "Education", "Technical Skills".' },
                      { title: 'Zero Graphical Traps', desc: 'Do not place text inside shapes, images, icons, or text boxes that OCR screeners ignore.' },
                      { title: 'Quantified Achievements (X-Y-Z)', desc: 'Include measurable metrics (%, $, numbers) in at least 50% of your bullet points.' },
                      { title: 'Exact Keyword Matching', desc: 'Incorporate hard skills and tools exactly as written in the target job description.' },
                      { title: 'Standard A4 PDF with UTF-8 Text', desc: 'Ensure your PDF contains selectable, searchable vector text, not flat raster images.' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-extrabold text-slate-900">{item.title}</h4>
                          <p className="text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ATS GUIDE CONTENT */}
              {activeModal === 'ats-guide' && (
                <>
                  <p>
                    Enterprise Applicant Tracking Systems like <strong>Workday, Taleo, Greenhouse, and Lever</strong> process thousands of applications per hour using automated parsers:
                  </p>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <h4 className="font-extrabold text-emerald-900">How Workday &amp; Taleo Read Resumes</h4>
                      <p className="text-emerald-800">
                        They convert your PDF into a linear plain-text stream. If your resume uses two columns, text from column 1 and column 2 gets interleaved into an unreadable scramble, causing instant rejection.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-extrabold text-slate-900">Why ResumAI Passes Every Time</h4>
                      <p>
                        Our templates are engineered with pure top-to-bottom vector hierarchy, standard section anchors, and parseable date formats that pass Workday and Taleo OCR audits with 100% accuracy.
                      </p>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                ResumAI PRO • Recruitment Architecture
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
