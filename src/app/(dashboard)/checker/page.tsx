'use client';

import { useState } from 'react';
import { Dropzone } from '@/components/checker/Dropzone';
import { ScoreGauge } from '@/components/checker/ScoreGauge';
import { SectionBreakdown } from '@/components/checker/SectionBreakdown';
import { SuggestionList } from '@/components/checker/SuggestionList';
import { ScanResultData } from '@/types/checker';
import { CheckCircle2, FileSearch, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CheckerPage() {
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>AI-Powered ATS Analyzer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Check Your Resume&apos;s <span className="text-blue-600">ATS Score</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Upload your PDF or DOCX resume. Our AI will extract your text, score parseability, and optimize your bullet points.
        </p>
      </div>

      {/* Main Container */}
      {!scanResult ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 shadow-sm">
          <Dropzone onAnalyze={handleAnalyzeResume} isLoading={isLoading} />
          {errorMsg && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6 animate-slide-up">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan Another
              </button>

              <Link
                href="/builder"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Fix in Builder →
              </Link>
            </div>
          </div>

          {/* Score Gauge */}
          <ScoreGauge score={scanResult.overallScore} />

          {/* Metric Breakdown Cards */}
          <SectionBreakdown report={scanResult.reportData} />

          {/* Actionable Suggestions & Rewrites */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Actionable Findings
            </h3>
            <SuggestionList report={scanResult.reportData} />
          </div>
        </div>
      )}
    </div>
  );
}
