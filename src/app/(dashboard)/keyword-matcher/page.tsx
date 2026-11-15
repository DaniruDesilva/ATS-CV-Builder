'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Check,
  ArrowRight,
  FileText,
  Briefcase,
  Zap,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCheck,
  UploadCloud,
  FileCheck,
  FileUp,
  X,
  ClipboardType,
  FileSearch,
} from 'lucide-react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGuestUsageStore } from '@/lib/store/useGuestUsageStore';
import { GuestAuthModal } from '@/components/auth/GuestAuthModal';
import { KeywordGapItem, KeywordMatchAnalysis } from '@/lib/ai/gemini';
import { ResumeContent } from '@/types/resume';

const SAMPLE_JOB_PRESETS = [
  {
    title: 'Senior Full-Stack Engineer (Next.js / Node.js)',
    text: `Job Title: Senior Full-Stack Engineer
Company: CloudScale Technologies
Location: Remote / Hybrid

About the Role:
We are seeking an experienced Senior Full-Stack Engineer to architect, build, and scale our SaaS platform. You will work across modern React, Next.js, Node.js, and TypeScript stacks, delivering high-throughput microservices and responsive web applications.

Required Qualifications & Technical Skills:
- 5+ years of software engineering experience with JavaScript, TypeScript, React, and Next.js.
- Strong backend proficiency with Node.js, Express, RESTful APIs, and GraphQL.
- Database expertise with PostgreSQL, MongoDB, Redis caching, and Prisma ORM.
- Cloud and DevOps experience with Docker containerization, Kubernetes, AWS (S3, ECS, Lambda), and CI/CD pipelines (GitHub Actions).
- Proven track record of performance optimization, unit testing (Jest/Cypress), and system architecture.
- Experience in Agile/Scrum environments, code reviews, and mentoring junior engineers.`,
  },
  {
    title: 'Cloud & DevOps Platform Engineer (AWS / Kubernetes)',
    text: `Job Title: Senior Cloud & DevOps Platform Engineer
Company: Apex Cloud Infrastructure

Key Responsibilities:
- Build and maintain scalable Kubernetes clusters and automated CI/CD deployment pipelines.
- Implement Infrastructure as Code (IaC) using Terraform and Ansible across AWS and multi-cloud environments.
- Monitor system health, reliability, and observability using Prometheus, Grafana, Datadog, and ELK Stack.
- Champion cloud security, Zero Trust networking, Docker image vulnerability scanning, and IAM compliance.

Qualifications:
- Solid background in Linux systems administration, Shell/Bash, and Python scripting.
- Deep expertise in AWS (EKS, VPC, CloudFront, Terraform, Docker, Kubernetes).
- Familiarity with Microservices architecture, gRPC, and high-availability database replication.`,
  },
  {
    title: 'Technical Product & Engineering Lead',
    text: `Job Title: Technical Product & Engineering Lead
Company: NextGen Enterprise Labs

About the Position:
Looking for an engineering leader who bridges software architecture with product vision. You will lead cross-functional sprint planning, define product roadmaps, and oversee full-stack development cycles.

Core Competencies & Requirements:
- Demonstrated experience in Technical Project Management, Agile/Scrum leadership, and OKR delivery.
- Hands-on background with full-stack web technologies (React, Node.js, SQL Server/PostgreSQL, APIs).
- Stakeholder management, sprint backlog grooming, sprint velocity optimization, and team mentoring.
- Strong understanding of user experience design (Figma), system architecture, and budget management.`,
  },
];

