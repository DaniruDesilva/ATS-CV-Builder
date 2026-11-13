'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  Star,
  MessageSquareQuote,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Layers,
  Zap,
  Cpu,
  Target
} from 'lucide-react';
import { ClassicAtsDom, ModernExecutiveDom, TechnicalCleanDom, TraditionalAtsDom } from '@/components/builder/DomTemplates';
import { mockResume1, mockResume2, mockResume3 } from '@/lib/mockResumes';
import AiFeaturesSection from '@/components/layout/AiFeaturesSection';

export default function LandingPage() {
  const templateScrollRef = useRef<HTMLDivElement>(null);
  const [carouselActiveDot, setCarouselActiveDot] = useState(0);
  const [activeHeroTab, setActiveHeroTab] = useState<'classic' | 'traditional' | 'technical' | 'executive'>('classic');

  const templates = [
    {
      id: 'classic-ats',
      templateId: 'classic-ats',
      name: 'Classic ATS',
      tag: 'Top Tech Pick',
      description: 'Modern typography with clean two-column technical skills. Optimized for 100% OCR parseability.',
      mock: mockResume1,
      Component: ClassicAtsDom,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'traditional-ats',
      templateId: 'traditional-ats',
      name: 'Traditional ATS',
      tag: 'Gold Standard',
      description: 'The quintessential Ivy League & Big Tech standard. Single-column format with clean divider rules.',
      mock: mockResume1,
      Component: TraditionalAtsDom,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    {
      id: 'technical-clean',
      templateId: 'technical-clean',
      name: 'Technical Clean',
      tag: 'Developer Stack',
      description: 'Sidebar layout prioritizing programming languages, cloud tools, frameworks, and project links.',
      mock: mockResume3,
      Component: TechnicalCleanDom,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      id: 'modern-executive',
      templateId: 'modern-executive',
      name: 'Modern Executive',
      tag: 'Leadership',
      description: 'High-impact two-column layout with dark sidebar. Designed for senior leads, managers, and directors.',
      mock: mockResume2,
      Component: ModernExecutiveDom,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
  ];

  const scrollToIndex = (index: number) => {
    if (templateScrollRef.current) {
      const cardWidth = 360;
      templateScrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
      setCarouselActiveDot(index);
    }
  };

  const handleScroll = () => {
    if (templateScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = templateScrollRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        const progress = scrollLeft / totalScrollable;
        const dotIndex = Math.min(Math.round(progress * (templates.length - 1)), templates.length - 1);
        setCarouselActiveDot(dotIndex);
      }
    }
  };

  const getHeroComponent = () => {
    switch (activeHeroTab) {
      case 'traditional':
        return <TraditionalAtsDom content={mockResume1} />;
      case 'technical':
        return <TechnicalCleanDom content={mockResume3} />;
      case 'executive':
        return <ModernExecutiveDom content={mockResume2} />;
      case 'classic':
      default:
        return <ClassicAtsDom content={mockResume1} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans overflow-x-hidden selection:bg-emerald-500/20 text-slate-800">
      
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-10 pb-20 lg:pt-18 lg:pb-28 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-[#dcfcf2] via-[#eaf0fc] to-[#f0fdf4]">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left mx-auto lg:mx-0 max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Next-Gen ATS Optimization • Taleo &amp; Workday Certified</span>
            </div>

            <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] leading-[1.04] font-black text-slate-900 tracking-tight text-balance">
              Land more <span className="text-slate-800">interviews with</span><br className="hidden sm:block" />
              ResumAI&apos;s <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Resume Builder</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              Create a recruiter-ready resume with real-time ATS compatibility scoring, Google X-Y-Z bullet rewrites, and 100% vector single-column PDF export.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/builder"
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-extrabold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Your Resume</span>
              </Link>
              
              <Link
                href="/checker"
                className="w-full sm:w-auto px-7 py-3.5 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white text-base font-bold rounded-xl transition-all text-center hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Get Your Resume Score</span>
              </Link>
            </div>

            {/* Social Proof & Trust Badges */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 border-t border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <div className="flex text-emerald-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-emerald-600 text-white rounded-xs flex items-center justify-center shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <span className="text-slate-900 font-extrabold text-xs block leading-tight">5,320+ Reviews</span>
                  <span className="text-[11px] text-slate-500">4.9 / 5 Rating</span>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-8 bg-slate-300/80" />
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-slate-600 text-xs font-semibold text-left leading-tight">
                  <strong className="text-slate-900 font-extrabold">28,400+ candidates</strong> passed ATS screening
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real-Time Resume Preview Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative w-full">
            
            {/* Interactive Template Switcher Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl shadow-sm mb-4 z-20 max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveHeroTab('classic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeHeroTab === 'classic'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Classic ATS
              </button>
              <button
                type="button"
                onClick={() => setActiveHeroTab('traditional')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeHeroTab === 'traditional'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Traditional
              </button>
              <button
                type="button"
                onClick={() => setActiveHeroTab('technical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeHeroTab === 'technical'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Technical Stack
              </button>
              <button
                type="button"
                onClick={() => setActiveHeroTab('executive')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeHeroTab === 'executive'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Executive
              </button>
            </div>

            {/* Floating A4 Card Showcase */}
            <div className="relative w-full max-w-[460px] sm:max-w-[480px]">
              
              {/* Floating Top Badge: ATS Score */}
              <div className="absolute -top-3.5 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-emerald-200 rounded-full px-3.5 py-1.5 shadow-lg shadow-emerald-900/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-900">ATS Score: 98/100</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Top 2%
                </span>
              </div>

              {/* Floating Bottom Badge: Vector Safety */}
              <div className="absolute -bottom-3.5 right-4 z-20 flex items-center gap-2 bg-slate-900/95 backdrop-blur-xs text-white rounded-full px-3.5 py-1.5 shadow-xl border border-slate-800 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Vector PDF • Single-Column Safe</span>
              </div>

              {/* The Styled A4 Preview Window */}
              <div className="w-full h-[580px] sm:h-[620px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden relative group transition-transform duration-300 hover:-translate-y-1">
                
                {/* Window Bar */}
                <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    A4 Print Standard • 794 × 1123
                  </span>
                  <Link
                    href={`/builder?template=${activeHeroTab === 'classic' ? 'classic-ats' : activeHeroTab === 'traditional' ? 'traditional-ats' : activeHeroTab === 'technical' ? 'technical-clean' : 'modern-executive'}&step=9`}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Edit <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Scaled A4 Sheet Container */}
                <div className="w-full h-full overflow-hidden bg-slate-100/60 flex justify-center p-3">
                  <div
                    className="origin-top transition-all duration-300"
                    style={{
                      transform: 'scale(0.56)',
                      width: '794px',
                    }}
                  >
                    {getHeroComponent()}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TEMPLATE CAROUSEL SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl lg:text-[2.5rem] font-black text-slate-900 tracking-tight">
              Pick an ATS-Certified Template
            </h2>
            <p className="text-base text-slate-600 font-normal leading-relaxed">
              Every template is built with clean single-column structure and verified against Taleo, Workday, and Greenhouse OCR scanners.
            </p>
          </div>

          {/* Carousel Scroll Container */}
          <div className="relative">
            <div 
              ref={templateScrollRef}
              onScroll={handleScroll}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6"
            >
              {templates.map((tpl) => (
                <div 
                  key={tpl.id} 
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header Info */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tpl.tag}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${tpl.badgeColor}`}>
                      ATS Ready
                    </span>
                  </div>

                  {/* Scaled Preview Frame */}
                  <div className="h-[340px] bg-slate-100/60 overflow-hidden relative flex justify-center p-2.5">
                    <div 
                      className="origin-top pointer-events-none"
                      style={{ 
                        width: '794px',
                        transform: 'scale(0.38)',
                      }}
                    >
                      <tpl.Component content={tpl.mock} />
                    </div>

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center p-4">
                      <Link
                        href={`/builder?template=${tpl.templateId}&step=9`}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
                      >
                        <span>Use This Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Card Bottom Description */}
                  <div className="p-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {tpl.description}
                    </p>
                    <Link
                      href={`/builder?template=${tpl.templateId}&step=9`}
                      className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1 pt-1"
                    >
                      Customize Template <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-slate-600 text-sm font-medium text-center mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Single-Column OCR Safe</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Native Vector PDF Text Streams</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant AI Bullet Point Rewrites</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/builder?step=9"
              className="text-emerald-700 font-extrabold text-sm hover:text-emerald-800 flex items-center justify-center gap-1.5 transition-all hover:gap-2"
            >
              Browse All Templates in Builder <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS SECTION (Fully Responsive Bento Grid)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl lg:text-[2.5rem] font-black text-slate-900 tracking-tight">
              Trusted by 50,000+ Job Seekers
            </h2>
            <p className="text-base text-slate-600 font-normal leading-relaxed">
              Stop guessing what corporate recruiters want. Our intelligent system formats, scores, and tailors your application for maximum impact.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 sm:p-8 space-y-2 shadow-2xs hover:shadow-sm transition-all text-center sm:text-left">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-700 tracking-tight">
                98%
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">ATS Pass Rate</h3>
              <p className="text-xs text-slate-600">Tested across Taleo, Workday, and Greenhouse tracking systems.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-2 shadow-2xs hover:shadow-sm transition-all text-center sm:text-left">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                50,000+
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Resumes Created</h3>
              <p className="text-xs text-slate-600">Built by engineers and professionals landing interviews.</p>
            </div>

            <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-6 sm:p-8 space-y-2 shadow-2xs hover:shadow-sm transition-all text-center sm:text-left">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-teal-700 tracking-tight">
                10x
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Faster Creation</h3>
              <p className="text-xs text-slate-600">Instant AI bullet formatting and real-time live preview.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-2 shadow-2xs hover:shadow-sm transition-all text-center sm:text-left">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                0%
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">OCR Parse Errors</h3>
              <p className="text-xs text-slate-600">Guaranteed clean vector font glyphs without broken tables.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DARK "BEAT THE ATS" SECTION (Cohesive Slate & Emerald)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white">
        
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          
          <div className="space-y-6 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise ATS Compliance Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.1] tracking-tight">
              Beat the ATS with AI-Optimized Resumes
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              75% of candidate resumes are rejected by applicant tracking algorithms before a human recruiter ever sees them. ResumAI standardizes your structure, extracts core keywords, and enforces Google&apos;s X-Y-Z achievement formulas.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/builder"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-950/40 transition-all text-center"
              >
                Create ATS-Friendly Resume
              </Link>
              <Link
                href="/checker"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold rounded-xl transition-all text-center"
              >
                Scan Existing Resume
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-sm">Smart Keyword Matching</h4>
                <p className="text-xs text-slate-400 mt-0.5">Identifies critical skills and qualifications missing from your CV.</p>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 bg-teal-500/15 border border-teal-500/30 rounded-xl flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-sm">Flawless System Parsing</h4>
                <p className="text-xs text-slate-400 mt-0.5">Single-column hierarchy guaranteed to pass Workday &amp; Taleo OCR.</p>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-sm">Google X-Y-Z Optimization</h4>
                <p className="text-xs text-slate-400 mt-0.5">Rewrites weak bullets into quantified accomplishments with metrics.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          AI FEATURES ACCORDION SECTION
          ═══════════════════════════════════════════════════════ */}
      <AiFeaturesSection />

      {/* ═══════════════════════════════════════════════════════
          FINAL FOOTER CALL-TO-ACTION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white text-center border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-base text-slate-600 font-normal max-w-xl mx-auto">
            Join thousands of candidates who landed software engineering, product, and leadership roles.
          </p>
          <div className="pt-2">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-9 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-extrabold rounded-xl shadow-lg shadow-emerald-600/25 transition-transform hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5" />
              <span>Build Your Free ATS Resume</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
