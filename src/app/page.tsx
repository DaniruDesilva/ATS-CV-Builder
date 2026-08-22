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
  Briefcase,
  Bot,
  Wand2,
  Palette,
  MessageSquare,
  RefreshCw,
  Edit3,
  Trash2,
  Settings,
  Type,
  ListFilter,
  CheckCheck,
  FileBadge
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  // Hero Interactive Showcase State
  const [heroMode, setHeroMode] = useState<0 | 1 | 2>(0); // 0: AI Assistant, 1: ATS Check, 2: Colors & Style
  const [selectedColor, setSelectedColor] = useState<string>('#1d4ed8'); // Default accent color for resume
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiTypingText, setAiTypingText] = useState<string>('Generate executive impact bullets from job posting...');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Template carousel state
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<'all' | 'ats' | 'executive' | 'tech' | 'minimal'>('all');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // AI Suite Showcase Tab state
  const [activeAiTab, setActiveAiTab] = useState<number>(0);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const availableColors = [
    { name: 'Deep Blue', value: '#1d4ed8' },
    { name: 'Teal', value: '#0f766e' },
    { name: 'Crimson', value: '#b91c1c' },
    { name: 'Purple', value: '#6d28d9' },
    { name: 'Cyan', value: '#0369a1' },
    { name: 'Midnight', value: '#0f172a' },
    { name: 'Charcoal', value: '#334155' },
    { name: 'Royal', value: '#4338ca' },
    { name: 'Amber', value: '#c2410c' },
    { name: 'Olive', value: '#4d7c0f' },
  ];

  // Auto-cycle through the 3 hero modes every 8 seconds if user hasn't manually clicked recently
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroMode((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handleAiActionClick = (prompt: string) => {
    setIsAiGenerating(true);
    setCustomPrompt(prompt);
    setTimeout(() => {
      setIsAiGenerating(false);
    }, 600);
  };

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
      previewOriginal: 'Parsing candidate data: Ethan Smith (Chief Experience Officer)...',
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
      previewOriginal: 'Matched Skills: Customer Experience, Journey Mapping, CRM',
      previewEnhanced: 'High Impact Keywords Added: Digital Transformation, Cross-functional Leadership, Net Promoter Score (NPS), Churn Reduction',
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
      previewOriginal: 'Led customer success operations and helped retain accounts.',
      previewEnhanced: 'Spearheaded retention program for 40+ enterprise accounts, reducing churn by 32% and unlocking $1.8M in annualized expansion revenue.',
      badge: 'High Impact'
    }
  ];

  const testimonials = [
    {
      quote: "ResumAI's ATS check caught 3 formatting issues that my previous builder caused. Within 2 weeks of switching, I received interview calls from Amazon and Stripe.",
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
    <div className="space-y-0 text-slate-900 bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Enhancv Pixel-Perfect Redesign) */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-32 overflow-hidden bg-[#ffffff]">
        
        {/* Soft Pastel Ambient Aura Gradients (Signature Enhancv Background) */}
        <div 
          className="absolute -bottom-24 -left-20 w-[600px] h-[550px] rounded-full blur-[110px] pointer-events-none opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(167,243,208,0.7) 0%, rgba(204,251,241,0.5) 45%, rgba(255,255,255,0) 70%)'
          }}
        />
        <div 
          className="absolute -bottom-28 right-0 w-[650px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-65"
          style={{
            background: 'radial-gradient(circle, rgba(254,215,226,0.6) 0%, rgba(237,233,254,0.6) 45%, rgba(255,255,255,0) 75%)'
          }}
        />
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-[130px] pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(224,242,254,0.6) 0%, rgba(255,255,255,0) 70%)'
          }}
        />

        {/* Floating subtle ambient dots (matching Enhancv) */}
        <div className="absolute top-24 left-16 w-2.5 h-2.5 rounded-full bg-[#10b981]/30 pointer-events-none hidden lg:block" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-[#0d9488]/30 pointer-events-none hidden lg:block" />
        <div className="absolute top-28 right-12 w-2.5 h-2.5 rounded-full bg-[#10b981]/30 pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-[#8b5cf6]/20 pointer-events-none hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtext, Buttons & Trust Proof */}
            <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
              
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black text-[#1a1f2c] tracking-[-0.03em] leading-[1.12]">
                Land more interviews with ResumAI&apos;s{' '}
                <span className="text-[#5B4BE0] inline-block font-black">
                  Resume Builder
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#4b5563] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Create a beautiful, ATS-friendly resume with the help of features like <strong>AI Resume Writer</strong>, <strong>ATS Check</strong>, and <strong>One-Click Job Tailoring</strong>. It&apos;s the best way to make an impression.
              </p>

              {/* Action Buttons (Enhancv Style) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#0eb075] hover:bg-[#0ca068] text-white font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Build Your Resume
                </Link>

                <Link
                  href="/checker"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-base shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Get Your Resume Score
                </Link>
              </div>

              {/* Social Proof Row: Trustpilot Stars + Interviews Counter */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-sm text-slate-600">
                {/* 5 Green Trustpilot-Style Stars */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-[21px] h-[21px] rounded-[3px] bg-[#0eb075] flex items-center justify-center text-white">
                        <Star className="w-3.5 h-3.5 fill-white" />
                      </div>
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">5,321 Reviews</span>
                </div>

                {/* Users landed interviews stat */}
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">
                    <strong className="text-slate-900 font-bold">28,452 users</strong> landed interviews last month
                  </span>
                </div>
              </div>

              {/* Interactive Showcase Mode Switcher Tabs */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Preview Feature:</span>
                <button
                  onClick={() => setHeroMode(0)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    heroMode === 0
                      ? 'bg-[#5B4BE0] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> AI Assistant
                </button>
                <button
                  onClick={() => setHeroMode(1)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    heroMode === 1
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <Shield className="w-3 h-3" /> ATS Check
                </button>
                <button
                  onClick={() => setHeroMode(2)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    heroMode === 2
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <Palette className="w-3 h-3" /> Colors & Design
                </button>
              </div>

            </div>

            {/* Right Column: Enhancv High-Fidelity Realistic Resume Showcase & Dynamic Overlays */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              
              {/* Main Container with 3D feel and soft shadow */}
              <div className="relative w-full max-w-[510px] perspective-1000">
                
                {/* 1. Realistic Multi-Column Resume Sheet (Ethan Smith CXO) */}
                <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-7 text-left space-y-4 transition-all duration-300">
                  
                  {/* Resume Header */}
                  <div className="border-b border-slate-100 pb-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 
                          className="text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          ETHAN SMITH
                        </h2>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-700">
                          Chief Experience Officer | Customer-Centric Strategies | Digital Transformation
                        </p>
                      </div>
                      
                      {/* Candidate avatar if in mode 1 or 2 */}
                      {(heroMode === 1 || heroMode === 2) && (
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full ring-2 ring-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                              alt="Ethan Smith"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {heroMode === 2 && (
                            <span className="absolute -bottom-1 -right-2 bg-[#0eb075] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
                              HIRED
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1 pt-1 font-medium">
                      <span>✉ e.smith@resumai.com</span>
                      <span>🔗 linkedin.com/in/ethansmith</span>
                      <span>📍 Indianapolis, Indiana</span>
                    </div>
                  </div>

                  {/* 2-Column Realistic Resume Body Layout */}
                  <div className="grid grid-cols-12 gap-4 text-[10px] leading-relaxed">
                    
                    {/* Left Column (60%): Summary & Experience */}
                    <div className="col-span-7 space-y-3.5 border-r border-slate-100 pr-3">
                      
                      {/* Summary */}
                      <div className="space-y-1">
                        <span 
                          className="font-extrabold text-[10px] uppercase tracking-wider block transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          Summary
                        </span>
                        <p className="text-slate-600 text-[10.5px] leading-tight">
                          With over 10 years in customer experience management, I excel in creating impactful strategies that enhance customer journeys. Proven record in leading teams, 30% increase in customer satisfaction.
                        </p>
                      </div>

                      {/* Experience */}
                      <div className="space-y-2">
                        <span 
                          className="font-extrabold text-[10px] uppercase tracking-wider block transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          Experience
                        </span>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-[11px]">Chief Experience Officer</span>
                            <span className="text-[9px] text-slate-400 font-medium">01/2021 – Present</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 block">TechFront Solutions</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[10px] pl-0.5">
                            <li>Developed and implemented an extensive customer experience strategy that achieved a 35% increase in Net Promoter Score (NPS) within the first year.</li>
                            <li>Led a cross-functional team to enhance customer journey mappings, reducing customer churn rate by 25% through proactive engagement.</li>
                          </ul>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-[11px]">Director of Customer Experience</span>
                            <span className="text-[9px] text-slate-400 font-medium">06/2018 – 12/2020</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Velocity Tech Innovations</span>
                          <p className="text-slate-600 text-[10px]">
                            Oversaw the redesign of the customer feedback loop, resulting in a 20-point increase in CSAT scores across touchpoints.
                          </p>
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="space-y-1 pt-1">
                        <span 
                          className="font-extrabold text-[10px] uppercase tracking-wider block transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          Languages
                        </span>
                        <div className="flex items-center gap-4 text-slate-600 text-[10px]">
                          <div>
                            <span className="font-semibold text-slate-800">English:</span> Native
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800">Spanish:</span> Fluent
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column (40%): Key Achievements, Skills, Education */}
                    <div className="col-span-5 space-y-3.5 pl-1">
                      
                      {/* Key Achievements */}
                      <div className="space-y-1.5">
                        <span 
                          className="font-extrabold text-[10px] uppercase tracking-wider block transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          Key Achievements
                        </span>
                        
                        <div className="space-y-1 text-[10px]">
                          <span className="font-bold text-slate-800 block leading-tight">Revamped CX System</span>
                          <p className="text-slate-500 text-[9.5px]">Prioritized customer feedback loop that increased speed to resolution by 35%.</p>
                        </div>

                        <div className="space-y-1 text-[10px] pt-1">
                          <span className="font-bold text-slate-800 block leading-tight">Increased Retention</span>
                          <p className="text-slate-500 text-[9.5px]">Successfully designed a customer loyalty program that elevated customer retention by 28%.</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-1 pt-1">
                        <span 
                          className="font-extrabold text-[10px] uppercase tracking-wider block transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          Skills
                        </span>
                        <div className="flex flex-wrap gap-1 text-[9px]">
                          {['CX Strategy', 'Data Analysis', 'Journey Mapping', 'Cross-Team Leadership', 'CRM CRM'].map((sk) => (
                            <span key={sk} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-0.5 pt-1">
                        <span 
                          className="font-extrabold text-[10px] uppercase tracking-wider block transition-colors duration-300"
                          style={{ color: selectedColor }}
                        >
                          Education
                        </span>
                        <span className="font-bold text-slate-800 text-[10px] block">MBA</span>
                        <span className="text-[9.5px] text-slate-500 block">University of Chicago</span>
                      </div>

                    </div>

                  </div>

                  {/* Mode 1 Toolbar Docked at the Bottom (Enhancv Image 1 style) */}
                  {heroMode === 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <button className="px-3 py-1 rounded-full bg-[#0eb075] text-white text-[11px] font-bold shadow-sm flex items-center gap-1 hover:bg-[#0ca068] transition">
                          + New entry
                        </button>
                        <button className="px-3 py-1 rounded-full bg-[#5B4BE0] text-white text-[11px] font-bold shadow-sm hover:bg-[#4f40d8] transition">
                          New Group
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="p-1 rounded hover:bg-slate-100 hover:text-slate-700 cursor-pointer font-bold text-xs">T</span>
                        <ListFilter className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                        <Trash2 className="w-3.5 h-3.5 hover:text-red-600 cursor-pointer" />
                        <Settings className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                      </div>
                    </div>
                  )}

                </div>

                {/* ─────────────────────────────────────────────────────────────
                    DYNAMIC OVERLAYS ACCORDING TO ACTIVE HERO MODE
                   ───────────────────────────────────────────────────────────── */}

                {/* MODE 0: AI ASSISTANT POPOVER (Enhancv Image 1) */}
                {heroMode === 0 && (
                  <div className="absolute -bottom-6 -right-4 sm:-right-8 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 space-y-3 animate-fade-in z-20">
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                      <span className="w-2 h-2 rounded-full bg-[#5B4BE0] animate-ping" />
                      <Sparkles className="w-3.5 h-3.5 text-[#5B4BE0]" />
                      <span>AI ASSISTANT</span>
                    </div>

                    {/* Action 1 */}
                    <button
                      onClick={() => handleAiActionClick('Generate Skills from Job')}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#5B4BE0] hover:bg-purple-50/50 transition-all flex items-center gap-2.5 group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#5B4BE0] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#5B4BE0]">
                        Generate Skills from Job
                      </span>
                    </button>

                    {/* Action 2 */}
                    <button
                      onClick={() => handleAiActionClick('Inspire Me with executive bullets')}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#5B4BE0] hover:bg-purple-50/50 transition-all flex items-center gap-2.5 group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#5B4BE0] flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#5B4BE0]">
                        Inspire Me
                      </span>
                    </button>

                    {/* Or Divider */}
                    <div className="relative text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <span className="relative bg-white px-2 text-[10px] text-slate-400 font-bold uppercase">or</span>
                    </div>

                    {/* Input box */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter a custom request..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#5B4BE0] focus:ring-2 focus:ring-purple-100 outline-none text-slate-800"
                      />
                      {isAiGenerating && (
                        <div className="absolute right-2.5 top-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#5B4BE0] animate-spin" />
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* MODE 1: ATS CHECK & JOB TAILORING (Enhancv Image 2) */}
                {heroMode === 1 && (
                  <>
                    {/* Floating Target Badges (Top Right) */}
                    <div className="absolute -top-3 -right-2 sm:-right-6 space-y-1.5 z-20 animate-fade-in">
                      <div className="bg-[#4338ca] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transform rotate-2">
                        <span>🏷️ Application at Google</span>
                      </div>
                      <div className="bg-[#4d7c0f] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transform -rotate-1">
                        <span>🏷️ Application at Tesla</span>
                      </div>
                    </div>

                    {/* Floating Left ATS Check Panel */}
                    <div className="absolute -bottom-6 -left-4 sm:-left-10 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 space-y-3 animate-fade-in z-20 text-left">
                      
                      {/* Top Score Bar */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                          <Shield className="w-4 h-4 text-[#0eb075]" />
                          <span>ATS Check</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#0eb075]">85%</span>
                          <div className="w-14 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-[#0eb075] rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Job target */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Target Job</span>
                        <div className="px-2 py-1 rounded bg-slate-50 text-slate-800 text-[11px] font-bold border border-slate-200/60">
                          Strategic Account Executive
                        </div>
                      </div>

                      {/* Tailoring checklist */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                          ● HARD SKILLS GAP
                        </span>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span>Facilitated enterprise sales cycles</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span>User retention optimization</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                            <span className="w-3 h-3 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] font-bold">✕</span>
                            <span>Reporting automation (missing)</span>
                          </div>
                        </div>
                      </div>

                      {/* Soft skills */}
                      <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>All 6 core soft skills matched!</span>
                      </div>

                    </div>
                  </>
                )}

                {/* MODE 2: LIVE COLOR PICKER & BACKGROUND PATTERNS (Enhancv Image 3) */}
                {heroMode === 2 && (
                  <>
                    {/* Left: Backgrounds Selector */}
                    <div className="absolute -bottom-6 -left-4 sm:-left-8 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 space-y-2 animate-fade-in z-20 text-left">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Backgrounds
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="h-10 rounded-lg border-2 border-emerald-500 bg-slate-50 flex items-center justify-center relative cursor-pointer">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="h-10 rounded-lg border border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:6px_6px] cursor-pointer hover:border-slate-400" />
                        <div className="h-10 rounded-lg border border-slate-200 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:6px_6px] cursor-pointer hover:border-slate-400" />
                        <div className="h-10 rounded-lg border border-slate-200 bg-slate-100 cursor-pointer hover:border-slate-400" />
                      </div>
                    </div>

                    {/* Right: Colors Selector (Enhancv Image 3 with live resume update) */}
                    <div className="absolute -bottom-8 -right-4 sm:-right-8 w-56 sm:w-60 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 space-y-3 animate-fade-in z-20 text-left">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                        COLORS
                      </span>
                      
                      {/* Grid of 10 color swatches */}
                      <div className="grid grid-cols-5 gap-2">
                        {availableColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.value)}
                            title={color.name}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm relative"
                            style={{ backgroundColor: color.value }}
                          >
                            {selectedColor === color.value && (
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedColor('#5B4BE0')}
                          className="text-[11px] font-bold text-[#5B4BE0] hover:underline block"
                        >
                          Use custom color
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THREE-PILLAR VALUE BAR (Enhancv Style) */}
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
