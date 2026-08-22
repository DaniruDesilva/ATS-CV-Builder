'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { AlignLeft, Sparkles, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function SummaryForm() {
  const { content, updateSummary } = useResumeStore();
  const [isPolishing, setIsPolishing] = useState(false);

  const handleAiPolish = async () => {
    if (!content.summary || content.summary.trim().length < 10) return;
    setIsPolishing(true);
    try {
      const res = await fetch('/api/ai/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText: content.summary, isSummary: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.improved) {
          updateSummary(data.improved);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-blue-600" /> Professional Summary
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            2–4 impactful sentences highlighting your experience, tech stack, and value.
          </p>
        </div>

        <button
          onClick={handleAiPolish}
          disabled={isPolishing || !content.summary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold disabled:opacity-50 transition-colors"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin' : ''}`} />
          {isPolishing ? 'Optimizing...' : 'AI Polish'}
        </button>
      </div>

      <div className="relative">
        <textarea
          rows={5}
          value={content.summary || ''}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="e.g. Results-driven Senior Full Stack Engineer with 6+ years of experience building high-scale web platforms using React, Next.js, and PostgreSQL..."
          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 leading-relaxed transition-colors"
        />
        <div className="flex justify-between items-center text-xs text-slate-400 mt-1.5">
          <span>Target: 300–500 characters</span>
          <span>{content.summary ? content.summary.length : 0} characters</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> ATS Best Practices
        </h4>
        <ul className="text-sm text-slate-500 space-y-1 pl-5 list-disc">
          <li>Include target keywords (e.g. Full Stack, Cloud Architecture, CI/CD).</li>
          <li>Avoid fluff words. Use concrete skill names instead.</li>
          <li>Keep abbreviations standard (e.g., AWS, API, SQL).</li>
        </ul>
      </div>
    </div>
  );
}
