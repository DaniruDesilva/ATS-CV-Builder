'use client';

import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Zap,
  ArrowRight,
  Check,
  Shield,
  Star,
  Sparkles,
  ChevronDown,
  Layers,
  Award,
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Users,
  Search,
  Sliders,
  ExternalLink,
  MessageSquareQuote,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  // Template carousel state
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<'all' | 'ats' | 'executive' | 'tech' | 'minimal'>('all');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // AI Suite Showcase Tab state
  const [activeAiTab, setActiveAiTab] = useState<number>(0);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const templateList = [
    {
      id: 'classic-ats',
      name: 'Classic Single Column',
      category: 'ats',
      tag: '100% ATS Safe',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Standard single-column layout strictly designed to pass Taleo, Workday, and Greenhouse.',
      accent: 'border-emerald-500',
      headerBg: 'bg-emerald-600',
      font: 'Inter / Arial'
    },
    {
      id: 'modern-executive',
      name: 'Modern Executive',
      category: 'executive',
      tag: 'Leadership',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Sophisticated header accent bar highlighting senior executive credentials and key metrics.',
      accent: 'border-blue-500',
      headerBg: 'bg-blue-600',
      font: 'Rubik / Inter'
    },
    {
      id: 'technical-clean',
      name: 'Technical Clean',
      category: 'tech',
      tag: 'Tech Stack First',
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Emphasizes programming languages, database architectures, and engineering projects.',
      accent: 'border-indigo-500',
      headerBg: 'bg-indigo-600',
      font: 'Roboto Mono / Inter'
    },
    {
      id: 'ivy-league',
      name: 'Ivy League Academic',
      category: 'minimal',
      tag: 'Traditional',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Clean serif typography and formal horizontal dividing lines for law, finance, and academia.',
      accent: 'border-amber-500',
      headerBg: 'bg-amber-700',
      font: 'Georgia / Times'
    },
    {
      id: 'compact-minimal',
      name: 'Compact High Performer',
      category: 'minimal',
      tag: 'Dense Info',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-200',
      description: 'Optimized whitespace density designed to fit 10+ years of career progression onto 1 or 2 pages.',
      accent: 'border-slate-500',
      headerBg: 'bg-slate-800',
      font: 'Inter / System'
    },
    {
      id: 'contemporary',
      name: 'Contemporary Clean',
      category: 'executive',
      tag: 'Modern SaaS',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
      description: 'Subtle pill tags for skills and highlighted achievement metrics for high recruiter engagement.',
      accent: 'border-teal-500',
      headerBg: 'bg-teal-600',
      font: 'Outfit / Inter'
    }
  ];

  const filteredTemplates = activeTemplateCategory === 'all'
    ? templateList
    : templateList.filter((t) => t.category === activeTemplateCategory);

  const aiFeatures = [
    {
      id: 0,
      title: 'AI Content Generation',
      subtitle: 'Targeted suggestions grounded in your real experience',
      bullets: [
        'Instant role-specific bullet suggestions tailored to your target job',
        'Matches the professional tone and terminology executive recruiters look for',
        'Keeps you in full control of all inputs and generated output'
      ],
      previewTitle: 'AI Experience Assistant',
      previewOriginal: 'Worked on backend APIs and improved performance.',
      previewEnhanced: 'Architected high-throughput microservices handling 2.4M daily requests, reducing API latency by 45% using Redis caching.',
      badge: 'Google X-Y-Z Formula'
    },
    {
      id: 1,
      title: 'AI Resume Scanner & Parsing',
      subtitle: 'Instant parsing analysis just like modern ATS software reads it',
      bullets: [
        'Upload your PDF or DOCX resume to extract all content blocks',
        'Test parseability across contact details, job titles, and dates',
        'Identify formatting red flags that cause automated ATS rejections'
      ],
      previewTitle: 'ATS Scanner Output',
      previewOriginal: 'Parsing candidate data: Alex Rivera (Senior Full Stack Engineer)...',
      previewEnhanced: '✅ 100% Parseable Structure: 0 parsing errors detected across Taleo & Workday engines.',
      badge: 'Score: 98/100'
    },
    {
      id: 2,
      title: 'AI Skills & Keyword Matcher',
      subtitle: 'Uncover the missing keywords employers scan for',
      bullets: [
        'Compare your resume against any target job description',
        'Identify crucial missing technical and leadership keywords',
        'Optimize keyword density naturally without artificial keyword stuffing'
      ],
      previewTitle: 'Keyword Gap Analysis',
      previewOriginal: 'Matched Skills: TypeScript, React, Next.js, Node.js, SQL',
      previewEnhanced: 'High Impact Keywords Added: Microservices, Redis Caching, CI/CD Pipelines, System Architecture',
      badge: 'Top 5% Match'
    },
    {
      id: 3,
      title: 'AI Google X-Y-Z Rewriter',
      subtitle: 'Transform weak statements into quantified achievements',
      bullets: [
        'Converts passive duties into high-impact accomplishment statements',
        'Integrates measurable percentage and dollar metrics effortlessly',
        'Applies the formula: Accomplished [X], measured by [Y], by doing [Z]'
      ],
      previewTitle: 'Quantified Bullet Transformer',
      previewOriginal: 'Led the redesign of the company payment checkout flow.',
      previewEnhanced: 'Spearheaded checkout flow redesign, increasing checkout conversion by 28% and boosting annual revenue by $1.2M.',
      badge: 'High Impact'
    }
  ];

  const testimonials = [
    {
      quote: "ResumAI's ATS check caught 3 formatting issues that my previous builder caused. Within 2 weeks of switching to the Classic ATS template, I received interview calls from Amazon and Stripe.",
      name: 'Marcus Vance',
      role: 'Senior Staff Engineer at Fintech',
      rating: 5,
      date: '2 days ago'
    },
    {
      quote: 'The AI Bullet Rewriter using the Google X-Y-Z formula is phenomenal. It took my bland job descriptions and turned them into quantified executive achievements in seconds.',
      name: 'Elena Rostova',
      role: 'Product Lead',
      rating: 5,
      date: '4 days ago'
    },
    {
      quote: 'Finally, an ATS resume builder that creates genuinely clean, beautiful vector PDFs without breaking Applicant Tracking Systems. 10/10 recommended for job seekers.',
      name: 'David Chen',
      role: 'DevOps & Cloud Architect',
      rating: 5,
      date: '1 week ago'
    }
  ];

  const faqs = [
    {
      q: 'How does ResumAI guarantee 100% ATS compatibility?',
      a: 'Unlike graphic-heavy platforms that use multi-column text boxes, tables, or unselectable canvas elements, ResumAI generates clean, single-column semantic vector PDFs with standard typography and header structures that Taleo, Workday, Greenhouse, and Lever parse with 100% accuracy.'
    },
    {
      q: 'What is the Google X-Y-Z formula in the AI Bullet Rewriter?',
      a: "The Google X-Y-Z formula is the gold standard for executive resume writing: 'Accomplished [X], measured by [Y], by doing [Z]'. Our integrated AI assistant automatically rewrites your responsibilities into quantified accomplishments."
    },
    {
      q: 'Can I upload and score my existing resume?',
      a: 'Yes! Navigate to our AI Resume Checker, upload your PDF or DOCX file, and receive an instant 0-100 ATS compatibility score, section-by-section breakdown, and bullet point improvements.'
    },
    {
      q: 'Can I download vector PDFs without watermarks?',
      a: 'Yes, you can generate and download clean, professional vector PDFs ready for immediate job applications.'
    },
    {
      q: 'Can I customize colors, fonts, and sections?',
      a: 'Yes! The builder provides real-time customization of accent colors, font families, margins, and section orders with an instant live preview.'
    }
  ];

  return (
    <div className="space-y-0 text-slate-900 bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. HERO SECTION (The Fold) */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/90 via-emerald-50/20 to-white">
        
        {/* Subtle mesh background blurs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-teal-100/30 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen ATS Resume Builder & AI Suite</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Land more interviews with ResumAI&apos;s{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
                  Resume Builder
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Create a beautiful, ATS-friendly resume with the help of features like <strong>AI Resume Writer</strong>, <strong>ATS Check</strong>, and <strong>One-Click Job Tailoring</strong>. It&apos;s the best way to make an impression.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4" /> Build Your Resume
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/checker"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Get Your Resume Score
                </Link>
              </div>

              {/* Social Proof Bar */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                        <Star className="w-3 h-3 fill-white text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-900">5321 Reviews</span>
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-700">
                    <strong className="text-slate-900 font-black">28,452 users</strong> landed interviews last month
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive Resume Preview */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-4 transition-all duration-300 hover:shadow-emerald-500/10 hover:-translate-y-1">
                
                {/* Floating HIRED Badge */}
                <div className="absolute -top-4 -right-3 bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 animate-bounce flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4" /> HIRED
                </div>

                {/* Floating ATS Score Badge */}
                <div className="absolute -bottom-4 -left-3 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-800">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>ATS Score: <strong className="text-emerald-400 font-black text-sm">98/100</strong></span>
                </div>

                {/* Resume Top Profile Header */}
                <div className="border-b border-slate-100 pb-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-slate-900">Alex Rivera</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      Senior Engineer
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
                    <span>San Francisco, CA</span> • <span>alex.rivera@example.com</span> • <span>+1 (555) 234-5678</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-1 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Summary</span>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Results-driven Senior Full Stack Engineer with 6+ years of experience leading microservices architecture, cloud platform scalability, and modern Next.js applications.
                  </p>
                </div>

                {/* Experience Item with Highlighted AI Rewriter */}
                <div className="space-y-2 text-left pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Apex Tech Solutions</span>
                    <span className="text-[10px] text-slate-400 font-medium">2022 — Present</span>
                  </div>

                  {/* Highlighted AI Box */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> AI Google X-Y-Z Formula
                      </span>
                      <span className="text-[9px] bg-emerald-200 text-emerald-900 font-extrabold px-1.5 py-0.5 rounded">High Impact</span>
                    </div>
                    <p className="text-[11px] text-slate-800 font-medium leading-tight">
                      &quot;Architected high-throughput microservices handling 2M+ daily active requests, reducing API latency by 45% through Redis caching.&quot;
                    </p>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {skill}
                    </span>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THREE-PILLAR VALUE BAR */}
      <section className="border-y border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left items-center">
            
            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                ATS-friendly, professionally designed resumes
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                Customizable sections, fonts, colors, and margins
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                Single-column, double-column, and clean vector PDFs
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TEMPLATE SHOWCASE CAROUSEL */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pick a template and build your resume in minutes!
            </h2>
            <p className="text-base text-slate-500 font-normal">
              Every template is reviewed and certified for 100% parseability by ATS software.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Templates' },
              { id: 'ats', label: '100% ATS Classic' },
              { id: 'executive', label: 'Modern Executive' },
              { id: 'tech', label: 'Technical Stack' },
              { id: 'minimal', label: 'Compact Minimal' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTemplateCategory(cat.id as any);
                  setCarouselIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTemplateCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 text-left pt-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group relative bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Template Mockup Card */}
                <div className="w-full h-56 rounded-xl bg-slate-50 border border-slate-200/80 p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
                  
                  {/* Top Bar Indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md border ${tpl.tagColor}`}>
                      {tpl.tag}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{tpl.font}</span>
                  </div>

                  {/* Mini Template Blueprint */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-24 rounded ${tpl.headerBg}`}></div>
                      <div className="h-2 w-12 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                    <div className="h-1.5 w-4/5 bg-slate-100 rounded"></div>
                    <div className="flex gap-1 pt-1">
                      <div className="h-2 w-8 bg-emerald-100 rounded"></div>
                      <div className="h-2 w-10 bg-emerald-100 rounded"></div>
                      <div className="h-2 w-8 bg-emerald-100 rounded"></div>
                    </div>
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <Link
                      href={`/builder?template=${tpl.id}`}
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-xl transition-transform transform group-hover:scale-105 flex items-center gap-2"
                    >
                      <MousePointerClick className="w-4 h-4" /> Start With This Template
                    </Link>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {tpl.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. STATS & AUTHORITY SECTION (Enhancv Style) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: 4 Elevated Stat Boxes */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-5">
              {[
                { value: '15M+', label: 'Resumes created worldwide', color: 'text-emerald-600' },
                { value: '10M+', label: 'Role-specific resume examples', color: 'text-teal-600' },
                { value: '100%', label: 'ATS parse rate on Taleo & Workday', color: 'text-blue-600' },
                { value: '1M+', label: 'Monthly career blog readers', color: 'text-indigo-600' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-center space-y-2 hover:shadow-lg transition-all"
                >
                  <span className={`text-3xl sm:text-4xl font-black ${stat.color} tracking-tight block`}>
                    {stat.value}
                  </span>
                  <p className="text-xs font-bold text-slate-600 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Narrative Story */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Chosen by <span className="text-emerald-600">10 million</span> job applicants around the world
              </h2>
              
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                ResumAI combines advanced AI writing algorithms, real-time ATS scoring, and recruiter-approved formatting into a single platform. We help job seekers—from university graduates to senior executives—lead with their measurable achievements and land callbacks.
              </p>

              <p className="text-sm text-slate-500 leading-relaxed">
                At ResumAI, we believe the best resumes feel human while adhering strictly to automated parsing rules. You control the narrative, and our AI ensures you never get rejected due to formatting errors or weak action verbs.
              </p>

              <div className="pt-2">
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-600 hover:text-emerald-700 group"
                >
                  <span>Build your interview-ready resume now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HIGH-CONTRAST DARK ATS SECTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Glowing background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>ATS Verification Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Resumes optimized for Applicant Tracking Systems (ATS)
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              We test every ResumAI template against major corporate Applicant Tracking Systems (Workday, Taleo, Greenhouse, and Lever). Clean single-column structures, standard fonts, and distinct section headers keep your career data intact for recruiter screening.
            </p>
          </div>

          {/* 3 ATS Proof Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 space-y-3 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Readable Contact Info</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parsed without headers or footer nesting traps, ensuring your phone, email, and LinkedIn are immediately recognized.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 space-y-3 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Full Experience Hierarchy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Job titles, company names, start/end dates, and location parameters are cleanly mapped to standard ATS fields.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 space-y-3 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Optimized Skills Density</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches the exact keywords found in target job listings so your resume ranks in the top 5% of candidate pools.
              </p>
            </div>

          </div>

          <div className="pt-2 text-center lg:text-left">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-xl transition-all"
            >
              Build an ATS-Friendly Resume <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE AI SUITE FEATURE SHOWCASE (Tabbed Switcher) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Write a stronger resume with the AI assistant
            </h2>
            <p className="text-base text-slate-500">
              Chat in plain language or trigger one-click actions to write, optimize, and improve your resume in real time.
            </p>
          </div>

          {/* Interactive Tab Switcher & Dynamic Demo */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
            
            {/* Left Tabs List */}
            <div className="lg:col-span-5 space-y-3">
              {aiFeatures.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveAiTab(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    activeAiTab === idx
                      ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-200'
                      : 'bg-transparent border-transparent hover:bg-white/60 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 block">{item.title}</span>
                    {activeAiTab === idx && <Sparkles className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">{item.subtitle}</p>

                  {/* Expanded bullets on active */}
                  {activeAiTab === idx && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 mt-3 animate-fade-in">
                      {item.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Interactive Visual Demo */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg relative min-h-[340px] flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {aiFeatures[activeAiTab].previewTitle}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {aiFeatures[activeAiTab].badge}
                </span>
              </div>

              {/* Before & After Demonstration */}
              <div className="space-y-4 text-left">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Before (Standard Phrasing):</span>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    &quot;{aiFeatures[activeAiTab].previewOriginal}&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> After (AI Optimized):
                  </span>
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                    &quot;{aiFeatures[activeAiTab].previewEnhanced}&quot;
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Powered by OpenRouter AI</span>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800"
                >
                  Try in Builder →
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trusted by executives & senior professionals
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-extrabold text-slate-700">4.9 / 5.0 Rating from 5,321 job seekers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-emerald-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-emerald-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{t.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-xs font-extrabold text-slate-900 block">{t.name}</span>
                  <span className="text-[11px] text-slate-500">{t.role}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE FAQ ACCORDION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">Everything you need to know about building an ATS-safe CV.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-extrabold text-sm text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3.5 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to land your dream job?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Join thousands of professionals who beat automated ATS filters and secure callbacks with ResumAI.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-white text-emerald-900 font-black text-sm hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Create Your Resume Free
            </Link>

            <Link
              href="/checker"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-extrabold text-sm border border-emerald-500/40 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Score My Existing Resume
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
