import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    paddingTop: '32pt',
    paddingBottom: '36pt',
    paddingHorizontal: '36pt',
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.35,
    color: '#000000',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: 9,
    marginBottom: 2,
  },
  contactItem: {
    marginHorizontal: 3,
  },
  divider: {
    marginHorizontal: 4,
    color: '#555555',
  },
  link: {
    color: '#000000',
    textDecoration: 'underline',
  },
  blueLink: {
    color: '#0056b3',
    textDecoration: 'underline',
  },

  // Section
  section: {
    marginBottom: 9,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 5,
  },

  // Items
  itemBlock: {
    marginBottom: 6,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
  },
  itemSubtitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica',
  },
  itemDate: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
  },
  
  // Bullet points
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    paddingLeft: 6,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.35,
  },

  // Skills
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    marginRight: 4,
  },
  skillList: {
    flex: 1,
  },

  // Paragraph Text
  bodyText: {
    fontSize: 9.5,
    lineHeight: 1.35,
    textAlign: 'justify',
  },

  // Page numbering
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 15,
    right: 36,
    color: '#777777',
    fontFamily: 'Helvetica',
  },
});

export default function TraditionalAtsTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;

  // Clean URLs for display
  const formatUrlForDisplay = (url?: string) => {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  };

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - ATS CV`}>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'DANIRU DE SILVA'}</Text>
          {personalInfo.jobTitle && (
            <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
          )}
          
          {/* Contact Line 1 */}
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <Link src={`mailto:${personalInfo.email}`} style={styles.link}>
                <Text>{personalInfo.email}</Text>
              </Link>
            )}
            {personalInfo.email && personalInfo.phone && <Text style={styles.divider}>|</Text>}
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
            {personalInfo.phone && personalInfo.location && <Text style={styles.divider}>|</Text>}
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
            {personalInfo.location && personalInfo.website && <Text style={styles.divider}>|</Text>}
            {personalInfo.website && (
              <Link src={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} style={styles.link}>
                <Text>{formatUrlForDisplay(personalInfo.website)}</Text>
              </Link>
            )}
          </View>

          {/* Contact Line 2: LinkedIn & GitHub */}
          {(personalInfo.linkedin || personalInfo.github) && (
            <View style={styles.contactRow}>
              {personalInfo.linkedin && (
                <View style={{ flexDirection: 'row' }}>
                  <Text>LinkedIn: </Text>
                  <Link src={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} style={styles.link}>
                    <Text>{formatUrlForDisplay(personalInfo.linkedin)}</Text>
                  </Link>
                </View>
              )}
              {personalInfo.linkedin && personalInfo.github && <Text style={styles.divider}>|</Text>}
              {personalInfo.github && (
                <View style={{ flexDirection: 'row' }}>
                  <Text>GitHub: </Text>
                  <Link src={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} style={styles.link}>
                    <Text>{formatUrlForDisplay(personalInfo.github)}</Text>
                  </Link>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Summary */}
        {content.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Summary</Text>
            <Text style={styles.bodyText}>{content.summary}</Text>
          </View>
        )}

        {/* Education */}
        {content.education && content.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Education</Text>
            {content.education.map((edu, idx) => (
              <View key={edu.id || idx} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {`${idx + 1}. ${edu.degree || ''}`}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    {edu.startDate || edu.endDate ? ` | ${edu.startDate ? edu.startDate + ' – ' : ''}${edu.endDate || ''}` : ''}
                  </Text>
                </View>
                {edu.institution && (
                  <Text style={styles.itemSubtitle}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
                )}
                {edu.gpa && (
                  <Text style={styles.itemSubtitle}>{edu.gpa}</Text>
                )}
                {edu.highlights && edu.highlights.length > 0 && (
                  <View style={{ marginTop: 1 }}>
                    {edu.highlights.map((h, hIdx) => h ? (
                      <Text key={hIdx} style={styles.itemSubtitle}>{h}</Text>
                    ) : null)}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Technical Skills */}
        {content.skills && content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Technical Skills</Text>
            {content.skills.map((cat) => (
              <View key={cat.id} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillCategory}>{cat.categoryName}: </Text>
                <Text style={styles.skillList}>{cat.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {content.experience && content.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Experience</Text>
            {content.experience.map((exp) => (
              <View key={exp.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {exp.position}{exp.company ? ` – ${exp.company}` : ''}
                  </Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                {exp.highlights && exp.highlights.length > 0 ? (
                  exp.highlights.length === 1 && exp.highlights[0].length > 100 ? (
                    <Text style={[styles.bodyText, { marginTop: 2 }]}>{exp.highlights[0]}</Text>
                  ) : (
                    <View style={{ marginTop: 2 }}>
                      {exp.highlights.map((bullet, bIdx) => bullet ? (
                        <View key={bIdx} style={styles.bulletRow}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletText}>{bullet}</Text>
                        </View>
                      ) : null)}
                    </View>
                  )
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {content.projects && content.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Projects</Text>
            {content.projects.map((proj, idx) => (
              <View key={proj.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <Text style={styles.itemTitle}>{`${idx + 1}. ${proj.name}`}</Text>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <Text style={styles.itemSubtitle}> | {proj.technologies.join(', ')}</Text>
                    )}
                    {proj.url && (
                      <>
                        <Text style={styles.divider}>|</Text>
                        <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={styles.blueLink}>
                          <Text>Website Link</Text>
                        </Link>
                      </>
                    )}
                    {proj.githubUrl && (
                      <>
                        <Text style={styles.divider}>|</Text>
                        <Link src={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} style={styles.blueLink}>
                          <Text>Github</Text>
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
                  {proj.highlights && proj.highlights.map((bullet, bIdx) => bullet ? (
                    <View key={bIdx} style={styles.bulletRow}>
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
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Extra-Curricular & Achievements</Text>
            <View style={{ marginTop: 2 }}>
              {content.achievements.map((ach) => ach.title ? (
                <View key={ach.id} style={styles.bulletRow} wrap={false}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{ach.title}</Text>
                </View>
              ) : null)}
            </View>
          </View>
        )}

        {/* Certifications */}
        {content.certifications && content.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>Certifications</Text>
            <View style={{ marginTop: 2 }}>
              {content.certifications.map((cert) => (
                <View key={cert.id} style={styles.bulletRow} wrap={false}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>{cert.issuer ? `${cert.issuer}: ` : ''}</Text>
                    {cert.name}
                    {cert.credentialId ? ` (${cert.credentialId.includes(':') ? cert.credentialId : `ID: ${cert.credentialId}`})` : ''}
                    {cert.issueDate ? ` (${cert.issueDate})` : ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* References */}
        {content.references && content.references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={20}>References</Text>
            {content.references.map((ref) => (
              <View key={ref.id} style={[styles.itemBlock, { marginBottom: 4 }]} wrap={false}>
                <Text style={styles.itemTitle}>
                  {ref.name}{ref.designation ? ` | ${ref.designation}` : ''}{ref.institution ? `, ${ref.institution}` : ''}
                </Text>
                {ref.email && (
                  <View style={{ flexDirection: 'row', marginTop: 1 }}>
                    <Text style={styles.itemSubtitle}>Email: </Text>
                    <Link src={`mailto:${ref.email}`} style={styles.link}>
                      <Text style={styles.itemSubtitle}>{ref.email}</Text>
                    </Link>
                    {ref.phone && <Text style={styles.itemSubtitle}> | Phone: {ref.phone}</Text>}
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


