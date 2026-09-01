'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { ResumeContent, TemplateId } from '@/types/resume';
import {
  TraditionalAtsDom,
  ClassicAtsDom,
  ModernExecutiveDom,
  TechnicalCleanDom,
  PageViewMode
} from './DomTemplates';
import ClassicAtsTemplate from './templates/ClassicAts';
import ModernExecutiveTemplate from './templates/ModernExecutive';
import TechnicalCleanTemplate from './templates/TechnicalClean';
import TraditionalAtsTemplate from './templates/TraditionalAts';
import {
  Download,
  Eye,
  FileText,
} from 'lucide-react';

// Dynamically import @react-pdf/renderer components with SSR disabled
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs font-medium">
        Loading PDF Renderer...
      </div>
    )
  }
);

// Re-export DOM preview components
export { TraditionalAtsDom, ClassicAtsDom, ModernExecutiveDom, TechnicalCleanDom };
export type { PageViewMode };

/* --- MAIN LIVE PREVIEW COMPONENT --- */

export function LivePreview() {
  const { content, templateId, setTemplateId } = useResumeStore();
  const [isClient, setIsClient] = useState(false);
  const [previewMode, setPreviewMode] = useState<'dom' | 'pdf'>('dom');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPdfDocument = () => {
    switch (templateId) {
      case 'modern-executive':
        return <ModernExecutiveTemplate content={content} />;
      case 'technical-clean':
        return <TechnicalCleanTemplate content={content} />;
      case 'classic-ats':
        return <ClassicAtsTemplate content={content} />;
      case 'traditional-ats':
      default:
        return <TraditionalAtsTemplate content={content} />;
    }
  };

  const getDomDocument = () => {
    switch (templateId) {
      case 'modern-executive':
        return <ModernExecutiveDom content={content} />;
      case 'technical-clean':
        return <TechnicalCleanDom content={content} />;
      case 'classic-ats':
        return <ClassicAtsDom content={content} />;
      case 'traditional-ats':
      default:
        return <TraditionalAtsDom content={content} />;
    }
  };

  const templates: { id: TemplateId; name: string; tag: string }[] = [
    { id: 'traditional-ats', name: 'Traditional ATS', tag: 'Gold Standard' },
    { id: 'classic-ats', name: 'Classic ATS', tag: 'Parsing Optimized' },
    { id: 'modern-executive', name: 'Modern Executive', tag: 'Leadership' },
    { id: 'technical-clean', name: 'Technical Clean', tag: 'Tech Stack' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between flex-wrap gap-2">
        
        {/* Left: View Mode & Template Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setPreviewMode('dom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode === 'dom'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setPreviewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode === 'pdf'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Real PDF
            </button>
          </div>

          {/* Template Selector */}
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value as TemplateId)}
            className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 shadow-sm"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.tag})
              </option>
            ))}
          </select>
        </div>

        {/* Right: PDF Download Button */}
        {isClient && (
          <PDFDownloadLink
            document={getPdfDocument()}
            fileName={`${(content.personalInfo.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_ats.pdf`}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:shadow"
          >
            {/* @ts-ignore */}
            {({ loading }: { loading: boolean }) => (
              <>
                <Download className={`w-3.5 h-3.5 ${loading ? 'animate-bounce' : ''}`} />
                <span>{loading ? 'Compiling ATS PDF...' : 'Download PDF'}</span>
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/90 flex justify-center">
        {previewMode === 'pdf' && isClient ? (
          <div className="w-full h-[780px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-md">
            <PDFViewer width="100%" height="100%" showToolbar={true}>
              {getPdfDocument()}
            </PDFViewer>
          </div>
        ) : (
          /* Dynamic DOM Preview Sheet — continuous flow matching PDF */
          <div className="transition-all transform origin-top w-full flex justify-center">
            {getDomDocument()}
          </div>
        )}
      </div>
    </div>
  );
}
