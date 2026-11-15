'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { Dropzone } from '@/components/checker/Dropzone';
import { ScoreGauge } from '@/components/checker/ScoreGauge';
import { SectionBreakdown } from '@/components/checker/SectionBreakdown';
import { SuggestionList } from '@/components/checker/SuggestionList';
import { ScanResultData } from '@/types/checker';
import { CheckCircle2, FileSearch, RefreshCw, AlertCircle, Shield, ArrowRight, Target } from 'lucide-react';

export default function CheckerPage() {
  const router = useRouter();
  const { importScannedResume } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyzeResume = async (file: File, jobDescription: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);

      const res = await fetch('/api/check-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to scan resume document.');
      }

      const data: ScanResultData = await res.json();
      setScanResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while analyzing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixInBuilder = () => {
    if (!scanResult) {
      router.push('/builder');
      return;
    }

    if (scanResult.extractedResume) {
      importScannedResume(scanResult.extractedResume, scanResult.fileName);
    }
    router.push('/builder');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI-Powered ATS Analyzer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Check Your Resume&apos;s <span className="text-emerald-700">ATS Score</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Upload your PDF or DOCX resume. Our AI will extract your text, score parseability, and optimize your bullet points.
        </p>
      </div>

      {/* Main Container */}
      {!scanResult ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <Dropzone onAnalyze={handleAnalyzeResume} isLoading={isLoading} />
            {errorMsg && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
              </div>
            )}
          </div>

          {/* Cross-Tool Banner: Job Keyword Gap Matcher */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block">Tailoring your CV for a specific job posting?</span>
                <span className="text-slate-500">Scan for missing keywords and automatically add them to your resume.</span>
              </div>
            </div>
            <Link
              href="/keyword-matcher"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 justify-center"
            >
              <span>Job Keyword Gap Matcher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6 animate-slide-up">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
                <FileSearch className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">{scanResult.fileName}</span>
                <span className="text-xs text-slate-400">Scanned on {new Date(scanResult.createdAt || '').toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScanResult(null)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan Another
              </button>

              <button
                type="button"
                onClick={handleFixInBuilder}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>Fix in Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Score Gauge */}
          <ScoreGauge score={scanResult.overallScore} />

          {/* Metric Breakdown Cards */}
          <SectionBreakdown report={scanResult.reportData} />

          {/* Actionable Suggestions & Rewrites */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Actionable Findings
            </h3>
            <SuggestionList report={scanResult.reportData} parsedText={scanResult.parsedText} />
          </div>
        </div>
      )}
    </div>
  );
}
