'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { TemplateId } from '@/types/resume';
import { ClassicAtsTemplate } from './templates/ClassicAts';
import { ModernExecutiveTemplate } from './templates/ModernExecutive';
import { TechnicalCleanTemplate } from './templates/TechnicalClean';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Download, Eye, FileText } from 'lucide-react';

export function LivePreview() {
  const { content, templateId, setTemplateId, title } = useResumeStore();
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
      default:
        return <ClassicAtsTemplate content={content} />;
    }
  };

  const templates: { id: TemplateId; name: string; tag: string }[] = [
    { id: 'classic-ats', name: 'Classic ATS', tag: 'Parsing Optimized' },
    { id: 'modern-executive', name: 'Modern Executive', tag: 'Leadership' },
    { id: 'technical-clean', name: 'Technical Clean', tag: 'Tech Stack' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('dom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                previewMode === 'dom'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setPreviewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                previewMode === 'pdf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </div>

          {/* Template Selector */}
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value as TemplateId)}
            className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.tag})
              </option>
            ))}
          </select>
        </div>

        {/* Download Trigger */}
        {isClient && (
          <PDFDownloadLink
            document={getPdfDocument()}
            fileName={`${(content.personalInfo.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_ats.pdf`}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            {/* @ts-ignore */}
            {({ loading }: { loading: boolean }) => (
              <>
                <Download className={`w-3.5 h-3.5 ${loading ? 'animate-bounce' : ''}`} />
                <span>{loading ? 'Compiling...' : 'Download PDF'}</span>
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100 flex justify-center">
        {previewMode === 'pdf' && isClient ? (
          <div className="w-full h-[750px] rounded-lg overflow-hidden border border-slate-200">
            <PDFViewer width="100%" height="100%" showToolbar={true}>
              {getPdfDocument()}
            </PDFViewer>
          </div>
        ) : (
          /* DOM Preview Sheet */
          <div className="w-full max-w-[800px] min-h-[1000px] bg-white text-slate-900 p-8 sm:p-12 shadow-lg rounded-sm font-sans text-xs leading-relaxed transition-all border border-slate-200">
            {/* DOM Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
                {content.personalInfo.fullName || 'YOUR FULL NAME'}
              </h1>
              {content.personalInfo.jobTitle && (
                <p className="text-sm font-bold text-blue-700 mt-1">
                  {content.personalInfo.jobTitle}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600 text-[11px] mt-2">
                {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                {content.personalInfo.phone && <span>• {content.personalInfo.phone}</span>}
                {content.personalInfo.location && <span>• {content.personalInfo.location}</span>}
                {content.personalInfo.linkedin && (
                  <span className="text-blue-600 truncate">{content.personalInfo.linkedin}</span>
                )}
                {content.personalInfo.github && (
                  <span className="text-slate-800 truncate">{content.personalInfo.github}</span>
                )}
              </div>
            </div>

            {/* DOM Summary */}
            {content.summary && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-slate-700 leading-normal">{content.summary}</p>
              </div>
            )}

            {/* DOM Experience */}
            {content.experience && content.experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                  Work Experience
                </h2>
                {content.experience.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-600 text-[11px] mb-1 italic">
                      <span>{exp.company}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {exp.highlights.map((h, idx) =>
                        h ? <li key={idx}>{h}</li> : null
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* DOM Skills */}
            {content.skills && content.skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Technical Skills
                </h2>
                <div className="space-y-1.5">
                  {content.skills.map((cat) => (
                    <div key={cat.id} className="flex gap-2">
                      <span className="font-bold text-slate-900 min-w-[130px]">{cat.categoryName}:</span>
                      <span className="text-slate-700">{cat.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOM Education */}
            {content.education && content.education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Education
                </h2>
                {content.education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px] italic">
                      <span>{edu.institution}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DOM Projects */}
            {content.projects && content.projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Key Projects
                </h2>
                {content.projects.map((proj) => (
                  <div key={proj.id} className="mb-2">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{proj.name}</span>
                      {proj.url && <span className="text-[11px] text-blue-600 font-normal">{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-slate-700 text-[11px] mt-0.5">{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Tech Stack: {proj.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
