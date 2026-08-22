'use client';

import { ScanReportData } from '@/types/checker';
import { Sparkles, CheckCircle, AlertTriangle, Copy, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface SuggestionListProps {
  report: ScanReportData;
}

export function SuggestionList({ report }: SuggestionListProps) {
  const {
    summary,
    matchedSkills,
    missingKeywords,
    bulletImprovements,
    formattingIssues
  } = report;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
        <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> AI Analysis Summary
        </h4>
        <p className="text-sm text-blue-700 leading-relaxed">{summary}</p>
      </div>

      {/* Bullet Improvements */}
      {bulletImprovements && bulletImprovements.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Bullet Point Rewrites
          </h4>
          <p className="text-sm text-slate-500">
            Rewritten using the Google X-Y-Z formula for maximum impact.
          </p>

          <div className="space-y-3">
            {bulletImprovements.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-sm text-slate-500 line-through bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-medium text-slate-400 mr-1">Original:</span> {item.original}
                </div>

                <div className="flex items-start justify-between gap-3 bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                      <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Improved:</span>
                    </div>
                    <p className="text-sm text-emerald-800 leading-relaxed">{item.improved}</p>
                    <p className="text-xs text-emerald-600 italic mt-1">{item.reason}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(item.improved, idx)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex-shrink-0 transition-colors shadow-sm"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
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
        <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" /> Matched Skills ({matchedSkills.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">No skills parsed.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Missing Keywords ({missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((k) => (
                <span key={k} className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                  + {k}
                </span>
              ))
            ) : (
              <span className="text-sm text-emerald-600">No missing keywords found!</span>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Issues */}
      {formattingIssues && formattingIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" /> Formatting Fixes
          </h4>
          <div className="space-y-2">
            {formattingIssues.map((issue, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{issue.issue}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      issue.severity === 'high'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : issue.severity === 'medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{issue.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
