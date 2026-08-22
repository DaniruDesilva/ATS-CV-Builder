import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: '40pt 50pt',
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#334155',
  },
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#0f172a',
    marginBottom: 6,
  },
  title: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    fontSize: 8.5,
    color: '#64748b',
  },
  section: {
    marginBottom: 14,
  },
  sectionHeadingContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  itemBlock: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  locationText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  roleTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  dateText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 6,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9,
    color: '#94a3b8',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  skillCategoryRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  skillCategoryName: {
    width: '25%',
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  skillItems: {
    flex: 1,
    fontSize: 9.5,
    color: '#475569',
    lineHeight: 1.5,
  }
});

export default function ClassicAts({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - ATS Classic`}>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>•  {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>•  {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>•  {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text>•  {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Summary Section */}
        {content.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <Text style={styles.sectionHeading}>Professional Summary</Text>
            </View>
            <Text style={styles.summaryText}>{content.summary}</Text>
          </View>
        )}

        {/* Experience Section */}
        {content.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <Text style={styles.sectionHeading}>Experience</Text>
            </View>
            {content.experience.map((exp) => (
              <View key={exp.id} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{exp.company}</Text>
                  <Text style={styles.locationText}>{exp.location}</Text>
                </View>
                <View style={styles.itemHeader}>
                  <Text style={styles.roleTitle}>{exp.position}</Text>
                  <Text style={styles.dateText}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={{ marginTop: 4 }}>
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

        {/* Education Section */}
        {content.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <Text style={styles.sectionHeading}>Education</Text>
            </View>
            {content.education.map((edu) => (
              <View key={edu.id} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{edu.institution}</Text>
                  <Text style={styles.dateText}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.roleTitle}>
                  {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {content.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <Text style={styles.sectionHeading}>Skills & Competencies</Text>
            </View>
            {content.skills.map((category) => (
              <View key={category.id} style={styles.skillCategoryRow}>
                <Text style={styles.skillCategoryName}>{category.categoryName}</Text>
                <Text style={styles.skillItems}>{category.skills.join(' • ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {content.projects && content.projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingContainer}>
              <Text style={styles.sectionHeading}>Projects</Text>
            </View>
            {content.projects.map((proj) => (
              <View key={proj.id} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.companyName}>{proj.name}</Text>
                </View>
                {proj.url && <Text style={[styles.roleTitle, { fontSize: 8.5, color: '#3b82f6' }]}>{proj.url}</Text>}
                <Text style={[styles.summaryText, { marginTop: 4 }]}>
                  {proj.description}
                </Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}
