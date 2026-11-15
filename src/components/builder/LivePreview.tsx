'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { ResumeContent, TemplateId } from '@/types/resume';
import {
  TraditionalAtsDom,
  ClassicAtsDom,
  ModernExecutiveDom,
  TechnicalCleanDom,
  PageViewMode,
} from './DomTemplates';
import ClassicAtsTemplate from './templates/ClassicAts';
import ModernExecutiveTemplate from './templates/ModernExecutive';
import TechnicalCleanTemplate from './templates/TechnicalClean';
import TraditionalAtsTemplate from './templates/TraditionalAts';
import {
  Download,
  Eye,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCode,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGuestUsageStore } from '@/lib/store/useGuestUsageStore';
import { GuestAuthModal } from '@/components/auth/GuestAuthModal';

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
    ),
  }
);

// Re-export DOM preview components
export { TraditionalAtsDom, ClassicAtsDom, ModernExecutiveDom, TechnicalCleanDom };
export type { PageViewMode };

/* --- MAIN LIVE PREVIEW COMPONENT --- */

export function LivePreview() {
  const { content, templateId, setTemplateId } = useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const { canExport, recordExport } = useGuestUsageStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [previewMode, setPreviewMode] = useState<'dom' | 'pdf'>('dom');
  const [pageView, setPageView] = useState<PageViewMode>('all');
  const [zoomMode, setZoomMode] = useState<'fit' | 'custom'>('fit');
  const [customZoom, setCustomZoom] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(620);
  const [measuredHeight, setMeasuredHeight] = useState<number>(1123);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Measure container width for responsive fit-to-width scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };
    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewMode]);

  // Measure DOM content unscaled height for exact bounding box wrapper
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el.scrollHeight > 0) {
        setMeasuredHeight(el.scrollHeight);
      }
    };
    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [content, templateId, pageView, previewMode]);

  // Calculate effective zoom scale (A4 standard width is 794px at 96 DPI)
  const fitScale = Math.min(1.0, Math.max(0.4, (containerWidth - 36) / 794));
  const effectiveScale = zoomMode === 'fit' ? fitScale : customZoom;

  const handleZoomIn = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.min(1.5, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.max(0.4, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleFit = () => {
    setZoomMode('fit');
  };

  const handleActualSize = () => {
    setZoomMode('custom');
    setCustomZoom(1.0);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(content.personalInfo.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
        return <ModernExecutiveDom content={content} pageView={pageView} />;
      case 'technical-clean':
        return <TechnicalCleanDom content={content} pageView={pageView} />;
      case 'classic-ats':
        return <ClassicAtsDom content={content} pageView={pageView} />;
      case 'traditional-ats':
      default:
        return <TraditionalAtsDom content={content} pageView={pageView} />;
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
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 sm:p-3 flex items-center justify-between flex-wrap gap-2.5">
        
        {/* Left: View Mode & Template Selector */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setPreviewMode('dom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode === 'dom'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setPreviewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewMode === 'pdf'
                  ? 'bg-emerald-600 text-white shadow-2xs'
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
            className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 shadow-2xs max-w-[210px] truncate"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.tag})
              </option>
            ))}
          </select>
        </div>

        {/* Center/Right: Zoom & Page Controls (DOM Preview Mode) */}
        {previewMode === 'dom' && (
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
            {/* Page View Selector */}
            <div className="flex items-center gap-0.5 mr-1 border-r border-slate-200 pr-1.5">
              <button
                type="button"
                onClick={() => setPageView('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  pageView === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="View All Pages"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPageView(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  pageView === 1
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="View Page 1 Only"
              >
                P1
              </button>
              <button
                type="button"
                onClick={() => setPageView(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  pageView === 2
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="View Page 2 Only"
              >
                P2
              </button>
            </div>

            {/* Zoom Controls */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFit}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                zoomMode === 'fit'
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold ring-1 ring-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Fit to Width"
            >
              Fit
            </button>
            <button
              type="button"
              onClick={handleActualSize}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                zoomMode === 'custom' && customZoom === 1.0
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold ring-1 ring-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Actual Size (100%)"
            >
              100%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-400 pl-1 w-9 text-right select-none">
              {Math.round(effectiveScale * 100)}%
            </span>
          </div>
        )}

        {/* Right: Export Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {isClient && (
            <button
              type="button"
              onClick={() => {
                if (!canExport(isAuthenticated)) {
                  setShowAuthModal(true);
                  return;
                }
                handleExportJson();
                if (!isAuthenticated) recordExport();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Export Resume Data as JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
          )}

          {isClient && (
            canExport(isAuthenticated) ? (
              <PDFDownloadLink
                document={getPdfDocument()}
                fileName={`${(content.personalInfo.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_ats.pdf`}
                onClick={() => {
                  if (!isAuthenticated) {
                    recordExport();
                  }
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all hover:shadow cursor-pointer"
              >
                {/* @ts-ignore */}
                {({ loading }: { loading: boolean }) => (
                  <>
                    <Download className={`w-3.5 h-3.5 ${loading ? 'animate-bounce' : ''}`} />
                    <span>{loading ? 'Compiling ATS PDF...' : 'Download PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all hover:shadow cursor-pointer"
                title="Sign in to unlock unlimited downloads"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Preview Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 bg-slate-200/75 flex flex-col items-center min-h-[640px]"
      >
        {previewMode === 'pdf' && isClient ? (
          <div className="w-full h-[760px] rounded-xl overflow-hidden border border-slate-300 bg-white shadow-md">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              {getPdfDocument()}
            </PDFViewer>
          </div>
        ) : (
          /* Dynamic DOM Preview Sheet — exact A4 scaling matching PDF */
          <div
            style={{
              width: `${Math.round(794 * effectiveScale)}px`,
              height: measuredHeight ? `${Math.round(measuredHeight * effectiveScale)}px` : 'auto',
              position: 'relative',
              flexShrink: 0,
              transition: 'width 0.12s ease-out, height 0.12s ease-out',
            }}
          >
            <div
              ref={contentRef}
              style={{
                width: '794px',
                transform: `scale(${effectiveScale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {getDomDocument()}
            </div>
          </div>
        )}
      </div>

      {/* Guest Export Authentication Modal */}
      <GuestAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature="builder_export"
        redirectUrl="/builder"
      />
    </div>
  );
}
