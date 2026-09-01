'use client';

import { ResumeContent } from '@/types/resume';

export type PageViewMode = 1 | 2 | 'all';

function formatDisplayUrl(url?: string) {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

/* ────────────────────────────────────────────────
   TRADITIONAL ATS DOM COMPONENT
   Mirrors TraditionalAts.tsx PDF template exactly:
   - Same section order
   - Same font sizes (pt → px approximate)
   - Same spacing, margins
   - Continuous flow (no manual page split)
   ──────────────────────────────────────────────── */

export function TraditionalAtsDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;

  // PDF uses pt units. 1pt ≈ 1.333px. We map sizes to match:
  // PDF page padding: 32pt top, 36pt bottom, 36pt horizontal → ~43px, ~48px, ~48px
  // PDF fontSize 9.5pt → ~12.7px, heading 10.5pt → ~14px, name 18pt → ~24px
  // We render a single continuous A4 sheet that auto-overflows

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full max-w-[800px] bg-white shadow-lg border border-slate-200/80 mx-auto text-black relative"
        style={{
          fontFamily: 'Helvetica, Arial, "Helvetica Neue", sans-serif',
          fontSize: '12.7px',
          lineHeight: '1.35',
          color: '#000000',
          padding: '43px 48px 48px 48px',
        }}
      >
        {/* ═══ HEADER ═══ */}
        <div style={{ textAlign: 'center', marginBottom: '13px' }}>
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
                fontSize: '14.7px',
                fontWeight: 400,
                color: '#000000',
                marginBottom: '5px',
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
                    style={{ color: '#000', textDecoration: 'underline' }}
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
                    style={{ color: '#000', textDecoration: 'underline' }}
                  >
                    {formatDisplayUrl(personalInfo.github)}
                  </a>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ═══ SUMMARY ═══ */}
        {content.summary && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Summary
            </h2>
            <p
              style={{
                fontSize: '12.7px',
                lineHeight: '1.35',
                textAlign: 'justify',
                color: '#000',
              }}
            >
              {content.summary}
            </p>
          </div>
        )}

        {/* ═══ EDUCATION ═══ */}
        {content.education && content.education.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div style={{ fontWeight: 700, fontSize: '12.7px', color: '#000' }}>
                    {idx + 1}. {edu.degree || 'Degree'}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    {edu.startDate || edu.endDate ? ` | ${edu.startDate ? edu.startDate + ' – ' : ''}${edu.endDate || ''}` : ''}
                  </div>
                  {edu.institution && (
                    <div style={{ fontSize: '12.7px', color: '#000' }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </div>
                  )}
                  {edu.gpa && (
                    <div style={{ fontSize: '12.7px', color: '#000' }}>{edu.gpa}</div>
                  )}
                  {edu.highlights && edu.highlights.map((h, hIdx) => (
                    <div key={hIdx} style={{ fontSize: '12.7px', color: '#000' }}>{h}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TECHNICAL SKILLS ═══ */}
        {content.skills && content.skills.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Technical Skills
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {content.skills.map((cat) => (
                <div key={cat.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', fontSize: '12.7px', lineHeight: '1.35' }}>
                  <span style={{ fontWeight: 700, color: '#000' }}>{cat.categoryName}:</span>
                  <span style={{ color: '#000' }}>{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ EXPERIENCE ═══ */}
        {content.experience && content.experience.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1px' }}>
                    <span style={{ fontWeight: 700, fontSize: '12.7px', color: '#000' }}>
                      {exp.position}{exp.company ? ` – ${exp.company}` : ''}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '12.7px', color: '#000', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 ? (
                    exp.highlights.length === 1 && exp.highlights[0].length > 100 ? (
                      <p style={{ fontSize: '12.7px', lineHeight: '1.35', textAlign: 'justify', color: '#000', marginTop: '3px' }}>
                        {exp.highlights[0]}
                      </p>
                    ) : (
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {exp.highlights.map((bullet, idx) => bullet ? (
                          <li key={idx} style={{ fontSize: '12.7px', lineHeight: '1.35', color: '#000', paddingLeft: '2px' }}>
                            {bullet}
                          </li>
                        ) : null)}
                      </ul>
                    )
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        {content.projects && content.projects.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.projects.map((proj, idx) => (
                <div key={proj.id}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 6px', fontSize: '12.7px' }}>
                    <span style={{ fontWeight: 700, color: '#000' }}>{idx + 1}. {proj.name}</span>
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
                      <li style={{ fontSize: '12.7px', lineHeight: '1.35', color: '#000', paddingLeft: '2px' }}>
                        {proj.description}
                      </li>
                    )}
                    {proj.highlights && proj.highlights.map((bullet, bIdx) => bullet ? (
                      <li key={bIdx} style={{ fontSize: '12.7px', lineHeight: '1.35', color: '#000', paddingLeft: '2px' }}>
                        {bullet}
                      </li>
                    ) : null)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ EXTRA-CURRICULAR & ACHIEVEMENTS ═══ */}
        {content.achievements && content.achievements.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Extra-Curricular &amp; Achievements
            </h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {content.achievements.map((ach) => ach.title ? (
                <li key={ach.id} style={{ fontSize: '12.7px', lineHeight: '1.35', color: '#000', paddingLeft: '2px' }}>
                  {ach.title}
                </li>
              ) : null)}
            </ul>
          </div>
        )}

        {/* ═══ CERTIFICATIONS ═══ */}
        {content.certifications && content.certifications.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              Certifications
            </h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '3px 0 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {content.certifications.map((cert) => (
                <li key={cert.id} style={{ fontSize: '12.7px', lineHeight: '1.35', color: '#000', paddingLeft: '2px' }}>
                  <span style={{ fontWeight: 700 }}>{cert.issuer ? `${cert.issuer}: ` : ''}</span>
                  {cert.name}
                  {cert.credentialId && (
                    <span style={{ color: '#333' }}>
                      {' '}({cert.credentialId.includes(':') ? cert.credentialId : `ID: ${cert.credentialId}`})
                    </span>
                  )}
                  {cert.issueDate && <span style={{ color: '#666' }}> ({cert.issueDate})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ═══ REFERENCES ═══ */}
        {content.references && content.references.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#000',
                borderBottom: '1px solid #000',
                paddingBottom: '3px',
                marginBottom: '7px',
              }}
            >
              References
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {content.references.map((ref) => (
                <div key={ref.id}>
                  <div style={{ fontWeight: 700, fontSize: '12.7px', color: '#000' }}>
                    {ref.name}{ref.designation ? ` | ${ref.designation}` : ''}{ref.institution ? `, ${ref.institution}` : ''}
                  </div>
                  {ref.email && (
                    <div style={{ fontSize: '12.7px', color: '#000', marginTop: '1px' }}>
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
        )}

        {/* Page number indicator */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '8px',
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '10.7px',
            color: '#777',
          }}
        >
          <span>ATS Standard Layout</span>
        </div>
      </div>
    </div>
  );
}

/* ── CLASSIC ATS ── delegates to Traditional (same layout in PDF) */
export function ClassicAtsDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  return <TraditionalAtsDom content={content} pageView={pageView} />;
}

/* ────────────────────────────────────────────────
   MODERN EXECUTIVE DOM COMPONENT
   Two-column layout matching ModernExecutive PDF
   ──────────────────────────────────────────────── */
export function ModernExecutiveDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full max-w-[800px] bg-white shadow-lg border border-slate-200 mx-auto overflow-hidden"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', display: 'flex', minHeight: '1130px' }}
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
            Executive Format • Multi-Section Ready
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

/* ────────────────────────────────────────────────
   TECHNICAL CLEAN DOM COMPONENT
   Left sidebar + right main, matching the PDF
   ──────────────────────────────────────────────── */
export function TechnicalCleanDom({
  content,
  pageView = 'all',
}: {
  content: ResumeContent;
  pageView?: PageViewMode;
}) {
  const { personalInfo } = content;

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full max-w-[800px] bg-white shadow-lg border border-slate-200 mx-auto overflow-hidden"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', display: 'flex', minHeight: '1130px' }}
      >
        {/* Left Column (Light Sidebar) */}
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
            {'// Technical ATS'}
          </div>
        </div>

        {/* Right Column (Main) */}
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
