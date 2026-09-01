import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  leftColumn: {
    flex: 2,
    backgroundColor: '#ffffff',
    padding: '30pt 25pt',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
    padding: '30pt 18pt',
    color: '#f8fafc',
  },
  // --- Left Column Styles ---
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  title: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb', // Blue 600
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    fontSize: 8,
    color: '#64748b',
    marginBottom: 12,
  },
  sectionLeft: {
    marginBottom: 10,
  },
  sectionHeadingLeft: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 2,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.4,
  },
  itemBlock: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  roleTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  companyText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 8.5,
    color: '#64748b',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.35,
  },
  // --- Right Column Styles ---
  sectionRight: {
    marginBottom: 12,
  },
  sectionHeadingRight: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 2,
    marginBottom: 6,
  },
  rightItemBlock: {
    marginBottom: 6,
  },
  rightItemTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 1,
  },
  rightItemText: {
    fontSize: 8,
    color: '#94a3b8',
    lineHeight: 1.35,
  }
});

export default function ModernExecutive({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Modern Executive`}>
      <Page size="A4" style={styles.page}>
        
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>•  {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>•  {personalInfo.location}</Text>}
          </View>

          {content.summary && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Summary</Text>
              <Text style={styles.summaryText}>{content.summary}</Text>
            </View>
          )}

          {content.education && content.education.length > 0 && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Education</Text>
              {content.education.map((edu) => (
                <View key={edu.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</Text>
                    <Text style={styles.dateText}>
                      {edu.startDate} – {edu.endDate}
                    </Text>
                  </View>
                  <Text style={[styles.companyText, { marginBottom: 1 }]}>{edu.institution}</Text>
                  {edu.gpa && <Text style={[styles.summaryText, { fontSize: 8 }]}>{edu.gpa}</Text>}
                </View>
              ))}
            </View>
          )}

          {content.experience && content.experience.length > 0 && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Experience</Text>
              {content.experience.map((exp) => (
                <View key={exp.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{exp.position}</Text>
                    <Text style={styles.dateText}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.companyText}>
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </Text>
                  <View>
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

          {content.projects && content.projects.length > 0 && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Projects</Text>
              {content.projects.map((proj) => (
                <View key={proj.id} style={styles.itemBlock}>
                  <Text style={styles.roleTitle}>{proj.name}</Text>
                  {proj.technologies && (
                    <Text style={[styles.companyText, { fontSize: 8, marginBottom: 1 }]}>{proj.technologies.join(', ')}</Text>
                  )}
                  {proj.description && <Text style={styles.summaryText}>{proj.description}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column (Dark Sidebar) */}
        <View style={styles.rightColumn}>
          {content.skills && content.skills.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Skills</Text>
              {content.skills.map((cat) => (
                <View key={cat.id} style={styles.rightItemBlock}>
                  <Text style={styles.rightItemTitle}>{cat.categoryName}</Text>
                  <Text style={styles.rightItemText}>{cat.skills.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {content.certifications && content.certifications.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Certifications</Text>
              {content.certifications.map((cert) => (
                <View key={cert.id} style={styles.rightItemBlock}>
                  <Text style={styles.rightItemTitle}>{cert.issuer}: {cert.name}</Text>
                  {cert.credentialId && <Text style={styles.rightItemText}>{cert.credentialId}</Text>}
                </View>
              ))}
            </View>
          )}

          {content.achievements && content.achievements.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Achievements</Text>
              {content.achievements.map((ach) => (
                <View key={ach.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.rightItemText}>• {ach.title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
}

