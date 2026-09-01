import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: '36pt 44pt',
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#334155',
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#0f172a',
    marginBottom: 3,
  },
  title: {
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    fontSize: 8.5,
    color: '#64748b',
    marginBottom: 2,
  },
  divider: {
    marginHorizontal: 3,
    color: '#94a3b8',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 10,
  },
  sectionHeadingContainer: {
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 4,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.45,
    textAlign: 'justify',
  },
  itemBlock: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  companyName: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  locationText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  roleTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  dateText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 9,
    color: '#64748b',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  skillCategoryRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  skillCategoryName: {
    width: '28%',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  skillItems: {
    flex: 1,
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 15,
    right: 44,
    color: '#94a3b8',
    fontFamily: 'Helvetica',
  }
});

export default function ClassicAts({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;

  const formatUrl = (url?: string) => {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  };

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - ATS Classic`}>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <Link src={`mailto:${personalInfo.email}`} style={styles.link}>
                <Text>{personalInfo.email}</Text>
              </Link>
            )}
            {personalInfo.phone && <Text>•  {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>•  {personalInfo.location}</Text>}
            {personalInfo.website && (
              <Link src={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} style={styles.link}>
                <Text>•  {formatUrl(personalInfo.website)}</Text>
              </Link>
            )}
          </View>
          {(personalInfo.linkedin || personalInfo.github) && (
            <View style={styles.contactRow}>
              {personalInfo.linkedin && (
                <Link src={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} style={styles.link}>
                  <Text>LinkedIn: {formatUrl(personalInfo.linkedin)}</Text>
                </Link>
              )}
              {personalInfo.linkedin && personalInfo.github && <Text style={styles.divider}>|</Text>}
              {personalInfo.github && (
                <Link src={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} style={styles.link}>
                  <Text>GitHub: {formatUrl(personalInfo.github)}</Text>
                </Link>
              )}
            </View>
          )}
        </View>

        {/* Summary Section */}
        {content.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Professional Summary</Text>
            </View>
            <Text style={styles.summaryText}>{content.summary}</Text>
          </View>
        )}

        {/* Education Section */}
        {content.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Education</Text>
            </View>
            {content.education.map((edu) => (
              <View key={edu.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{edu.institution}</Text>
                  <Text style={styles.dateText}>
                    {edu.startDate} – {edu.endDate}
                  </Text>
                </View>
                <View style={styles.itemHeader}>
                  <Text style={styles.roleTitle}>
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  {edu.gpa && <Text style={styles.locationText}>{edu.gpa}</Text>}
                </View>
                {edu.highlights && edu.highlights.map((h, idx) => (
                  <Text key={idx} style={[styles.summaryText, { fontSize: 8.5, marginTop: 1 }]}>{h}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {content.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Technical Skills</Text>
            </View>
            {content.skills.map((category) => (
              <View key={category.id} style={styles.skillCategoryRow} wrap={false}>
                <Text style={styles.skillCategoryName}>{category.categoryName}:</Text>
                <Text style={styles.skillItems}>{category.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience Section */}
        {content.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Experience</Text>
            </View>
            {content.experience.map((exp) => (
              <View key={exp.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{exp.company}</Text>
                  <Text style={styles.dateText}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.itemHeader}>
                  <Text style={styles.roleTitle}>{exp.position}</Text>
                  {exp.location && <Text style={styles.locationText}>{exp.location}</Text>}
                </View>
                <View style={{ marginTop: 2 }}>
                  {exp.highlights.map((bullet, idx) => bullet ? (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ) : null)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {content.projects && content.projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Projects</Text>
            </View>
            {content.projects.map((proj) => (
              <View key={proj.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <Text style={styles.companyName}>{proj.name}</Text>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <Text style={[styles.roleTitle, { fontSize: 8.5, color: '#64748b' }]}> | {proj.technologies.join(', ')}</Text>
                    )}
                    {proj.url && (
                      <>
                        <Text style={styles.divider}>|</Text>
                        <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={styles.link}>
                          <Text style={{ fontSize: 8.5 }}>Website Link</Text>
                        </Link>
                      </>
                    )}
                    {proj.githubUrl && (
                      <>
                        <Text style={styles.divider}>|</Text>
                        <Link src={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} style={styles.link}>
                          <Text style={{ fontSize: 8.5 }}>Github</Text>
                        </Link>
                      </>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 2 }}>
                  {proj.description && (
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{proj.description}</Text>
                    </View>
                  )}
                  {proj.highlights && proj.highlights.map((bullet, idx) => bullet ? (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ) : null)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Extra-Curricular & Achievements */}
        {content.achievements && content.achievements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Extra-Curricular & Achievements</Text>
            </View>
            {content.achievements.map((ach) => ach.title ? (
              <View key={ach.id} style={styles.bulletRow} wrap={false}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{ach.title}</Text>
              </View>
            ) : null)}
          </View>
        )}

        {/* Certifications */}
        {content.certifications && content.certifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>Certifications</Text>
            </View>
            {content.certifications.map((cert) => (
              <View key={cert.id} style={styles.bulletRow} wrap={false}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{cert.issuer ? `${cert.issuer}: ` : ''}</Text>
                  {cert.name}
                  {cert.credentialId ? ` (${cert.credentialId.includes(':') ? cert.credentialId : `ID: ${cert.credentialId}`})` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* References */}
        {content.references && content.references.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer} minPresenceAhead={20}>
              <Text style={styles.sectionHeading}>References</Text>
            </View>
            {content.references.map((ref) => (
              <View key={ref.id} style={[styles.itemBlock, { marginBottom: 3 }]} wrap={false}>
                <Text style={styles.companyName}>
                  {ref.name}{ref.designation ? ` | ${ref.designation}` : ''}{ref.institution ? `, ${ref.institution}` : ''}
                </Text>
                {ref.email && (
                  <View style={{ flexDirection: 'row', marginTop: 1 }}>
                    <Text style={[styles.summaryText, { fontSize: 8.5 }]}>Email: </Text>
                    <Link src={`mailto:${ref.email}`} style={[styles.link, { fontSize: 8.5 }]}>
                      <Text>{ref.email}</Text>
                    </Link>
                    {ref.phone && <Text style={[styles.summaryText, { fontSize: 8.5 }]}> | Phone: {ref.phone}</Text>}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Subtle ATS Page Number Footer */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />

      </Page>
    </Document>
  );
}