function KeywordMatcherContent() {
  const router = useRouter();
  const { content, appendSkill, loadSampleData, importScannedResume } = useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const { canMatchKeywords, recordKeyword } = useGuestUsageStore();

  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_PRESETS[0].text);
  const [resumeMode, setResumeMode] = useState<'store' | 'upload' | 'paste'>('store');
  const [pastedResumeText, setPastedResumeText] = useState('');

  // Upload file state
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    pageCount: number;
    characterCount: number;
  } | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState('');
  const [uploadedResumeContent, setUploadedResumeContent] = useState<ResumeContent | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<KeywordMatchAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [addedSkills, setAddedSkills] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Format active resume from store into text for analysis
  const storeResumeText = useMemo(() => {
    const p = content.personalInfo || {};
    const skillsList = content.skills?.flatMap((c) => c.skills || []) || [];
    const expText = content.experience
      ?.map((e) => `${e.position} at ${e.company}. ${(e.highlights || []).join(' ')}`)
      .join('\n');
    const eduText = content.education
      ?.map((ed) => `${ed.degree} in ${ed.fieldOfStudy} from ${ed.institution}`)
      .join('\n');
    const projText = content.projects
      ?.map((pr) => `${pr.name}: ${pr.description}. ${(pr.technologies || []).join(', ')}`)
      .join('\n');

    return [
      `Name: ${p.fullName || 'Candidate'}`,
      `Target Role: ${p.jobTitle || ''}`,
      `Summary: ${content.summary || ''}`,
      `Technical Skills: ${skillsList.join(', ')}`,
      `Work History:\n${expText}`,
      `Education:\n${eduText}`,
      `Key Projects:\n${projText}`,
    ].join('\n\n');
  }, [content]);

  const hasStoreResume = Boolean(content.personalInfo?.fullName?.trim());

  const handleFileUpload = async (file: File) => {
    setUploadError('');
    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc')) {
      setUploadError('Unsupported file format. Please upload a .pdf or .docx document.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to extract text from document.');
      }

      const data = await res.json();
      setUploadedFile({
        name: data.fileName,
        size: data.fileSize,
        pageCount: data.pageCount,
        characterCount: data.characterCount,
      });
      setUploadedFileText(data.text);
      if (data.extractedResume) {
        setUploadedResumeContent(data.extractedResume);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse resume document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const handleClearUploadedFile = () => {
    setUploadedFile(null);
    setUploadedFileText('');
    setUploadedResumeContent(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    // 1. Guard against guest trying to scan a 2nd time
    if (!canMatchKeywords(isAuthenticated)) {
      setShowAuthModal(true);
      return;
    }

    if (!jobDescription.trim()) {
      setErrorMsg('Please paste or select a target job description.');
      return;
    }

    let activeResumeText = '';
    if (resumeMode === 'store') {
      if (!hasStoreResume) {
        setErrorMsg('Your active resume draft is empty. Click "Load Sample", switch to "Upload File", or "Paste Text".');
        return;
      }
      activeResumeText = storeResumeText;
    } else if (resumeMode === 'upload') {
      if (!uploadedFileText.trim()) {
        setErrorMsg('Please upload a PDF or DOCX resume document to compare.');
        return;
      }
      activeResumeText = uploadedFileText;
    } else {
      if (!pastedResumeText.trim()) {
        setErrorMsg('Please paste your resume text to compare against the job description.');
        return;
      }
      activeResumeText = pastedResumeText;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setAddedSkills([]);

    try {
      const res = await fetch('/api/ai/match-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeText: activeResumeText,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 403 || errData.requireAuth) {
          setShowAuthModal(true);
          return;
        }
        throw new Error(errData.error || 'Failed to analyze keyword gap.');
      }

      const data = await res.json();
      setAnalysisResult(data);
      if (!isAuthenticated) {
        recordKeyword();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to match keywords. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkillToResume = (skillName: string) => {
    if (addedSkills.includes(skillName)) return;

    appendSkill(skillName, 'Technical Skills');
    setAddedSkills((prev) => [...prev, skillName]);
  };

  const handleAddAllMissingSkills = () => {
    if (!analysisResult?.missingKeywords) return;

    const unadded = analysisResult.missingKeywords
      .map((k) => k.keyword)
      .filter((s) => !addedSkills.includes(s));

    unadded.forEach((skill) => {
      appendSkill(skill, 'Technical Skills');
    });

    setAddedSkills((prev) => [...prev, ...unadded]);
  };

  // Dynamically recalculated score based on added skills
  const effectiveScore = useMemo(() => {
    if (!analysisResult) return 0;
    const base = analysisResult.matchScore;
    const boost = addedSkills.length * 3;
    return Math.min(100, base + boost);
  }, [analysisResult, addedSkills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in w-full selection:bg-emerald-500/20">
      
      {/* ── HEADER ── */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
          <Target className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Targeted Job Tailoring Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.18]">
          Job Keyword <span className="text-emerald-700">Gap Matcher</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Compare your resume directly against any job posting. Discover the exact keywords, tools, and technical skills ATS algorithms screen for, and close critical gaps before submitting your application.
        </p>

        {!isAuthenticated && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <span>Guest Mode (1 Free Scan) • Sign In for Unlimited Matches</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ── INPUT PANELS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: TARGET JOB POSTING */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-100">
                  1
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Target Job Description
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                {jobDescription.length} characters
              </span>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-bold block">
                Quick Sample Presets (Click to test):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_JOB_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJobDescription(preset.text)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/70 hover:border-emerald-200 text-slate-700 text-xs font-semibold transition-all text-left truncate max-w-[240px] cursor-pointer shadow-2xs"
                  >
                    {preset.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={11}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description, requirements, and responsibilities here..."
              className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Include requirements, qualifications, and tech stack tags.</span>
            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-slate-400 hover:text-red-600 transition-colors font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* PANEL 2: RESUME SOURCE */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-100">
                  2
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Your Resume Content
                </h2>
              </div>

              {/* Mode Toggle with 3 tabs */}
              <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setResumeMode('store')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    resumeMode === 'store'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode('upload')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    resumeMode === 'upload'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode('paste')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    resumeMode === 'paste'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <ClipboardType className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Paste Text</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input for PDF/DOCX Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />

            {/* Mode 1: Active Store Resume Card */}
            {resumeMode === 'store' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {content.personalInfo?.fullName || 'Active Resume Draft'}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {content.personalInfo?.jobTitle || 'Ready for comparison'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Store Sync
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-100 text-center">
                    <div className="p-2 bg-white rounded-xl border border-emerald-100/70">
                      <span className="text-base font-black text-slate-900 block leading-tight">
                        {content.skills?.reduce((a, c) => a + (c.skills?.length || 0), 0) || 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Skills</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-emerald-100/70">
                      <span className="text-base font-black text-slate-900 block leading-tight">
                        {content.experience?.length || 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Roles</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-emerald-100/70">
                      <span className="text-base font-black text-slate-900 block leading-tight">
                        {content.projects?.length || 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Projects</span>
                    </div>
                  </div>
                </div>

                {/* Helpful Callout if Draft is Empty */}
                {!hasStoreResume && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">No draft in builder yet</span>
                        <span className="text-[11px] text-slate-500">Choose how to provide your resume:</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={loadSampleData}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold hover:bg-slate-100 transition-all text-xs cursor-pointer shadow-2xs"
                      >
                        Load Sample
                      </button>
                      <button
                        type="button"
                        onClick={() => setResumeMode('upload')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-xs cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setResumeMode('paste')}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-all text-xs cursor-pointer"
                      >
                        Paste Text
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview text stream */}
                <div className="h-[148px] overflow-auto rounded-2xl bg-slate-50 border border-slate-200 p-3 text-[11px] font-mono text-slate-600 space-y-1">
                  <span className="text-slate-400 font-bold block mb-1">Extracted Document Stream:</span>
                  <p className="whitespace-pre-line leading-relaxed">
                    {hasStoreResume
                      ? `${storeResumeText.slice(0, 500)}...`
                      : 'No resume loaded yet. Click "Load Sample", "Upload File", or switch to "Paste Text" to compare against the job posting.'}
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2: Direct PDF / DOCX File Upload */}
            {resumeMode === 'upload' && (
              <div className="space-y-3">
                {!uploadedFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[225px] ${
                      isDragOver
                        ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/30'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                        <p className="text-xs font-bold text-slate-800">
                          Extracting text from document...
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Parsing ATS text layer in milliseconds
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                            Drag &amp; drop your resume or <span className="text-emerald-700 underline font-bold">browse</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Supports PDF or DOCX files up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-slate-900 truncate">
                              {uploadedFile.name}
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              {(uploadedFile.size / 1024).toFixed(0)} KB • {uploadedFile.pageCount} page{uploadedFile.pageCount > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Extracted</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleClearUploadedFile}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-xs text-slate-600">
                        <span className="font-semibold text-[11px]">
                          {uploadedFile.characterCount.toLocaleString()} characters extracted
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          Change File
                        </button>
                      </div>
                    </div>

                    {/* Preview text stream */}
                    <div className="h-[148px] overflow-auto rounded-2xl bg-slate-50 border border-slate-200 p-3 text-[11px] font-mono text-slate-600 space-y-1">
                      <span className="text-slate-400 font-bold block mb-1">Extracted Document Stream:</span>
                      <p className="whitespace-pre-line leading-relaxed">
                        {uploadedFileText.slice(0, 500)}...
                      </p>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Mode 3: Paste Raw Resume Text */}
            {resumeMode === 'paste' && (
              <textarea
                rows={11}
                value={pastedResumeText}
                onChange={(e) => setPastedResumeText(e.target.value)}
                placeholder="Paste your raw resume text (experience, skills, summary) here..."
                className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all leading-relaxed"
              />
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              {resumeMode === 'store'
                ? 'Pulling real-time content directly from your Resume Builder.'
                : resumeMode === 'upload'
                ? uploadedFile
                  ? `Loaded ${uploadedFile.name} (${uploadedFile.characterCount.toLocaleString()} chars).`
                  : 'Upload your existing PDF or DOCX resume document.'
                : `${pastedResumeText.length} characters pasted.`}
            </span>
            {resumeMode === 'upload' && uploadedResumeContent ? (
              <button
                type="button"
                onClick={() => {
                  importScannedResume(uploadedResumeContent, uploadedFile?.name || 'Resume');
                  router.push('/builder');
                }}
                className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Import to Builder</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <Link href="/builder" className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1">
                <span>Open in Builder</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* ── ACTION TRIGGER BUTTON ── */}
      <div className="flex flex-col items-center justify-center gap-3 pt-2">
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-emerald-600/35"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing ATS Keywords &amp; Semantic Gaps...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Analyze Keyword Match &amp; Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-400">
          Powered by Gemini 3.5 Flash &amp; Applicant Tracking algorithmic scoring.
        </p>
      </div>

      {/* ── RESULTS SHOWCASE SECTION ── */}
      {analysisResult && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* 1. Header & Match Score Overview */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 tracking-wider">
                  Target Role
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {analysisResult.totalJdKeywords} Total Keywords Identified
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {analysisResult.jobTitle}
              </h3>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            {/* Score Gauge Block */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
              <div className="relative flex items-center justify-center w-20 h-20">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                    effectiveScore >= 80
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                      : effectiveScore >= 60
                      ? 'border-amber-500 bg-amber-50/50 text-amber-800'
                      : 'border-red-500 bg-red-50/50 text-red-800'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl font-black leading-none">{effectiveScore}%</span>
                    <span className="text-[9px] font-extrabold text-slate-400 block mt-0.5">MATCH</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit ${
                    effectiveScore >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : effectiveScore >= 60
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {effectiveScore >= 80
                    ? 'High ATS Pass Rate'
                    : effectiveScore >= 60
                    ? 'Moderate Skill Gap'
                    : 'Screening Filter Risk'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {addedSkills.length > 0 ? (
                    <span className="text-emerald-700 font-bold">
                      +{addedSkills.length * 3}% boost added from newly included skills!
                    </span>
                  ) : (
                    'Add missing skills below to boost score.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Side-By-Side Keyword Comparison Buckets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* BUCKET 1: MATCHED KEYWORDS (FOUND IN BOTH) */}
            <div className="bg-emerald-50/30 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Matched in Your Resume ({analysisResult.matchedKeywords.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      These requirements are already present in your resume.
                    </p>
                  </div>
                </div>
              </div>

              {analysisResult.matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysisResult.matchedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No direct keyword overlap detected yet.</p>
              )}
            </div>

            {/* BUCKET 2: MISSING KEYWORD GAPS (CLICK TO ADD) */}
            <div className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Missing Job Keywords ({analysisResult.missingKeywords.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Click any skill pill below to add it directly into your active resume!
                    </p>
                  </div>
                </div>

                {analysisResult.missingKeywords.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddAllMissingSkills}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
                  >
                    Add All to Active Resume
                  </button>
                )}
              </div>

              {analysisResult.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysisResult.missingKeywords.map((item, idx) => {
                    const isAdded = addedSkills.includes(item.keyword);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddSkillToResume(item.keyword)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isAdded
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white hover:bg-emerald-50/80 border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 shadow-2xs hover:scale-102'
                        }`}
                        title={item.recommendation}
                      >
                        {isAdded ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <span>{item.keyword} (Added)</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <span>{item.keyword}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Flawless keyword match! No critical skill gaps identified.</span>
                </p>
              )}
            </div>

          </div>

          {/* 3. Tactical Recommendations & Integration Advice */}
          {analysisResult.keyRecommendations.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Tactical Keyword Placement Recommendations</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {analysisResult.keyRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Skills added here sync directly to your active resume draft in real time.</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/checker"
                className="px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors"
              >
                Scan Full Document
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (resumeMode === 'upload' && uploadedResumeContent) {
                    importScannedResume(uploadedResumeContent, uploadedFile?.name || 'Resume');
                  }
                  router.push('/builder?step=3');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Edit Skills in Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Guest Authentication Modal */}
      <GuestAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature="keyword"
        redirectUrl="/keyword-matcher"
      />
    </div>
  );
}

export default function KeywordMatcherPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-12 text-center text-xs font-semibold text-slate-400">
          Loading Job Keyword Gap Matcher...
        </div>
      }
    >
      <KeywordMatcherContent />
    </Suspense>
  );
}
