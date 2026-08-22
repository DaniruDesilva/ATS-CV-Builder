'use client';

import { ScanReportData } from '@/types/checker';
import { Layout, FileText, Target, Hash, MailCheck, Check, X } from 'lucide-react';

interface SectionBreakdownProps {
  report: ScanReportData;
}

export function SectionBreakdown({ report }: SectionBreakdownProps) {
  const {
    formatScore,
    contentScore,
    skillsScore,
    quantificationStats,
    contactCompleteness
  } = report;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Format Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-blue-600" /> Format
          </span>
          <span className="text-sm font-bold text-blue-600">{formatScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${formatScore}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          Page structure, text layer, and header presence.
        </p>
      </div>

      {/* Content Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" /> Content
          </span>
          <span className="text-sm font-bold text-indigo-600">{contentScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${contentScore}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          Action verbs, accomplishments, and structure.
        </p>
      </div>

      {/* Skills Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-violet-600" /> Keywords
          </span>
          <span className="text-sm font-bold text-violet-600">{skillsScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${skillsScore}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          Keyword density and job description alignment.
        </p>
      </div>

      {/* Additional Stats */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hash className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-700 font-medium">Quantification Rate</span>
          </div>
          <span className="text-sm font-bold text-amber-600">
            {quantificationStats.percentage}% ({quantificationStats.quantifiedBullets}/{quantificationStats.totalBullets})
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MailCheck className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-700 font-medium">Contact Details</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className={contactCompleteness.hasEmail ? 'text-emerald-600' : 'text-slate-400'}>
              {contactCompleteness.hasEmail ? <Check className="w-3.5 h-3.5 inline" /> : <X className="w-3.5 h-3.5 inline" />} Email
            </span>
            <span className={contactCompleteness.hasPhone ? 'text-emerald-600' : 'text-slate-400'}>
              {contactCompleteness.hasPhone ? <Check className="w-3.5 h-3.5 inline" /> : <X className="w-3.5 h-3.5 inline" />} Phone
            </span>
            <span className={contactCompleteness.hasLinkedIn ? 'text-emerald-600' : 'text-slate-400'}>
              {contactCompleteness.hasLinkedIn ? <Check className="w-3.5 h-3.5 inline" /> : <X className="w-3.5 h-3.5 inline" />} LinkedIn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
