'use client';

import { ScanReportData } from '@/types/checker';
import { Layout, FileText, Target, Hash, MailCheck, Check, X, Zap, BookOpen } from 'lucide-react';

interface SectionBreakdownProps {
  report: ScanReportData;
}

export function SectionBreakdown({ report }: SectionBreakdownProps) {
  const {
    formatScore,
    contentScore,
    skillsScore,
    quantificationStats,
    actionVerbStats,
    contactCompleteness,
    atsHeadingsFound,
    missingStandardHeadings
  } = report;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Format Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-emerald-600" /> Format
          </span>
          <span className={`text-sm font-bold ${getScoreColor(formatScore)}`}>{formatScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${getBarColor(formatScore)} rounded-full transition-all duration-500`} style={{ width: `${formatScore}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          Contact info, page structure, section headers, and formatting quality.
        </p>
      </div>

      {/* Content Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-600" /> Content
          </span>
          <span className={`text-sm font-bold ${getScoreColor(contentScore)}`}>{contentScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${getBarColor(contentScore)} rounded-full transition-all duration-500`} style={{ width: `${contentScore}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          Action verbs, quantified metrics, and bullet point quality.
        </p>
      </div>

      {/* Skills Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-700" /> Keywords
          </span>
          <span className={`text-sm font-bold ${getScoreColor(skillsScore)}`}>{skillsScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${getBarColor(skillsScore)} rounded-full transition-all duration-500`} style={{ width: `${skillsScore}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          Keyword density, skill variety, and job description alignment.
        </p>
      </div>

      {/* Additional Stats Grid */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Quantification Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Metrics Rate</span>
              <span className={`text-sm font-bold ${quantificationStats.percentage >= 40 ? 'text-emerald-600' : quantificationStats.percentage >= 20 ? 'text-amber-600' : 'text-red-600'}`}>
                {quantificationStats.percentage}%
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {quantificationStats.quantifiedBullets}/{quantificationStats.totalBullets}
          </span>
        </div>

        {/* Action Verb Strength */}
        {actionVerbStats && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Action Verbs</span>
                <span className={`text-sm font-bold ${actionVerbStats.percentage >= 50 ? 'text-emerald-600' : actionVerbStats.percentage >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                  {actionVerbStats.percentage}%
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {actionVerbStats.strongVerbBullets}/{actionVerbStats.totalBullets}
            </span>
          </div>
        )}

        {/* Contact Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MailCheck className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Contact Info</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
            <span className={contactCompleteness.hasEmail ? 'text-emerald-600' : 'text-slate-400'}>
              {contactCompleteness.hasEmail ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />} Email
            </span>
            <span className={contactCompleteness.hasPhone ? 'text-emerald-600' : 'text-slate-400'}>
              {contactCompleteness.hasPhone ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />} Phone
            </span>
            <span className={contactCompleteness.hasLinkedIn ? 'text-emerald-600' : 'text-slate-400'}>
              {contactCompleteness.hasLinkedIn ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />} LinkedIn
            </span>
          </div>
        </div>

        {/* ATS Headings */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Sections: {atsHeadingsFound.length}/{atsHeadingsFound.length + missingStandardHeadings.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
            {atsHeadingsFound.slice(0, 4).map(h => (
              <span key={h} className="text-emerald-600">
                <Check className="w-3 h-3 inline" /> {h.charAt(0) + h.slice(1).toLowerCase()}
              </span>
            ))}
            {missingStandardHeadings.filter(h => ['SUMMARY', 'EDUCATION', 'EXPERIENCE', 'SKILLS'].includes(h)).map(h => (
              <span key={h} className="text-red-500">
                <X className="w-3 h-3 inline" /> {h.charAt(0) + h.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
