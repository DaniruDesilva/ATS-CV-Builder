import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.35,
    color: '#0f172a',
  },
  topBar: {
    height: 4,
    backgroundColor: '#2563eb',
    marginBottom: 10,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginTop: 2,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 8.5,
    color: '#64748b',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 4,
  },
  section: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2563eb',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  companyText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  itemDates: {
    fontSize: 8.5,
    color: '#64748b',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9,
    color: '#2563eb',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
  },
  skillCategoryRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillCatName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    width: 120,
    color: '#1e293b',
  },
  skillListText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
  },
});

export function ModernExecutiveTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Modern Executive`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>|  {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>|  {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>|  {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text>|  {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>EXECUTIVE SUMMARY</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>PROFESSIONAL EXPERIENCE</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDates}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                  <Text style={styles.companyText}>{exp.company}</Text>
                  {exp.location && <Text style={styles.itemDates}>{exp.location}</Text>}
                </View>

                {exp.highlights.map((h, i) => (
                  h ? (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ) : null
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>CORE COMPETENCIES & SKILLS</Text>
            {skills.map((cat) => (
              <View key={cat.id} style={styles.skillCategoryRow}>
                <Text style={styles.skillCatName}>{cat.categoryName}:</Text>
                <Text style={styles.skillListText}>{cat.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>EDUCATION & CREDENTIALS</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 4 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                  <Text style={styles.itemDates}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.companyText}>{edu.institution}</Text>
                  {edu.gpa && <Text style={styles.itemDates}>GPA: {edu.gpa}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>TECHNICAL PROJECTS</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 4 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.url && <Text style={styles.itemDates}>{proj.url}</Text>}
                </View>
                {proj.description && <Text style={styles.summaryText}>{proj.description}</Text>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8.5, color: '#64748b', marginTop: 1 }}>
                    Stack: {proj.technologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
