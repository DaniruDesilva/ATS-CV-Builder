'use client';

import { ScanReportData } from '@/types/checker';
import { Sparkles, CheckCircle, AlertTriangle, Copy, Check, ArrowRight, ShieldAlert, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SuggestionListProps {
  report: ScanReportData;
  parsedText?: string;
}

export function SuggestionList({ report, parsedText }: SuggestionListProps) {
  const {
    summary,
    matchedSkills,
    missingKeywords,
    bulletImprovements,
    formattingIssues
  } = report;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI / ATS Summary */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-2xs">
        <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" /> ATS Compatibility Assessment
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed font-normal">{summary}</p>
      </div>

      {/* Bullet Improvements (Google X-Y-Z formula) */}
      {bulletImprovements && bulletImprovements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Actionable Bullet Point Improvements ({bulletImprovements.length})
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            Weak and passive bullet points rewritten using Google&apos;s X-Y-Z formula (&quot;Accomplished [X], measured by [Y], by doing [Z]&quot;).
          </p>

          <div className="space-y-3">
            {bulletImprovements.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm hover:border-slate-300 transition-colors">
                <div className="text-xs text-slate-600 line-through bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                  <span className="font-semibold text-slate-400 mr-1 not-italic">Before:</span> {item.original}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-emerald-50/80 p-3.5 rounded-lg border border-emerald-200">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                      <span>Optimized ATS Version:</span>
                    </div>
                    <p className="text-sm text-emerald-950 font-medium leading-relaxed">{item.improved}</p>
                    <p className="text-xs text-emerald-700 italic mt-1.5">{item.reason}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(item.improved, idx)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex-shrink-0 transition-colors shadow-sm self-start sm:self-center"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Skills */}
        <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-3 shadow-sm">
          <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Indexed Skills ({matchedSkills.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  ✓ {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No industry skills detected. Add a dedicated Skills section.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 space-y-3 shadow-sm">
          <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing / Recommended Keywords ({missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((k) => (
                <span key={k} className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                  + {k}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-medium">No missing keywords found for the provided context!</span>
            )}
          </div>
        </div>
      </div>

      {/* Formatting & Structure Fixes */}
      {formattingIssues && formattingIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" /> Critical Formatting &amp; Structure Fixes ({formattingIssues.length})
          </h4>
          <div className="space-y-2">
            {formattingIssues.map((issue, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{issue.issue}</span>
                  <span
                    className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                      issue.severity === 'high'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : issue.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {issue.severity} priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{issue.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted ATS Plain Text Viewer */}
      {parsedText && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors border-b border-slate-200"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              View What ATS Algorithms Extracted (Raw Text Layer)
            </span>
            {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRawText && (
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {parsedText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
