'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { ResumeContent, TemplateId } from '@/types/resume';
import ClassicAtsTemplate from './templates/ClassicAts';
import ModernExecutiveTemplate from './templates/ModernExecutive';
import TechnicalCleanTemplate from './templates/TechnicalClean';
import TraditionalAtsTemplate from './templates/TraditionalAts';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Download, Eye, FileText } from 'lucide-react';

/* --- DOM PREVIEW COMPONENTS --- */

export function ClassicAtsDom({ content }: { content: ResumeContent }) {
  return (
    <div className="w-full max-w-[794px] min-h-[1123px] bg-white pt-10 pb-10 px-12 shadow-sm font-sans text-slate-700 mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 mb-1.5">
          {content.personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {content.personalInfo.jobTitle && (
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-3">
            {content.personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
          {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
          {content.personalInfo.location && <span>{content.personalInfo.location}</span>}
          {content.personalInfo.linkedin && <span>{content.personalInfo.linkedin}</span>}
          {content.personalInfo.github && <span>{content.personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-5">
          <div className="border-t border-slate-200 pt-2 mb-3 text-center">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900">
              Professional Summary
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 text-justify">{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experience && content.experience.length > 0 && (
        <div className="mb-5">
          <div className="border-t border-slate-200 pt-2 mb-3 text-center">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900">
              Experience
            </h2>
          </div>
          {content.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-bold text-slate-900 text-[13px]">{exp.company}</span>
                <span className="text-xs text-slate-500 font-normal">{exp.location}</span>
              </div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[13px] text-slate-700 font-medium">{exp.position}</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                {exp.highlights.map((h, idx) => (h ? <li key={idx} className="pl-1 leading-relaxed">{h}</li> : null))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mb-5">
          <div className="border-t border-slate-200 pt-2 mb-3 text-center">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900">
              Education
            </h2>
          </div>
          {content.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-bold text-slate-900 text-[13px]">{edu.institution}</span>
                <span className="text-[11px] text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div className="mb-5">
          <div className="border-t border-slate-200 pt-2 mb-3 text-center">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900">
              Skills & Competencies
            </h2>
          </div>
          <div className="space-y-2">
            {content.skills.map((cat) => (
              <div key={cat.id} className="flex gap-4 text-xs">
                <span className="font-bold text-slate-900 w-1/4 shrink-0">{cat.categoryName}</span>
                <span className="text-slate-600 leading-relaxed flex-1">{cat.skills.join(' • ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <div>
          <div className="border-t border-slate-200 pt-2 mb-3 text-center">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900">
              Projects
            </h2>
          </div>
          {content.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-bold text-slate-900 text-[13px]">{proj.name}</span>
              </div>
              {proj.url && <p className="text-[11px] text-blue-600 mb-1">{proj.url}</p>}
              {proj.description && <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export function ModernExecutiveDom({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;
  const avatarUrl = personalInfo.github && personalInfo.github.startsWith('http') ? personalInfo.github : null;

  return (
    <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-sm font-sans flex mx-auto overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Left Column */}
      <div className="w-2/3 bg-white pt-12 pb-12 pl-12 pr-10">
        <h1 className="text-[34px] font-bold text-slate-900 tracking-tight leading-none mb-1">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-[13px] font-bold text-blue-600 uppercase tracking-widest mt-2 mb-4">
            {personalInfo.jobTitle}
          </p>
        )}
        
        <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 mb-8 font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>

        {content.summary && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900 border-b-[1.5px] border-slate-300 pb-1 mb-3">
              Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">{content.summary}</p>
          </div>
        )}

        {content.experience && content.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900 border-b-[1.5px] border-slate-300 pb-1 mb-3">
              Experience
            </h2>
            {content.experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-slate-900 text-[13px]">{exp.position}</span>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-bold text-blue-600 mb-2">
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11.5px] text-slate-700 marker:text-slate-400">
                  {exp.highlights.map((h, idx) => (h ? <li key={idx} className="pl-1 leading-relaxed">{h}</li> : null))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {content.education && content.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-900 border-b-[1.5px] border-slate-300 pb-1 mb-3">
              Education
            </h2>
            {content.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-slate-900 text-[13px]">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-xs font-bold text-blue-600">
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column (Dark Sidebar) */}
      <div className="w-1/3 bg-slate-800 pt-12 pb-12 px-8 text-slate-100">
        {avatarUrl && (
          <div className="flex justify-center mb-8">
            <img src={avatarUrl} alt="Profile Avatar" className="w-[100px] h-[100px] rounded-full object-cover border-2 border-slate-600" />
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div className="space-y-8">
            {content.skills.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-white border-b-[1.5px] border-slate-600 pb-1 mb-4">
                  {cat.categoryName}
                </h2>
                
                {cat.categoryName.toLowerCase().includes('achievement') ? (
                  <div className="space-y-3">
                    {cat.skills.map((skill, idx) => {
                      if (skill.includes(':')) {
                        const [title, desc] = skill.split(':');
                        return (
                          <div key={idx}>
                            <h3 className="font-bold text-white text-[12px] mb-0.5">{title}</h3>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{desc.trim()}</p>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex gap-2">
                          <span className="text-blue-500 text-sm leading-none">›</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">{skill}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {cat.skills.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export function TechnicalCleanDom({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;
  const avatarUrl = personalInfo.github && personalInfo.github.startsWith('http') ? personalInfo.github : null;

  return (
    <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-sm font-sans flex mx-auto overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Left Column (Light Sidebar) */}
      <div className="w-1/3 bg-slate-50 pt-12 pb-12 px-8 border-r border-slate-200 text-slate-700">
        
        {avatarUrl && (
          <div className="flex justify-center mb-8">
            <img src={avatarUrl} alt="Profile Avatar" className="w-[120px] h-[120px] rounded-full object-cover shadow-sm" />
          </div>
        )}

        {/* Contacts */}
        <div className="mb-8">
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest text-emerald-700 mb-3">
            <span className="text-emerald-700 text-lg">■</span> Contacts
          </h2>
          <div className="space-y-1.5 text-[11px] font-medium text-slate-600">
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
        </div>

        {/* Skills / Categories */}
        {content.skills && content.skills.length > 0 && (
          <div className="space-y-8">
            {content.skills.map((cat) => (
              <div key={cat.id}>
                <h2 className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest text-emerald-700 mb-3">
                  <span className="text-emerald-700 text-lg">■</span> {cat.categoryName}
                </h2>
                
                {cat.categoryName.toLowerCase().includes('achievement') ? (
                  <div className="space-y-3">
                    {cat.skills.map((skill, idx) => {
                      if (skill.includes(':')) {
                        const [title, desc] = skill.split(':');
                        return (
                          <div key={idx}>
                            <h3 className="font-bold text-slate-900 text-[12px] mb-0.5 flex items-start gap-1">
                              <span className="text-emerald-700">•</span> {title}
                            </h3>
                            <p className="text-[11px] text-slate-600 leading-relaxed ml-3">{desc.trim()}</p>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-700 font-bold">•</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{skill}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {cat.skills.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column (Main Content) */}
      <div className="w-2/3 bg-white pt-12 pb-12 pl-10 pr-12">
        
        {/* Header Pill */}
        <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100">
          <h1 className="text-[32px] font-bold text-emerald-900 tracking-tight leading-none mb-1">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-[13px] font-bold text-emerald-700 mt-2">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {content.summary && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-emerald-700 border-b-[1.5px] border-emerald-200 pb-1 mb-3">
              Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">{content.summary}</p>
          </div>
        )}

        {content.experience && content.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-emerald-700 border-b-[1.5px] border-emerald-200 pb-1 mb-4">
              Experience
            </h2>
            {content.experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-emerald-700 text-[13px]">{exp.company}</span>
                  <span className="text-[11px] text-slate-500 font-bold">{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-slate-900 text-[13.5px]">{exp.position}</span>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11.5px] text-slate-700 marker:text-emerald-700">
                  {exp.highlights.map((h, idx) => (h ? <li key={idx} className="pl-1 leading-relaxed">{h}</li> : null))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {content.education && content.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-emerald-700 border-b-[1.5px] border-emerald-200 pb-1 mb-3">
              Education
            </h2>
            {content.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-slate-900 text-[13.5px]">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export function TraditionalAtsDom({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;
  return (
    <div className="w-full max-w-[794px] min-h-[1123px] bg-white pt-10 px-14 pb-12 shadow-sm mx-auto" style={{ fontFamily: '"Times New Roman", Times, serif', color: '#000' }}>
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px]">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && (personalInfo.email || personalInfo.linkedin) && <span>|</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.linkedin && personalInfo.github && <span>|</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2">
            Education
          </h2>
          {content.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-bold text-[14px]">{edu.institution}</span>
                <span className="text-[13px]">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic text-[13.5px]">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </span>
                {edu.gpa && <span className="italic text-[13.5px]">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {content.experience && content.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b-[1.5px] border-black pb-1 mb-3">
            Experience
          </h2>
          {content.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-bold text-[14px]">{exp.position}</span>
                <span className="text-[13px]">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="italic text-[13.5px]">{exp.company}</span>
                {exp.location && <span className="text-[13px]">{exp.location}</span>}
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[13px] marker:text-black">
                {exp.highlights.map((h, idx) => (h ? <li key={idx} className="pl-1 leading-relaxed">{h}</li> : null))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b-[1.5px] border-black pb-1 mb-3">
            Projects
          </h2>
          {content.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[14px]">{proj.name}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="italic text-[13.5px]">| {proj.technologies.join(', ')}</span>
                  )}
                </div>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[13px] marker:text-black">
                {proj.description && <li className="pl-1 leading-relaxed">{proj.description}</li>}
                {proj.highlights && proj.highlights.map((h, idx) => (h ? <li key={idx} className="pl-1 leading-relaxed">{h}</li> : null))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2">
            Technical Skills
          </h2>
          <div className="space-y-1 text-[13.5px]">
            {content.skills.map((cat) => (
              <div key={cat.id} className="flex gap-2">
                <span className="font-bold">{cat.categoryName}:</span>
                <span>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* --- MAIN COMPONENT --- */

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
      case 'traditional-ats':
        return <TraditionalAtsTemplate content={content} />;
      case 'classic-ats':
      default:
        return <ClassicAtsTemplate content={content} />;
    }
  };

  const getDomDocument = () => {
    switch (templateId) {
      case 'modern-executive':
        return <ModernExecutiveDom content={content} />;
      case 'technical-clean':
        return <TechnicalCleanDom content={content} />;
      case 'traditional-ats':
        return <TraditionalAtsDom content={content} />;
      case 'classic-ats':
      default:
        return <ClassicAtsDom content={content} />;
    }
  };

  const templates: { id: TemplateId; name: string; tag: string }[] = [
    { id: 'classic-ats', name: 'Classic ATS', tag: 'Parsing Optimized' },
    { id: 'modern-executive', name: 'Modern Executive', tag: 'Leadership' },
    { id: 'technical-clean', name: 'Technical Clean', tag: 'Tech Stack' },
    { id: 'traditional-ats', name: 'Traditional ATS', tag: 'Gold Standard' },
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
          /* Dynamic DOM Preview Sheet */
          <div className="transition-all transform origin-top w-full flex justify-center">
             {getDomDocument()}
          </div>
        )}
      </div>
    </div>
  );
}
