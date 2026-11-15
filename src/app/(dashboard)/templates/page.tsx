'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
  Eye,
  ShieldCheck,
  Check,
  X,
  FileText,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Zap,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { TemplateId, ResumeContent } from '@/types/resume';
import {
  ClassicAtsDom,
  ModernExecutiveDom,
  TechnicalCleanDom,
  TraditionalAtsDom,
} from '@/components/builder/DomTemplates';
import { mockResume1, mockResume2, mockResume3 } from '@/lib/mockResumes';

interface TemplateSpec {
  id: TemplateId;
  name: string;
  subtitle: string;
  badge: string;
  badgeClass: string;
  category: 'software' | 'general' | 'executive';
  categoryLabel: string;
  description: string;
  bestFor: string[];
  atsFeatures: string[];
  Component: React.ComponentType<{ content: ResumeContent; pageViewMode?: 1 | 2 | 'all' }>;
  mock: ResumeContent;
}

function TemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { templateId: activeStoreTemplateId, setTemplateId, content } = useResumeStore();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'software' | 'general' | 'executive'>('all');
  const [useUserData, setUseUserData] = useState(false);
  const [previewModalId, setPreviewModalId] = useState<TemplateId | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(0.72);

  // Auto-open modal if ?selected=template-id is provided in URL
  useEffect(() => {
    const selected = searchParams.get('selected');
    if (selected && ['traditional-ats', 'classic-ats', 'modern-executive', 'technical-clean'].includes(selected)) {
      setPreviewModalId(selected as TemplateId);
    }
  }, [searchParams]);

  const hasUserActiveContent = Boolean(content?.personalInfo?.fullName?.trim());

  const templates: TemplateSpec[] = useMemo(
    () => [
      {
        id: 'traditional-ats',
        name: 'Traditional ATS (Gold Standard)',
        subtitle: 'Ivy League & FAANG Engineering Standard',
        badge: 'Top Tech Pick',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        category: 'software',
        categoryLabel: 'Software & Engineering',
        description:
          'The quintessential single-column ATS layout favored by Google, Amazon, and Meta recruiters. Features centered contact details, clean horizontal section rules, standard uppercase headings, and crisp chronological milestones.',
        bestFor: [
          'Software Engineers',
          'Backend & Full Stack Developers',
          'Systems & SRE Engineers',
          'Academic & Research Roles',
        ],
        atsFeatures: [
          '100% Workday, Taleo & Greenhouse Compliant',
          'Strict single-column text flow (zero reading-order traps)',
          'Clear chronological position & date headers',
          'High bullet point readability for human reviewers',
        ],
        Component: TraditionalAtsDom,
        mock: mockResume1,
      },
      {
        id: 'classic-ats',
        name: 'Classic ATS Modern',
        subtitle: 'Most Popular All-Rounder Layout',
        badge: 'Most Popular',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        category: 'general',
        categoryLabel: 'General Tech & Product',
        description:
          'Modern sans-serif typography with balanced margins and subtle section dividers. Engineered to maximize automated text parseability while offering a fresh, contemporary aesthetic for human hiring teams.',
        bestFor: [
          'Full-Stack & Frontend Engineers',
          'Product & Project Managers',
          'Data Analysts & BI Specialists',
          'General Tech Professionals',
        ],
        atsFeatures: [
          'Certified for Lever, iCIMS & SmartRecruiters',
          'Compact skill matrix grouping',
          'Optimized line-height prevents text clipping',
          'Left-aligned modern contact hierarchy',
        ],
        Component: ClassicAtsDom,
        mock: mockResume1,
      },
      {
        id: 'technical-clean',
        name: 'Technical Clean',
        subtitle: 'Tech Stack & System Architecture First',
        badge: 'Tech Stack First',
        badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
        category: 'software',
        categoryLabel: 'Software & Infrastructure',
        description:
          'Prominently showcases your technical skills matrix and key architecture projects right beneath the summary. Ensures high-priority tool keywords and project repositories get indexed first by automated screening filters.',
        bestFor: [
          'DevOps & Cloud Architects',
          'Data Scientists & ML Engineers',
          'Mobile & Flutter/React Native Developers',
          'Systems & Embedded Programmers',
        ],
        atsFeatures: [
          'Prioritizes skills section for rapid keyword matching',
          'Standardized technology tags for OCR scanners',
          'Dedicated GitHub & project link fields',
          'Clean divider styling without parsing interference',
        ],
        Component: TechnicalCleanDom,
        mock: mockResume3,
      },
      {
        id: 'modern-executive',
        name: 'Modern Executive',
        subtitle: 'Leadership, Scale & Strategic Impact',
        badge: 'Leadership Standard',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        category: 'executive',
        categoryLabel: 'Executive & Leadership',
        description:
          'High-impact executive layout featuring a subtle vertical accent bar and prominent career summary block. Designed for leaders highlighting cross-functional team management, organizational scale, and multi-million dollar business outcomes.',
        bestFor: [
          'Engineering Managers & Tech Leads',
          'Directors of Engineering & VPs',
          'CTOs & Technical Founders',
          'Senior Program & Operations Leaders',
        ],
        atsFeatures: [
          'Emphasizes executive summary & leadership scope',
          'Single-column structure guarantees 100% ATS score',
          'Strategic outcome & business metric focus',
          'Senior executive styling without multi-column parsing flaws',
        ],
        Component: ModernExecutiveDom,
        mock: mockResume2,
      },
    ],
    []
  );

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') return templates;
    return templates.filter((tpl) => tpl.category === selectedCategory);
  }, [templates, selectedCategory]);

  const activeModalTemplate = useMemo(() => {
    if (!previewModalId) return null;
    return templates.find((t) => t.id === previewModalId) || null;
  }, [previewModalId, templates]);

  const handleUseTemplate = (id: TemplateId) => {
    setTemplateId(id);
    router.push(`/builder?template=${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-emerald-500/20">
      
      {/* ── HERO BANNER ── */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Certified ATS Resume Templates</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            ATS-Friendly Resume Templates <br className="hidden sm:inline" />
            <span className="text-emerald-700">Built to Pass Screeners &amp; Land Interviews</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Over 75% of resumes are discarded by Applicant Tracking Systems (Workday, Taleo, Greenhouse, Lever) before a recruiter reads them. Every template below is strictly single-column, standard-heading compliant, and optimized for 100% OCR text extraction.
          </p>

          {/* Quick Value Proof Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Workday &amp; Taleo Verified</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero 2-Column Parsing Traps</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clean Vector PDF Streams</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>One-Click Builder Integration</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── CONTROLS & FILTER BAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 relative">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Templates ({templates.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('software')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'software'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Software &amp; Engineering (2)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('general')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'general'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              General Tech &amp; Product (1)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('executive')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'executive'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Executive &amp; Leadership (1)
            </button>
          </div>

          {/* Right Side: Data Source Switcher (Sample vs Active Resume) */}
          {hasUserActiveContent && (
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 shrink-0">
              <span className="text-xs text-slate-500 font-semibold">Preview Content:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUseUserData(false)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !useUserData ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sample Profiles
                </button>
                <button
                  type="button"
                  onClick={() => setUseUserData(true)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    useUserData ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>My Active Resume</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── TEMPLATES GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTemplates.map((tpl) => {
            const previewData = useUserData && hasUserActiveContent ? content : tpl.mock;
            const isSelectedInStore = activeStoreTemplateId === tpl.id;

            return (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* 1. Card Top Information Header */}
                <div className="p-6 border-b border-slate-100 space-y-3 bg-gradient-to-r from-slate-50/50 to-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {tpl.name}
                        </h2>
                        {isSelectedInStore && (
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Currently Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500">{tpl.subtitle}</p>
                    </div>

                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border uppercase tracking-wider shrink-0 ${tpl.badgeClass}`}>
                      {tpl.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                {/* 2. Scaled Live A4 Preview Frame */}
                <div className="relative bg-slate-100/70 border-y border-slate-200/70 h-[380px] sm:h-[420px] overflow-hidden flex justify-center p-3 select-none">
                  {/* Subtle watermarked grid background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Scaled A4 Container */}
                  <div
                    className="origin-top pointer-events-none shadow-lg transition-transform duration-300 group-hover:scale-[0.44]"
                    style={{
                      width: '794px',
                      transform: 'scale(0.42)',
                    }}
                  >
                    <tpl.Component content={previewData} pageViewMode={1} />
                  </div>

                  {/* Floating Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(tpl.id)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl hover:shadow-emerald-900/30 transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Use This Template</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewModalId(tpl.id)}
                      className="px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-800 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Full Screen Preview</span>
                    </button>
                  </div>
                </div>

                {/* 3. Specifications & ATS Breakdown */}
                <div className="p-6 space-y-4">
                  {/* Best For Tags */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Best Suited For
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.bestFor.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ATS Compliance Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      ATS Compliance Highlights
                    </span>
                    {tpl.atsFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* 4. Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewModalId(tpl.id)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Quick Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUseTemplate(tpl.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Start Building with This</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ── EDUCATIONAL / WHY ATS MATTERS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS Engineering Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Why Our Single-Column Layouts Score 99.4% in Workday &amp; Taleo
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Most visually creative templates from graphic tools fail applicant tracking scanners. ResumAI enforces algorithmic compatibility across every line:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>No 2-Column Parsing Scrambling</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  ATS parsers read horizontally. 2-column resumes cause your skills to merge into job titles, destroying your score.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Exact Industry Standard Headings</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Screeners search for strict strings like &ldquo;EXPERIENCE&rdquo; and &ldquo;EDUCATION&rdquo; to populate candidate database fields.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Pure Vector Text Layer</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every export is encoded as crisp vector text streams without flattening, ensuring 100% OCR text extraction accuracy.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Live Dynamic In-Builder Switching</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Switch between all 4 certified layouts in the builder anytime without losing a single word of your resume content.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <Link
                href="/builder"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
              >
                <span>Open Resume Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/checker"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
              >
                Scan an Existing CV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL SCREEN HIGH-RES PREVIEW MODAL ── */}
      {activeModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-between animate-fade-in">
          {/* Modal Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{activeModalTemplate.name}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${activeModalTemplate.badgeClass}`}>
                    {activeModalTemplate.badge}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{activeModalTemplate.subtitle}</p>
              </div>
            </div>

            {/* Zoom Controls & Action */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setModalZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-300 px-2 min-w-[50px] text-center">
                  {Math.round(modalZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setModalZoom((z) => Math.min(1.2, Number((z + 0.1).toFixed(2))))}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setModalZoom(0.72)}
                  className="px-2 py-0.5 rounded text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleUseTemplate(activeModalTemplate.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setPreviewModalId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-auto bg-slate-900/60 p-4 sm:p-8 flex justify-center">
            <div
              className="origin-top shadow-2xl transition-transform duration-200"
              style={{
                width: '794px',
                transform: `scale(${modalZoom})`,
                marginBottom: '100px',
              }}
            >
              <activeModalTemplate.Component
                content={useUserData && hasUserActiveContent ? content : activeModalTemplate.mock}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full A4 Vector Representation (96 DPI Standard: 794px × 1123px)</span>
            </div>

            <button
              type="button"
              onClick={() => handleUseTemplate(activeModalTemplate.id)}
              className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Build with {activeModalTemplate.name} →</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-12 text-center text-xs font-semibold text-slate-400">
          Loading Certified ATS Templates...
        </div>
      }
    >
      <TemplatesPageContent />
    </Suspense>
  );
}
