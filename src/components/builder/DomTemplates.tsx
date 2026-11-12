'use client';

import { useRef } from 'react';
import { ResumeContent } from '@/types/resume';

export type PageViewMode = 1 | 2 | 'all';

function formatDisplayUrl(url?: string) {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

/**
 * A4 Page Break Guide Component (retained as null for backwards-compatibility)
 * Discrete A4 sheet rendering replaces the old text-slicing overlay.
 */
export function A4PageBreakGuide(_props: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  return null;
}

/* ─────────────────────────────────────────────────────────────
   A4 SHEET STYLING CONSTANTS (96 DPI Standard: 794px × 1123px)
   ───────────────────────────────────────────────────────────── */
const A4_SHEET_STYLE: React.CSSProperties = {
  width: '794px',
  minHeight: '1123px',
  backgroundColor: '#ffffff',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e2e8f0',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
};

/* ─────────────────────────────────────────────────────────────
   RESUME PARTITIONER FOR A4 MULTI-PAGE SPLITTING
   ───────────────────────────────────────────────────────────── */
function partitionResumeForA4(content: ResumeContent) {
  const hasSummary = !!content.summary;
  const eduCount = content.education?.length || 0;
  const skillsCount = content.skills?.length || 0;
  const expCount = content.experience?.length || 0;
  const expBullets = content.experience?.reduce((acc, e) => acc + (e.highlights?.length || 0), 0) || 0;

  const allProjects = content.projects || [];
  const projCount = allProjects.length;
  const projBullets = allProjects.reduce((acc, p) => acc + (p.highlights?.length || 0) + (p.description ? 1 : 0), 0);

  const achCount = content.achievements?.length || 0;
  const certCount = content.certifications?.length || 0;
  const refCount = content.references?.length || 0;

  const headerScore = 120;
  const summaryScore = hasSummary ? 85 : 0;
  const eduScore = eduCount * 55 + (eduCount > 0 ? 30 : 0);
  const skillsScore = skillsCount * 22 + (skillsCount > 0 ? 30 : 0);
  const expScore = expCount * 50 + expBullets * 18 + (expCount > 0 ? 30 : 0);

  const basePage1Score = headerScore + summaryScore + eduScore + skillsScore + expScore;
  const extrasScore = (achCount * 22 + (achCount > 0 ? 30 : 0)) +
                      (certCount * 22 + (certCount > 0 ? 30 : 0)) +
                      (refCount * 50 + (refCount > 0 ? 30 : 0));

  const projScores = allProjects.map(p => 38 + ((p.highlights?.length || 0) + (p.description ? 1 : 0)) * 18);
  const totalProjScore = projScores.reduce((a, b) => a + b, 0) + (projCount > 0 ? 30 : 0);

  const totalScore = basePage1Score + totalProjScore + extrasScore;

  // Single-page CV fits within printable height (~980px)
  if (totalScore <= 980) {
    return {
      totalPages: 1,
      page1Projects: allProjects,
      page2Projects: [] as typeof allProjects,
      showPage2Extras: false,
    };
  }

  // Multi-page CV (2 pages)
  const page1Room = Math.max(0, 960 - basePage1Score);
  const page1Projects: typeof allProjects = [];
  const page2Projects: typeof allProjects = [];

  let accumulatedProj = 0;
  allProjects.forEach((proj, idx) => {
    const pScore = projScores[idx];
    if (idx === 0 && page1Room >= 70) {
      page1Projects.push(proj);
      accumulatedProj += pScore;
    } else if (accumulatedProj + pScore <= page1Room && idx < 2) {
      page1Projects.push(proj);
      accumulatedProj += pScore;
    } else {
      page2Projects.push(proj);
    }
  });

  return {
    totalPages: 2,
    page1Projects,
    page2Projects,
    showPage2Extras: true,
  };
}

/* ─────────────────────────────────────────────────────────────
   CLASSIC ATS DOM COMPONENT
   Mirrors src/components/builder/templates/ClassicAts.tsx 1:1
   - Slate-900 / Slate-600 / Slate-500 typography
   - Two-column skills (28% category / 72% items)
   - Two-column education & experience
   - Distinct A4 sheets with page numbers (1/2, 2/2)
   ───────────────────────────────────────────────────────────── */

export function ClassicAtsDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;
  const partition = partitionResumeForA4(content);
  const { totalPages, page1Projects, page2Projects, showPage2Extras } = partition;

  const sectionHeadingStyle: React.CSSProperties = {
    borderTop: '1px solid #cbd5e1',
    paddingTop: '5px',
    marginBottom: '7px',
    fontSize: '13.3px',
    fontWeight: 700,
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  };

  const renderClassicHeader = () => (
    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
      <h1
        style={{
          fontSize: '26.6px',
          fontWeight: 700,
          fontFamily: 'Helvetica, Arial, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#0f172a',
          marginBottom: '4px',
          lineHeight: 1.2,
        }}
      >
        {personalInfo.fullName || 'YOUR NAME'}
      </h1>
      {personalInfo.jobTitle && (
        <div
          style={{
            fontSize: '12.6px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
          }}
        >
          {personalInfo.jobTitle}
        </div>
      )}

      {/* Contact Line 1 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px 8px',
          fontSize: '11.3px',
          color: '#64748b',
          marginBottom: '3px',
        }}
      >
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>
            {personalInfo.email}
          </a>
        )}
        {personalInfo.phone && <span>• {personalInfo.phone}</span>}
        {personalInfo.location && <span>• {personalInfo.location}</span>}
        {personalInfo.website && (
          <span>
            •{' '}
            <a
              href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              {formatDisplayUrl(personalInfo.website)}
            </a>
          </span>
        )}
      </div>

      {/* Contact Line 2: LinkedIn & GitHub */}
      {(personalInfo.linkedin || personalInfo.github) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px 8px',
            fontSize: '11.3px',
            color: '#64748b',
          }}
        >
          {personalInfo.linkedin && (
            <span>
              LinkedIn:{' '}
              <a
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#2563eb', textDecoration: 'underline' }}
              >
                {formatDisplayUrl(personalInfo.linkedin)}
              </a>
            </span>
          )}
          {personalInfo.linkedin && personalInfo.github && <span style={{ color: '#94a3b8' }}>|</span>}
          {personalInfo.github && (
            <span>
              GitHub:{' '}
              <a
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#2563eb', textDecoration: 'underline' }}
              >
                {formatDisplayUrl(personalInfo.github)}
              </a>
            </span>
          )}
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    content.summary ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Professional Summary</div>
        <p
          style={{
            fontSize: '12px',
            color: '#475569',
            lineHeight: '1.45',
            textAlign: 'justify',
            margin: 0,
          }}
        >
          {content.summary}
        </p>
      </div>
    ) : null
  );

  const renderEducation = () => (
    content.education.length > 0 ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Education</div>
        {content.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: '9px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1px' }}>
              <span style={{ fontSize: '12.6px', fontWeight: 700, color: '#0f172a' }}>{edu.institution}</span>
              <span style={{ fontSize: '11.3px', fontWeight: 700, color: '#64748b' }}>
                {edu.startDate} – {edu.endDate}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12.6px', color: '#334155' }}>
                {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
              </span>
              {edu.gpa && <span style={{ fontSize: '11.3px', color: '#64748b' }}>{edu.gpa}</span>}
            </div>
            {edu.highlights && edu.highlights.map((h, idx) => (
              <div key={idx} style={{ fontSize: '11.3px', color: '#475569', marginTop: '2px', lineHeight: '1.4', textAlign: 'justify' }}>
                {h}
              </div>
            ))}
          </div>
        ))}
      </div>
    ) : null
  );

  const renderSkills = () => (
    content.skills.length > 0 ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Technical Skills</div>
        {content.skills.map((category) => (
          <div key={category.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '4px' }}>
            <div style={{ width: '28%', flexShrink: 0, fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
              {category.categoryName}:
            </div>
            <div style={{ flex: 1, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              {category.skills.join(', ')}
            </div>
          </div>
        ))}
      </div>
    ) : null
  );

  const renderExperience = () => (
    content.experience.length > 0 ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Experience</div>
        {content.experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1px' }}>
              <span style={{ fontSize: '12.6px', fontWeight: 700, color: '#0f172a' }}>{exp.company}</span>
              <span style={{ fontSize: '11.3px', fontWeight: 700, color: '#64748b' }}>
                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12.6px', color: '#334155' }}>{exp.position}</span>
              {exp.location && <span style={{ fontSize: '11.3px', color: '#64748b' }}>{exp.location}</span>}
            </div>
            <div style={{ marginTop: '3px' }}>
              {exp.highlights.map((bullet, idx) => bullet ? (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '3px', paddingLeft: '5px' }}>
                  <span style={{ width: '12px', flexShrink: 0, fontSize: '12px', color: '#64748b' }}>•</span>
                  <span style={{ flex: 1, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{bullet}</span>
                </div>
              ) : null)}
            </div>
          </div>
        ))}
      </div>
    ) : null
  );

  const renderProjectList = (projects: typeof content.projects, startIndex = 1, isContinuation = false) => {
    if (!projects || projects.length === 0) return null;
    return (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Projects {isContinuation ? '(Continued)' : ''}</div>
        {projects.map((proj, idx) => (
          <div key={proj.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '3px 6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '12.6px', fontWeight: 700, color: '#0f172a' }}>
                {startIndex + idx}. {proj.name}
              </span>
              {proj.technologies && proj.technologies.length > 0 && (
                <span style={{ fontSize: '11.3px', color: '#64748b' }}>
                  | {proj.technologies.join(', ')}
                </span>
              )}
              {proj.url && (
                <>
                  <span style={{ color: '#94a3b8', fontSize: '11.3px' }}>|</span>
                  <a
                    href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11.3px', color: '#2563eb', textDecoration: 'underline' }}
                  >
                    Website Link
                  </a>
                </>
              )}
              {proj.githubUrl && (
                <>
                  <span style={{ color: '#94a3b8', fontSize: '11.3px' }}>|</span>
                  <a
                    href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11.3px', color: '#2563eb', textDecoration: 'underline' }}
                  >
                    Github
                  </a>
                </>
              )}
            </div>
            <div style={{ marginTop: '2px' }}>
              {proj.description && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '3px', paddingLeft: '5px' }}>
                  <span style={{ width: '12px', flexShrink: 0, fontSize: '12px', color: '#64748b' }}>•</span>
                  <span style={{ flex: 1, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{proj.description}</span>
                </div>
              )}
              {proj.highlights && proj.highlights.map((bullet, bIdx) => bullet ? (
                <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '3px', paddingLeft: '5px' }}>
                  <span style={{ width: '12px', flexShrink: 0, fontSize: '12px', color: '#64748b' }}>•</span>
                  <span style={{ flex: 1, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{bullet}</span>
                </div>
              ) : null)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAchievements = () => (
    content.achievements && content.achievements.length > 0 ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Extra-Curricular &amp; Achievements</div>
        {content.achievements.map((ach) => ach.title ? (
          <div key={ach.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '3px', paddingLeft: '5px' }}>
            <span style={{ width: '12px', flexShrink: 0, fontSize: '12px', color: '#64748b' }}>•</span>
            <span style={{ flex: 1, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{ach.title}</span>
          </div>
        ) : null)}
      </div>
    ) : null
  );

  const renderCertifications = () => (
    content.certifications && content.certifications.length > 0 ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>Certifications</div>
        {content.certifications.map((cert) => (
          <div key={cert.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '3px', paddingLeft: '5px' }}>
            <span style={{ width: '12px', flexShrink: 0, fontSize: '12px', color: '#64748b' }}>•</span>
            <span style={{ flex: 1, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              {cert.issuer && <span style={{ fontWeight: 700, color: '#0f172a' }}>{cert.issuer}: </span>}
              {cert.name}
              {cert.credentialId && (
                <span> ({cert.credentialId.includes(':') ? cert.credentialId : `ID: ${cert.credentialId}`})</span>
              )}
            </span>
          </div>
        ))}
      </div>
    ) : null
  );

  const renderReferences = () => (
    content.references && content.references.length > 0 ? (
      <div style={{ marginBottom: '11px' }}>
        <div style={sectionHeadingStyle}>References</div>
        {content.references.map((ref) => (
          <div key={ref.id} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '12.6px', fontWeight: 700, color: '#0f172a' }}>
              {ref.name}{ref.designation ? ` | ${ref.designation}` : ''}{ref.institution ? `, ${ref.institution}` : ''}
            </div>
            {ref.email && (
              <div style={{ fontSize: '11.3px', color: '#475569', marginTop: '2px' }}>
                Email:{' '}
                <a href={`mailto:${ref.email}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  {ref.email}
                </a>
                {ref.phone && <span> | Phone: {ref.phone}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : null
  );

  const renderFooter = (pageNumber: number) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: '10.7px',
        color: '#94a3b8',
        fontFamily: 'Helvetica, Arial, sans-serif',
        paddingTop: '8px',
      }}
    >
      <span>{pageNumber} / {totalPages}</span>
    </div>
  );

  // Render Page 1 Sheet
  const renderSheet1 = () => (
    <div
      key="classic-sheet-1"
      style={{
        ...A4_SHEET_STYLE,
        padding: '48px 58px 36px 58px',
      }}
    >
      <div>
        {renderClassicHeader()}
        {renderSummary()}
        {renderEducation()}
        {renderSkills()}
        {renderExperience()}
        {renderProjectList(page1Projects, 1, false)}
        {!showPage2Extras && (
          <>
            {renderAchievements()}
            {renderCertifications()}
            {renderReferences()}
          </>
        )}
      </div>
      {renderFooter(1)}
    </div>
  );

  // Render Page 2 Sheet
  const renderSheet2 = () => (
    <div
      key="classic-sheet-2"
      style={{
        ...A4_SHEET_STYLE,
        padding: '48px 58px 36px 58px',
      }}
    >
      <div>
        {renderProjectList(page2Projects, page1Projects.length + 1, page1Projects.length > 0)}
        {renderAchievements()}
        {renderCertifications()}
        {renderReferences()}
      </div>
      {renderFooter(2)}
    </div>
  );

  // Single page requested
  if (pageView === 1) {
    return <div className="flex flex-col items-center">{renderSheet1()}</div>;
  }
  if (pageView === 2) {
    return <div className="flex flex-col items-center">{totalPages > 1 ? renderSheet2() : renderSheet1()}</div>;
  }

  // All pages view
  return (
    <div className="flex flex-col items-center">
      {renderSheet1()}
      {totalPages > 1 && (
        <>
          <div className="flex items-center justify-center my-6 gap-3 select-none">
            <div className="h-px bg-slate-300 w-24" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200/80 px-3.5 py-1 rounded-full shadow-2xs">
              Page 2 of {totalPages}
            </span>
            <div className="h-px bg-slate-300 w-24" />
          </div>
          {renderSheet2()}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TRADITIONAL ATS DOM COMPONENT
   Mirrors TraditionalAts.tsx PDF template:
   - All black typography (#000000)
   - Centered headers with horizontal divider rules
   - Guaranteed single-column ATS parseability
   - Discrete A4 sheets (no sliced text)
   ───────────────────────────────────────────────────────────── */

export function TraditionalAtsDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;
  const partition = partitionResumeForA4(content);
  const { totalPages, page1Projects, page2Projects, showPage2Extras } = partition;

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#000000',
    borderBottom: '1px solid #000000',
    paddingBottom: '3px',
    marginBottom: '7px',
    fontFamily: 'Helvetica, Arial, sans-serif',
  };

  const renderTraditionalHeader = () => (
    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#000000',
          marginBottom: '4px',
          lineHeight: '1.2',
        }}
      >
        {personalInfo.fullName || 'YOUR NAME'}
      </h1>
      {personalInfo.jobTitle && (
        <p
          style={{
            fontSize: '14px',
            color: '#000000',
            marginBottom: '6px',
          }}
        >
          {personalInfo.jobTitle}
        </p>
      )}

      {/* Contact Line 1 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0px 8px',
          fontSize: '12px',
          color: '#000000',
          marginBottom: '3px',
        }}
      >
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} style={{ color: '#000', textDecoration: 'underline' }}>
            {personalInfo.email}
          </a>
        )}
        {personalInfo.email && personalInfo.phone && <span style={{ color: '#555' }}>|</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.phone && personalInfo.location && <span style={{ color: '#555' }}>|</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.location && personalInfo.website && <span style={{ color: '#555' }}>|</span>}
        {personalInfo.website && (
          <a
            href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#000', textDecoration: 'underline' }}
          >
            {formatDisplayUrl(personalInfo.website)}
          </a>
        )}
      </div>

      {/* Contact Line 2: LinkedIn & GitHub */}
      {(personalInfo.linkedin || personalInfo.github) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0px 8px',
            fontSize: '12px',
            color: '#000000',
          }}
        >
          {personalInfo.linkedin && (
            <span>
              LinkedIn:{' '}
              <a
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#0056b3', textDecoration: 'underline' }}
              >
                {formatDisplayUrl(personalInfo.linkedin)}
              </a>
            </span>
          )}
          {personalInfo.linkedin && personalInfo.github && <span style={{ color: '#555' }}>|</span>}
          {personalInfo.github && (
            <span>
              GitHub:{' '}
              <a
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#0056b3', textDecoration: 'underline' }}
              >
                {formatDisplayUrl(personalInfo.github)}
              </a>
            </span>
          )}
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    content.summary ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Summary</h2>
        <p style={{ fontSize: '12.5px', lineHeight: '1.4', color: '#000000', margin: 0, textAlign: 'justify' }}>
          {content.summary}
        </p>
      </div>
    ) : null
  );

  const renderEducation = () => (
    content.education.length > 0 ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Education</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {content.education.map((edu, idx) => (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12.7px' }}>
                <span>
                  {idx + 1}. {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                </span>
                <span style={{ fontWeight: 400, color: '#333' }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#000000' }}>{edu.institution}</div>
              {edu.gpa && <div style={{ fontSize: '12px', color: '#444' }}>Cumulative GPA: {edu.gpa}</div>}
              {edu.highlights && edu.highlights.map((h, hIdx) => (
                <div key={hIdx} style={{ fontSize: '12px', color: '#333', marginTop: '1px' }}>{h}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderSkills = () => (
    content.skills.length > 0 ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Technical Skills</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {content.skills.map((category) => (
            <div key={category.id} style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#000' }}>
              <span style={{ fontWeight: 700 }}>{category.categoryName}: </span>
              <span>{category.skills.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderExperience = () => (
    content.experience.length > 0 ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Experience</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {content.experience.map((exp) => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '12.7px', color: '#000' }}>
                  {exp.position} – {exp.company}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#000' }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: '11.5px', color: '#444' }}>{exp.location}</div>}
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {exp.highlights.map((bullet, bIdx) => bullet ? (
                  <li key={bIdx} style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#000' }}>
                    {bullet}
                  </li>
                ) : null)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderProjectList = (projects: typeof content.projects, startIndex = 1, isContinuation = false) => {
    if (!projects || projects.length === 0) return null;
    return (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Projects {isContinuation ? '(Continued)' : ''}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map((proj, idx) => (
            <div key={proj.id}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 6px', fontSize: '12.7px' }}>
                <span style={{ fontWeight: 700, color: '#000' }}>{startIndex + idx}. {proj.name}</span>
                {proj.technologies && proj.technologies.length > 0 && (
                  <span style={{ color: '#000' }}>| {proj.technologies.join(', ')}</span>
                )}
                {proj.url && (
                  <>
                    <span style={{ color: '#555' }}>|</span>
                    <a
                      href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0056b3', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      Website Link
                    </a>
                  </>
                )}
                {proj.githubUrl && (
                  <>
                    <span style={{ color: '#555' }}>|</span>
                    <a
                      href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0056b3', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      Github
                    </a>
                  </>
                )}
              </div>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {proj.description && (
                  <li style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#000' }}>
                    {proj.description}
                  </li>
                )}
                {proj.highlights && proj.highlights.map((bullet, bIdx) => bullet ? (
                  <li key={bIdx} style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#000' }}>
                    {bullet}
                  </li>
                ) : null)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => (
    content.achievements && content.achievements.length > 0 ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Extra-Curricular &amp; Achievements</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {content.achievements.map((ach) => ach.title ? (
            <li key={ach.id} style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#000' }}>
              {ach.title}
            </li>
          ) : null)}
        </ul>
      </div>
    ) : null
  );

  const renderCertifications = () => (
    content.certifications && content.certifications.length > 0 ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>Certifications</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {content.certifications.map((cert) => (
            <li key={cert.id} style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#000' }}>
              <span style={{ fontWeight: 700 }}>{cert.issuer ? `${cert.issuer}: ` : ''}</span>
              {cert.name}
              {cert.credentialId && (
                <span style={{ color: '#333' }}>
                  {' '}({cert.credentialId.includes(':') ? cert.credentialId : `ID: ${cert.credentialId}`})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    ) : null
  );

  const renderReferences = () => (
    content.references && content.references.length > 0 ? (
      <div style={{ marginBottom: '12px' }}>
        <h2 style={sectionHeadingStyle}>References</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {content.references.map((ref) => (
            <div key={ref.id}>
              <div style={{ fontWeight: 700, fontSize: '12.7px', color: '#000' }}>
                {ref.name}{ref.designation ? ` | ${ref.designation}` : ''}{ref.institution ? `, ${ref.institution}` : ''}
              </div>
              {ref.email && (
                <div style={{ fontSize: '12px', color: '#000', marginTop: '1px' }}>
                  Email:{' '}
                  <a href={`mailto:${ref.email}`} style={{ color: '#000', textDecoration: 'underline' }}>
                    {ref.email}
                  </a>
                  {ref.phone && <span> | Phone: {ref.phone}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderFooter = (pageNumber: number) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: '10.7px',
        color: '#666666',
        paddingTop: '8px',
      }}
    >
      <span>{pageNumber} / {totalPages}</span>
    </div>
  );

  const renderSheet1 = () => (
    <div
      key="trad-sheet-1"
      style={{
        ...A4_SHEET_STYLE,
        padding: '43px 48px 36px 48px',
      }}
    >
      <div>
        {renderTraditionalHeader()}
        {renderSummary()}
        {renderEducation()}
        {renderSkills()}
        {renderExperience()}
        {renderProjectList(page1Projects, 1, false)}
        {!showPage2Extras && (
          <>
            {renderAchievements()}
            {renderCertifications()}
            {renderReferences()}
          </>
        )}
      </div>
      {renderFooter(1)}
    </div>
  );

  const renderSheet2 = () => (
    <div
      key="trad-sheet-2"
      style={{
        ...A4_SHEET_STYLE,
        padding: '43px 48px 36px 48px',
      }}
    >
      <div>
        {renderProjectList(page2Projects, page1Projects.length + 1, page1Projects.length > 0)}
        {renderAchievements()}
        {renderCertifications()}
        {renderReferences()}
      </div>
      {renderFooter(2)}
    </div>
  );

  if (pageView === 1) {
    return <div className="flex flex-col items-center">{renderSheet1()}</div>;
  }
  if (pageView === 2) {
    return <div className="flex flex-col items-center">{totalPages > 1 ? renderSheet2() : renderSheet1()}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {renderSheet1()}
      {totalPages > 1 && (
        <>
          <div className="flex items-center justify-center my-6 gap-3 select-none">
            <div className="h-px bg-slate-300 w-24" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200/80 px-3.5 py-1 rounded-full shadow-2xs">
              Page 2 of {totalPages}
            </span>
            <div className="h-px bg-slate-300 w-24" />
          </div>
          {renderSheet2()}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODERN EXECUTIVE DOM COMPONENT
   Two-column executive layout (65% Main / 35% Dark Sidebar)
   ───────────────────────────────────────────────────────────── */

export function ModernExecutiveDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;

  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          ...A4_SHEET_STYLE,
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Column (Main 65%) */}
        <div style={{ width: '65%', padding: '40px 32px 40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: '1', marginBottom: '4px' }}>
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            {personalInfo.jobTitle && (
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '6px 0 12px' }}>
                {personalInfo.jobTitle}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10.5px', color: '#64748b', marginBottom: '24px', fontWeight: 500 }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
            </div>

            {content.summary && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  Summary
                </h2>
                <p style={{ fontSize: '11px', lineHeight: '1.5', color: '#475569' }}>{content.summary}</p>
              </div>
            )}

            {content.education && content.education.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  Education
                </h2>
                {content.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '8px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                      <span>{edu.degree}</span>
                      <span style={{ color: '#64748b', fontSize: '10px' }}>{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <div style={{ color: '#2563eb', fontWeight: 500 }}>{edu.institution}</div>
                    {edu.gpa && <div style={{ color: '#64748b', fontSize: '10px' }}>{edu.gpa}</div>}
                  </div>
                ))}
              </div>
            )}

            {content.experience && content.experience.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  Experience
                </h2>
                {content.experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '12px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                      <span>{exp.position}</span>
                      <span style={{ color: '#64748b', fontSize: '10px' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div style={{ color: '#2563eb', fontWeight: 600, marginBottom: '4px' }}>{exp.company}</div>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {exp.highlights.map((h, idx) => h ? <li key={idx} style={{ fontSize: '10.5px', color: '#475569' }}>{h}</li> : null)}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {content.projects && content.projects.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  Projects
                </h2>
                {content.projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: '10px', fontSize: '11px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{proj.name}</div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 500 }}>{proj.technologies.join(', ')}</div>
                    )}
                    {proj.description && <p style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500, paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            Executive Format • 1 / 1
          </div>
        </div>

        {/* Right Column (Sidebar 35%) */}
        <div
          style={{
            width: '35%',
            backgroundColor: '#0f172a',
            padding: '40px 24px',
            color: '#f1f5f9',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {content.skills && content.skills.length > 0 && (
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '12px' }}>
                Technical Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.skills.map((cat) => (
                  <div key={cat.id}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '10.5px' }}>{cat.categoryName}</div>
                    <div style={{ color: '#94a3b8', fontSize: '10px', lineHeight: '1.5' }}>{cat.skills.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.certifications && content.certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '8px' }}>
                Certifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {content.certifications.map((cert) => (
                  <div key={cert.id} style={{ fontSize: '10.5px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{cert.issuer}: {cert.name}</div>
                    {cert.credentialId && <div style={{ color: '#94a3b8', fontSize: '9.5px' }}>{cert.credentialId}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.achievements && content.achievements.length > 0 && (
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '8px' }}>
                Achievements
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px', color: '#cbd5e1' }}>
                {content.achievements.map((ach) => (
                  <div key={ach.id}>• {ach.title}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TECHNICAL CLEAN DOM COMPONENT
   Left sidebar + right main layout
   ───────────────────────────────────────────────────────────── */

export function TechnicalCleanDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;

  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          ...A4_SHEET_STYLE,
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Column (Light Sidebar 33%) */}
        <div
          style={{
            width: '33%',
            backgroundColor: '#f8fafc',
            padding: '40px 24px',
            borderRight: '1px solid #e2e8f0',
            color: '#475569',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#065f46', marginBottom: '8px', fontFamily: 'monospace' }}>
                {'// Contacts'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10.5px', color: '#64748b' }}>
                {personalInfo.phone && <div>{personalInfo.phone}</div>}
                {personalInfo.email && <div>{personalInfo.email}</div>}
                {personalInfo.location && <div>{personalInfo.location}</div>}
                {personalInfo.website && <div>{formatDisplayUrl(personalInfo.website)}</div>}
                {personalInfo.linkedin && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDisplayUrl(personalInfo.linkedin)}</div>}
                {personalInfo.github && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDisplayUrl(personalInfo.github)}</div>}
              </div>
            </div>

            {content.skills && content.skills.length > 0 && (
              <div>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#065f46', marginBottom: '8px', fontFamily: 'monospace' }}>
                  {'// Tech Stack'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {content.skills.map((cat) => (
                    <div key={cat.id}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '10.5px' }}>{cat.categoryName}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>{cat.skills.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
            {'// Technical ATS • 1 / 1'}
          </div>
        </div>

        {/* Right Column (Main 67%) */}
        <div style={{ width: '67%', padding: '40px 40px 40px 32px', fontSize: '11px' }}>
          <div style={{ backgroundColor: '#ecfdf5', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid #d1fae5' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#022c22', letterSpacing: '-0.5px' }}>
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            {personalInfo.jobTitle && (
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {content.summary && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#065f46', borderBottom: '1px solid #a7f3d0', paddingBottom: '4px', marginBottom: '8px', fontFamily: 'monospace' }}>
                {'// Summary'}
              </h2>
              <p style={{ fontSize: '11px', lineHeight: '1.5', color: '#475569' }}>{content.summary}</p>
            </div>
          )}

          {content.experience && content.experience.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#065f46', borderBottom: '1px solid #a7f3d0', paddingBottom: '4px', marginBottom: '8px', fontFamily: 'monospace' }}>
                {'// Experience'}
              </h2>
              {content.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                    <span>{exp.position}</span>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ color: '#047857', fontWeight: 600 }}>{exp.company}</div>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: '4px 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {exp.highlights.map((h, idx) => h ? <li key={idx} style={{ color: '#475569', fontSize: '10.5px' }}>{h}</li> : null)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {content.projects && content.projects.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#065f46', borderBottom: '1px solid #a7f3d0', paddingBottom: '4px', marginBottom: '8px', fontFamily: 'monospace' }}>
                {'// Projects'}
              </h2>
              {content.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{proj.name}</div>
                  {proj.technologies && (
                    <div style={{ fontSize: '10px', color: '#047857', fontWeight: 500 }}>{proj.technologies.join(', ')}</div>
                  )}
                  <ul style={{ listStyleType: 'disc', paddingLeft: '16px', margin: '4px 0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {proj.highlights?.map((h, idx) => h ? <li key={idx} style={{ color: '#475569', fontSize: '10.5px' }}>{h}</li> : null)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
