import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
    color: '#020617',
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#020617',
    paddingBottom: 4,
  },
  name: {
    fontSize: 19,
    fontFamily: 'Helvetica-Bold',
    color: '#020617',
    letterSpacing: 0.1,
  },
  title: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    marginTop: 1,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 8.5,
    color: '#334155',
  },
  section: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#020617',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    backgroundColor: '#f1f5f9',
    padding: '2 4',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 9,
    color: '#1e293b',
    lineHeight: 1.35,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  companyText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#334155',
  },
  itemDates: {
    fontSize: 8.5,
    color: '#475569',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 8.5,
    color: '#0f172a',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#1e293b',
  },
  skillCategoryRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
  },
  skillCatName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    width: 125,
    color: '#0f172a',
  },
  skillListText: {
    flex: 1,
    fontSize: 8.5,
    color: '#334155',
  },
});

export function TechnicalCleanTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Technical Clean`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>• {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>• {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>• {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text>• {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Technical Skills - Featured First for Tech */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>TECHNICAL SKILLS & TOOLS</Text>
            {skills.map((cat) => (
              <View key={cat.id} style={styles.skillCategoryRow}>
                <Text style={styles.skillCatName}>{cat.categoryName}:</Text>
                <Text style={styles.skillListText}>{cat.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>ENGINEERING EXPERIENCE</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 5 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDates}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={styles.companyText}>{exp.company}</Text>
                  {exp.location && <Text style={styles.itemDates}>{exp.location}</Text>}
                </View>

                {exp.highlights.map((h, i) => (
                  h ? (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>›</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ) : null
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>PROJECTS & ARCHITECTURE</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 4 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.url && <Text style={styles.itemDates}>{proj.url}</Text>}
                </View>
                {proj.description && <Text style={styles.summaryText}>{proj.description}</Text>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8, color: '#475569', marginTop: 1 }}>
                    Tech: {proj.technologies.join(' | ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>EDUCATION</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 3 }}>
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
      </Page>
    </Document>
  );
}
